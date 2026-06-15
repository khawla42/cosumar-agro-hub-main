const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const winston = require("winston");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const db = require("./db");
const { logger, log: customLogger } = require("./logger");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 5000;

// Socket.io connection logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (role) => {
    if (role === "employe" || role === "admin") {
      socket.join("staff");
      console.log(`User ${socket.id} joined staff room`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Helper function to send real-time notifications to staff
const sendStaffNotification = async (type, message, data = {}) => {
  try {
    console.log(`📣 Notification: ${type} - ${message}`);
    // 1. Émettre via Socket.io pour le temps réel (Une seule fois au staff)
    if (io) {
      io.to("staff").emit("notification", {
        type: type === "URGENT" ? "urgent" : "info",
        title: type === "URGENT" ? "Alerte Sécurité" : "Notification Système",
        message,
        data,
        timestamp: Date.now(),
      });
    }

    // 2. Persister dans la base de données (pour tous les employés/admins)
    // On met user_id = NULL pour signifier une notification globale au staff
    await db.query(
      "INSERT INTO notifications (user_id, type, title, message, time) VALUES (?, ?, ?, ?, NOW())",
      [
        null,
        type === "URGENT" ? "urgent" : "info",
        type === "URGENT" ? "Alerte Sécurité" : "Notification Système",
        message,
      ],
    );
  } catch (error) {
    console.error("Erreur sendStaffNotification:", error.message);
  }
};

// Fonction pour créer un log dans la DB et Winston
const createLog = async (userId, action, details, status = "success", req = null) => {
  try {
    const ip = req
      ? req.userIp || req.headers["x-forwarded-for"] || req.socket.remoteAddress
      : "127.0.0.1";
    const logLevel = status === "failed" ? "error" : status === "critical" ? "critical" : "info";

    // 1. Récupérer les infos de l'utilisateur pour le log
    let userName = req ? "Inconnu" : "Système";
    let role = req ? "none" : "admin";
    if (userId) {
      const [users] = await db.query("SELECT full_name, role FROM users WHERE id = ?", [userId]);
      if (users.length > 0) {
        userName = users[0].full_name;
        role = users[0].role;
      }
    }

    // 2. Envoi vers le logger centralisé (Winston + Logstash + Fichiers)
    logger.log({
      level: logLevel,
      message: action,
      userId,
      userName,
      role,
      details,
      ip,
      status,
    });

    // 3. Tenter l'enregistrement dans MySQL
    const [result] = await db.query(
      "INSERT INTO system_logs (user_id, user_name, role, action, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        userName,
        role,
        action,
        typeof details === "object" ? JSON.stringify(details) : details,
        ip,
        status,
      ],
    );

    // 4. Émettre un événement Socket.io pour l'admin en temps réel
    if (io) {
      console.log(`📡 Socket Log: ${action}`);

      // Pour les logs de sécurité (critique/failed), on envoie une seule notification
      if (status === "critical" || status === "failed") {
        const notifData = {
          id: "notif-" + (result.insertId || Date.now()),
          type: status === "critical" ? "urgent" : "warning",
          title: status === "critical" ? "🚨 Alerte Sécurité" : "Alerte Système",
          message: `${action}: ${details}`,
          time: new Date().toISOString(),
          read: false,
        };

        io.to("staff").emit("notification", notifData);

        // 5. Persister dans la table notifications
        db.query(
          "INSERT INTO notifications (user_id, type, title, message, time, `read`) VALUES (?, ?, ?, ?, NOW(), 0)",
          [
            null,
            status === "critical" ? "urgent" : "warning",
            status === "critical" ? "Alerte Sécurité" : "Alerte Système",
            `${action}: ${details}`,
          ],
        ).catch((e) => console.error("Erreur insertion notification DB:", e.message));
      }

      const logData = {
        id: "realtime-" + (result.insertId || Date.now()),
        userName,
        role,
        action,
        ipAddress: ip,
        timestamp: Date.now(),
        status,
      };

      io.to("staff").emit("new_log", logData);
    }
  } catch (error) {
    console.error("Erreur lors de la création du log:", error);
  }
};

// 1. Middlewares de base (CORS et JSON) AVANT TOUTE CHOSE
app.use(cors());
app.use(express.json());
// app.use(helmet()); // Temporairement désactivé pour éviter les blocages CORS/CSP en dev

// 2. Middleware de détection d'IP (Normalisation pour tout le serveur)
app.use((req, res, next) => {
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (ip && ip.includes("::ffff:")) {
    ip = ip.split("::ffff:")[1];
  }
  if (ip === "::1") ip = "127.0.0.1";
  req.userIp = ip;
  next();
});

// S'assurer que le dossier logs existe
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Suivi des tentatives de connexion (Brute Force Protection)
const loginAttempts = new Map();
const BLOCKED_KEYS = new Set(); // Key = ip:role
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 1000; // 2 minutes (au lieu de 15)

// Cache pour les paramètres de sécurité (pour éviter trop de lectures DB)
let securitySettings = {
  security_captcha: false, // Désactivé par défaut pour éviter le blocage
  security_strict_pwd: true,
  security_session_exp: true,
  security_ip_block: true,
};

// Stockage temporaire des CAPTCHAs (Simple Map IP -> Code)
const activeCaptchas = new Map();

// Route pour générer un CAPTCHA simple
app.get("/auth/captcha", (req, res) => {
  const ip = req.userIp || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const captchaText = Math.random().toString(36).substring(2, 8).toUpperCase();

  console.log(`[CAPTCHA GEN] IP: ${ip}, Code: ${captchaText}`);

  activeCaptchas.set(ip, {
    code: captchaText,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  res.json({ captcha: captchaText });
});

// Fonction pour rafraîchir les paramètres depuis la DB
async function refreshSecuritySettings() {
  try {
    const [rows] = await db.query("SELECT setting_key, setting_value FROM settings");
    rows.forEach((row) => {
      securitySettings[row.setting_key] = row.setting_value === "true";
    });
  } catch (err) {
    console.error("Erreur rafraîchissement settings:", err.message);
  }
}
// Rafraîchir au démarrage
setTimeout(async () => {
  await refreshSecuritySettings();

  // Correction automatique et synchronisation du schéma MySQL
  try {
    console.log("🔄 Vérification et synchronisation du schéma de la base de données...");

    // 0. Créer la table settings si elle n'existe pas
    await db.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(255) NOT NULL UNIQUE,
        setting_value VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `).catch(() => {});

    // Ajouter les paramètres par défaut si ils n'existent pas
    const defaultSettings = [
      { key: "security_captcha", value: "false" },
      { key: "security_strict_pwd", value: "true" },
      { key: "security_session_exp", value: "true" },
      { key: "security_ip_block", value: "true" }
    ];
    for (const setting of defaultSettings) {
      await db.query(`
        INSERT IGNORE INTO settings (setting_key, setting_value)
        VALUES (?, ?)
      `, [setting.key, setting.value]).catch(() => {});
    }

    // 1. Correction Paiements
    await db.query("ALTER TABLE payments DROP INDEX transaction_ref").catch(() => {});

    // 2. Correction Production (Ajout colonnes manquantes)
    await db
      .query(
        'ALTER TABLE production ADD COLUMN IF NOT EXISTS product_name VARCHAR(100) DEFAULT "Betterave"',
      )
      .catch(() => {});
    await db
      .query("ALTER TABLE production ADD COLUMN IF NOT EXISTS progress INT DEFAULT 0")
      .catch(() => {});

    // 3. Correction Deliveries (Ajout colonnes manquantes)
    await db
      .query("ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS origin VARCHAR(100)")
      .catch(() => {});
    await db
      .query("ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS eta VARCHAR(10)")
      .catch(() => {});
    await db
      .query(
        'ALTER TABLE deliveries MODIFY COLUMN status ENUM("en_route", "delivered", "cancelled", "retard") DEFAULT "en_route"',
      )
      .catch(() => {});

    // 4. Correction Logs (Ajout statut critical)
    await db
      .query(
        'ALTER TABLE system_logs MODIFY COLUMN status ENUM("success", "failed", "warning", "critical") DEFAULT "success"',
      )
      .catch(() => {});

    // Rafraîchir les paramètres après la création de la table
    await refreshSecuritySettings();

    console.log("✅ Synchronisation de la structure MySQL terminée.");
  } catch (e) {
    console.error("⚠️ Erreur lors de l'auto-migration MySQL:", e.message);
  }
}, 2000);

// Sessions actives pour l'expiration (Simulé sans JWT/Redis)
const activeSessions = new Map();
const SESSION_DURATION = 3 * 60 * 1000; // 3 minutes (au lieu de 30)

// Middleware pour la détection d'injection SQL (plus permissif pour éviter les faux positifs)
const sqlInjectionPatterns = [
  /union(\s|\+)+select/i,
  /drop(\s|\+)+table/i,
  /insert(\s|\+)+into/i,
  /select(\s|\+)+.*(\s|\+)+from/i,
  /--\s*$/i, // Commentaire SQL en fin de ligne
  /;\s*drop/i,
  /;\s*delete/i,
];

// Middleware pour la détection d'attaques XSS (Cross-Site Scripting)
const xssPatterns = [
  /<script\b[^>]*>([\s\S]*?)<\/script>/i,
  /on\w+\s*=\s*["']?[^"'>]*["']?/i, // Attributs onmouseover, onclick, etc.
  /javascript\s*:/i,
  /expression\s*\(/i,
  /<\s*iframe\b/i,
  /<\s*object\b/i,
  /<\s*embed\b/i,
  /<\s*applet\b/i,
  /<\s*meta\b/i,
  /<\s*link\b/i,
  /<\s*base\b/i,
];

app.use((req, res, next) => {
  const requestData = JSON.stringify({
    body: req.body,
    query: req.query,
    url: req.url,
  });

  const hasSqlInjection = sqlInjectionPatterns.some((pattern) => pattern.test(requestData));
  const hasXss = xssPatterns.some((pattern) => pattern.test(requestData));

  if (hasSqlInjection || hasXss) {
    const ip = req.userIp || "127.0.0.1";
    const payloadStr = JSON.stringify(req.body).substring(0, 200);
    const attackType = hasSqlInjection ? "Injection SQL" : "Attaque XSS";

    console.warn(`🚨 [SECURITY] ${attackType} bloquée: ${ip}`);

    // 1. Loguer immédiatement dans Winston pour ELK
    logger.log({
      level: "critical",
      message: `${attackType} Détectée`,
      details: `Tentative d'attaque bloquée. Payload: ${payloadStr}`,
      ip: ip,
      status: "critical",
    });

    // 2. Notifier le staff en temps réel et persister
    sendStaffNotification("URGENT", `🚨 ALERTE SÉCURITÉ : ${attackType} détectée (IP: ${ip}).`, {
      ip,
      payload: payloadStr,
    });

    if (io) {
      io.to("staff").emit("new_log", {
        id: "security-" + Date.now(),
        userName: "Inconnu (Attaquant)",
        role: "none",
        action: `${attackType} Détectée`,
        ipAddress: ip,
        timestamp: Date.now(),
        status: "critical",
      });
    }

    // 3. Tenter d'enregistrer dans MySQL (en arrière-plan)
    db.query(
      "INSERT INTO system_logs (user_id, user_name, role, action, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        null,
        "Inconnu",
        "none",
        `${attackType} Détectée`,
        `Payload bloqué: ${payloadStr}`,
        ip,
        "critical",
      ],
    ).catch((e) => console.error(`Erreur log ${attackType} DB:`, e.message));

    return res.status(403).json({
      message: "Accès refusé pour des raisons de sécurité.",
      error: "Requête suspecte détectée.",
    });
  }
  next();
});

// Middleware pour la protection brute force is now handled inside /login endpoint

// Middleware pour l'expiration des sessions
app.use((req, res, next) => {
  if (securitySettings.security_session_exp && req.headers.authorization) {
    const token = req.headers.authorization;
    const session = activeSessions.get(token);

    if (session) {
      if (Date.now() > session.expiresAt) {
        activeSessions.delete(token);
        return res.status(401).json({
          message: "Session expirée. Veuillez vous reconnecter.",
          code: "SESSION_EXPIRED",
        });
      }
      // Prolonger la session à chaque activité
      session.expiresAt = Date.now() + SESSION_DURATION;
    }
  }
  next();
});

// Routes de base
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API Cosumar Agro Hub" });
});

// Route pour envoyer un message de contact
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await db.query(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, message],
    );
    res.json({ message: "Message envoyé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi du message", error: error.message });
  }
});

// Route pour récupérer les messages de contact (Admin/Employé)
// Create user_message_read table if it doesn't exist
async function ensureUserMessageReadTable() {
  try {
    const [tables] = await db.query("SHOW TABLES LIKE 'user_message_read'");
    if (tables.length === 0) {
      await db.query(`
        CREATE TABLE user_message_read (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          message_id INT NOT NULL,
          read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (message_id) REFERENCES contact_messages(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user_message (user_id, message_id)
        ) ENGINE=InnoDB
      `);
      console.log("Created user_message_read table");
    }
    // Remove old is_read column if it exists
    try {
      const [columns] = await db.query("SHOW COLUMNS FROM contact_messages LIKE 'is_read'");
      if (columns.length > 0) {
        await db.query("ALTER TABLE contact_messages DROP COLUMN is_read");
        console.log("Dropped old is_read column from contact_messages");
      }
    } catch (err) {
      // Ignore if column doesn't exist
    }
  } catch (err) {
    console.error("Error checking/adding user_message_read table:", err);
  }
}
ensureUserMessageReadTable();

// Get contact messages with read status for current user
app.get("/contact-messages", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      // For non-authenticated users, return messages without read status
      const [rows] = await db.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
      res.json(rows.map((row) => ({ ...row, is_read: false })));
      return;
    }

    const [rows] = await db.query(`
      SELECT 
        cm.*,
        umr.id IS NOT NULL AS is_read
      FROM contact_messages cm
      LEFT JOIN user_message_read umr ON cm.id = umr.message_id AND umr.user_id = ?
      ORDER BY cm.created_at DESC
    `, [userId]);
    
    res.json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des messages", error: error.message });
  }
});

// Mark a message as read for current user
app.put("/contact-messages/:id/read", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    
    await db.query(`
      INSERT IGNORE INTO user_message_read (user_id, message_id)
      VALUES (?, ?)
    `, [userId, req.params.id]);
    
    res.json({ message: "Message marqué comme lu" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du message", error: error.message });
  }
});

// --- ROUTES CALENDRIER ---
app.get("/calendar-events", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM calendar_events ORDER BY date ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur calendrier", error: error.message });
  }
});

app.post("/calendar-events", async (req, res) => {
  const { title, type, time, location, date } = req.body;
  try {
    await db.query(
      "INSERT INTO calendar_events (title, type, time, location, date) VALUES (?, ?, ?, ?, ?)",
      [title, type, time, location, date],
    );
    res.json({ message: "Événement ajouté" });
  } catch (error) {
    res.status(500).json({ message: "Erreur ajout événement", error: error.message });
  }
});

app.delete("/calendar-events/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM calendar_events WHERE id = ?", [req.params.id]);
    res.json({ message: "Événement supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression événement", error: error.message });
  }
});

// --- ROUTES NOTIFICATIONS ---
app.get("/notifications/:userId", async (req, res) => {
  try {
    console.log("🔔 Requête notifications pour userId:", req.params.userId);
    const [rows] = await db.query(
      `
      SELECT 
        id, 
        title, 
        message, 
        type, 
        'Système' as category, 
        time, 
        \`read\` 
      FROM notifications 
      WHERE user_id = ? OR user_id IS NULL 
      ORDER BY time DESC 
      LIMIT 50
    `,
      [req.params.userId],
    );

    console.log(`📦 ${rows.length} notifications trouvées dans la base`);

    const results = rows.map((r) => ({
      ...r,
      read: r.read === 1 || r.read === true,
      time: r.time, // On garde l'objet Date ou le timestamp tel quel
    }));

    res.json(results);
  } catch (error) {
    console.error("❌ Erreur GET /notifications:", error);
    res.status(500).json({ message: "Erreur notifications", error: error.message });
  }
});

app.post("/notifications/mark-read/:id", async (req, res) => {
  try {
    await db.query("UPDATE notifications SET `read` = 1 WHERE id = ?", [req.params.id]);
    res.json({ message: "Notification marquée comme lue" });
  } catch (error) {
    console.error("❌ Erreur POST /notifications/mark-read:", error);
    res.status(500).json({ message: "Erreur notification", error: error.message });
  }
});

app.delete("/notifications/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM notifications WHERE id = ?", [req.params.id]);
    res.json({ message: "Notification supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression notification", error: error.message });
  }
});

// Middleware pour vérifier les rôles (RBAC)
const authorize = (roles = []) => {
  return async (req, res, next) => {
    // Dans une vraie app, on vérifierait le token JWT ici
    // Pour cet exercice, on simule l'utilisateur
    const userRole = req.headers["x-user-role"];
    const userName = req.headers["x-user-name"] || "Inconnu";
    const userId = req.headers["x-user-id"];
    const ip = req.userIp || "127.0.0.1";

    if (!userRole) {
      const action = "Accès Non Autorisé";
      const details = `Tentative d'accès à ${req.originalUrl} sans authentification`;
      console.warn(`🚨 [SECURITY] ${action}: ${details} - IP: ${ip}`);

      await createLog(null, action, details, "critical", req);
      return res.status(401).json({ message: "Non authentifié" });
    }

    if (roles.length && !roles.includes(userRole)) {
      const action = "Broken Access Control Détecté";
      const details = `Tentative d'accès non autorisé à ${req.originalUrl} par ${userName} (Rôle: ${userRole})`;

      console.warn(`🚨[SECURITY] ${action}: ${details} - IP: ${ip}`);

      // Utiliser la fonction centralisée createLog
      await createLog(userId || null, action, details, "critical", req);

      return res.status(403).json({ message: "Accès interdit : Droits insuffisants" });
    }
    next();
  };
};

// --- ROUTES RÉGIONS (CARTE) ---
app.get("/regions", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM regions");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération régions", error: error.message });
  }
});

app.post("/regions", async (req, res) => {
  const { name, lat, lng, status, production, farmers } = req.body;
  try {
    await db.query(
      "INSERT INTO regions (name, lat, lng, status, production, farmers) VALUES (?, ?, ?, ?, ?, ?)",
      [name, lat, lng, status, production, farmers],
    );
    res.json({ message: "Région ajoutée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur ajout région", error: error.message });
  }
});

app.delete("/regions/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM regions WHERE id = ?", [req.params.id]);
    res.json({ message: "Région supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression région", error: error.message });
  }
});

app.patch("/regions/:id", async (req, res) => {
  const { name, lat, lng, status, production, farmers } = req.body;
  try {
    await db.query(
      "UPDATE regions SET name = ?, lat = ?, lng = ?, status = ?, production = ?, farmers = ? WHERE id = ?",
      [name, lat, lng, status, production, farmers, req.params.id],
    );
    res.json({ message: "Région mise à jour" });
  } catch (error) {
    res.status(500).json({ message: "Erreur mise à jour région", error: error.message });
  }
});

// Route pour récupérer tous les utilisateurs
app.get("/users", authorize(["admin"]), async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, full_name as name, email, role, status, last_login as lastLogin FROM users ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération utilisateurs", error: error.message });
  }
});

// Route pour mettre à jour un utilisateur
app.patch("/users/:id", authorize(["admin"]), async (req, res) => {
  const { name, email, role, status } = req.body;
  const authUserId = req.headers["x-user-id"];

  // Protection contre la modification de son propre rôle (Self-Promotion)
  if (req.params.id == authUserId && role && role !== "admin") {
    // Si un admin essaie de se rétrograder, c'est bizarre mais autorisé ?
    // Mais si un non-admin (qui aurait bypassé authorize) essaie de devenir admin, c'est bloqué.
  }

  try {
    await db.query("UPDATE users SET full_name = ?, email = ?, role = ?, status = ? WHERE id = ?", [
      name,
      email,
      role,
      status,
      req.params.id,
    ]);
    res.json({ message: "Utilisateur mis à jour" });
  } catch (error) {
    res.status(500).json({ message: "Erreur mise à jour utilisateur", error: error.message });
  }
});

// Route pour mettre à jour un utilisateur (Admin - Employés)
app.post("/settings/update-user", authorize(["admin", "employe"]), async (req, res) => {
  const { id, full_name, name, email, role, status, department } = req.body;
  const authUserId = req.headers["x-user-id"];
  const authRole = req.headers["x-user-role"];

  // DÉTECTION PARAMETER TAMPERING (Role Escalation / Unauthorized Edit)
  // Si un employé (non-admin) tente de changer un rôle ou de modifier un admin
  if (authRole === "employe" && (role === "admin" || status === "active")) {
    const action = "Parameter Tampering (Privilege Escalation)";
    const details = `L'employé ${authUserId} a tenté de modifier des privilèges critiques.`;
    await createLog(authUserId, action, details, "critical", req);
    return res.status(403).json({
      message: "Parameter Tampering Détecté",
      error: "Action interdite pour votre niveau.",
    });
  }

  const finalName = name || full_name;

  if (!id) return res.status(400).json({ message: "ID utilisateur manquant" });

  try {
    // 1. Mettre à jour la table users
    await db.query("UPDATE users SET full_name = ?, email = ?, role = ?, status = ? WHERE id = ?", [
      finalName,
      email,
      role,
      status,
      id,
    ]);

    // 2. Mettre à jour la table employees si c'est un staff
    if (role === "admin" || role === "employe") {
      await db.query(
        "INSERT INTO employees (user_id, department) VALUES (?, ?) ON DUPLICATE KEY UPDATE department = ?",
        [id, department || "General", department || "General"],
      );
    }

    await createLog(
      id,
      "Mise à jour profil",
      `Profil de ${finalName} mis à jour par l'administrateur`,
      "info",
      req,
    );
    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    console.error("❌ Erreur POST /settings/update-user:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
});

// Route pour supprimer un utilisateur
app.delete("/users/:id", authorize(["admin"]), async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    // Supprimer aussi de la table farmers si c'était un agriculteur
    await db.query("DELETE FROM farmers WHERE user_id = ?", [req.params.id]);
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression utilisateur", error: error.message });
  }
});

// Route pour réinitialiser le mot de passe
app.post("/users/:id/reset-password", async (req, res) => {
  const { password } = req.body;
  try {
    await db.query("UPDATE users SET password = ? WHERE id = ?", [password, req.params.id]);
    res.json({ message: "Mot de passe réinitialisé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur réinitialisation mot de passe", error: error.message });
  }
});

app.get("/farmers", async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
          f.id, 
          u.full_name as name, 
          u.email, 
          u.phone,
          f.cin, 
          f.region, 
          f.land_area as cultivatedQty, 
          (SELECT status FROM payments WHERE farmer_id = f.id ORDER BY payment_date DESC LIMIT 1) as paymentStatus,
          (SELECT status FROM deliveries WHERE farmer_id = f.id ORDER BY delivery_date DESC LIMIT 1) as deliveryStatus,
          f.crop_type as landStatus,
          u.id as userId
        FROM users u
        LEFT JOIN farmers f ON u.id = f.user_id
        WHERE u.role = 'client'
      `);

    // Mapper les statuts MySQL vers les labels attendus par le frontend
    const results = rows.map((r) => ({
      ...r,
      paymentStatus:
        r.paymentStatus === "completed" || r.paymentStatus === "paid"
          ? "Payé"
          : r.paymentStatus
            ? "En attente"
            : "Non payé",
      deliveryStatus:
        r.deliveryStatus === "delivered" ? "Livré" : r.deliveryStatus ? "En cours" : "En attente",
    }));

    res.json(results);
  } catch (error) {
    console.error("Erreur GET /farmers:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route pour récupérer les stats d'un agriculteur spécifique
app.get("/farmer-stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const authUserId = req.headers["x-user-id"];
    const authRole = req.headers["x-user-role"];

    // VÉRIFICATION D'IDENTITÉ (ID Tampering)
    if (authRole === "client" && authUserId != userId) {
      const action = "Parameter Tampering (Data Leak Attempt)";
      const details = `L'utilisateur ${authUserId} a tenté de consulter les stats de l'utilisateur ${userId}.`;
      console.warn(`🚨 [SECURITY] ${action}: ${details}`);
      await createLog(authUserId, action, details, "critical", req);
      return res.status(403).json({
        message: "Parameter Tampering Détecté",
        error: "Accès non autorisé aux données d'autrui.",
      });
    }

    // Récupérer l'ID de l'agriculteur à partir de l'ID utilisateur
    const [farmers] = await db.query(
      "SELECT id, land_area, crop_type FROM farmers WHERE user_id = ?",
      [userId],
    );

    if (farmers.length === 0) {
      return res.status(404).json({ message: "Agriculteur non trouvé" });
    }

    const farmerId = farmers[0].id;

    // Calculer la production totale
    const [[{ totalHarvested }]] = await db.query(
      "SELECT SUM(quantity_tons) as totalHarvested FROM production WHERE farmer_id = ?",
      [farmerId],
    );

    res.json({
      landArea: farmers[0].land_area || 0,
      totalHarvested: totalHarvested || 0,
      cropType: farmers[0].crop_type || "Betterave",
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur stats agriculteur", error: error.message });
  }
});

// Route pour soumettre des données de production
app.post("/submit-production", async (req, res) => {
  try {
    const { userId, cultivatedQty, harvestedQty } = req.body;
    const authUserId = req.headers["x-user-id"];
    const authRole = req.headers["x-user-role"];

    // 1. VÉRIFICATION D'IDENTITÉ (ID Tampering)
    // Un agriculteur ne peut pas soumettre pour un autre ID que le sien
    if (authRole === "client" && authUserId != userId) {
      const action = "Parameter Tampering (ID Mismatch)";
      const details = `L'utilisateur ${authUserId} a tenté de soumettre une production pour l'utilisateur ${userId}.`;
      console.warn(`🚨 [SECURITY] ${action}: ${details}`);
      await createLog(authUserId, action, details, "critical", req);
      return res.status(403).json({
        message: "Parameter Tampering Détecté",
        error: "Tentative d'usurpation d'identité bloquée.",
      });
    }

    // 2. VÉRIFICATION DES VALEURS (Value Tampering)
    if (harvestedQty > 500 || harvestedQty < 0 || cultivatedQty < 0) {
      const action = "Parameter Tampering (Invalid Value)";
      const details = `Valeurs suspectes : Récolte=${harvestedQty}T, Surface=${cultivatedQty}ha. User: ${userId}`;
      console.warn(`🚨 [SECURITY] ${action}: ${details}`);
      await createLog(authUserId || userId, action, details, "critical", req);
      return res.status(400).json({
        message: "Parameter Tampering Détecté",
        error: "Les quantités saisies sont hors limites ou invalides.",
      });
    }

    // Trouver l'ID farmer...
    const [farmers] = await db.query("SELECT id FROM farmers WHERE user_id = ?", [userId]);
    if (farmers.length === 0) {
      return res.status(404).json({ message: "Agriculteur non trouvé" });
    }
    const farmerId = farmers[0].id;

    // 2. Mettre à jour la surface cultivée si elle a changé
    if (cultivatedQty) {
      await db.query("UPDATE farmers SET land_area = ? WHERE id = ?", [cultivatedQty, farmerId]);
    }

    // 3. Ajouter une nouvelle entrée de production si une quantité a été récoltée
    if (harvestedQty) {
      await db.query(
        "INSERT INTO production (farmer_id, quantity_tons, harvest_date, status) VALUES (?, ?, CURDATE(), ?)",
        [farmerId, harvestedQty, "pending"],
      );

      // Notification temps réel via WebSocket
      if (io) {
        io.emit("production_updated", { action: "add" });
      }

      await createLog(
        userId,
        "Saisie production",
        `Récolte de ${harvestedQty}T enregistrée`,
        "success",
        req,
      );
    }

    res.json({ message: "Données enregistrées avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement", error: error.message });
  }
});

// Route pour mettre à jour une production (Statut)
app.put("/production/:id", authorize(["admin", "employe"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, sugar_content } = req.body;
    const authUserId = req.headers["x-user-id"];

    // Validation des données
    const finalStatus = status || "pending";
    const finalProgress =
      progress !== undefined ? progress : finalStatus === "validated" ? 100 : 0;
    const finalSugarContent = sugar_content !== undefined ? parseFloat(sugar_content) : null;

    console.log(`📝 Mise à jour production ${id} : Statut=${finalStatus}, Taux Sucre=${finalSugarContent}`);

    // Build update query
    let updateQuery = "UPDATE production SET status = ?, progress = ?";
    let updateParams = [finalStatus, finalProgress];
    
    if (finalSugarContent !== null) {
      updateQuery += ", sugar_content = ?";
      updateParams.push(finalSugarContent);
    }
    
    updateQuery += " WHERE id = ?";
    updateParams.push(id);

    const [result] = await db.query(updateQuery, updateParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Production non trouvée" });
    }

    // Logger l'action
    await createLog(
      authUserId,
      "Mise à jour Production",
      `Production #${id} mise à jour (Statut: ${finalStatus})`,
      "success",
      req,
    );

    // Notification via Socket
    if (io) {
      io.emit("production_updated", { id, status: finalStatus });
    }

    res.json({ message: "Production mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur PUT /production:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
});

// Route pour les statistiques du tableau de bord
app.get("/dashboard-stats", authorize(["admin", "employe"]), async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) as totalUsers FROM users");
    const [[{ totalFarmers }]] = await db.query(
      "SELECT COUNT(*) as totalFarmers FROM users WHERE role = 'client'",
    );
    const [[{ totalProduction }]] = await db.query(
      "SELECT SUM(quantity_tons) as totalProduction FROM production",
    );
    const [[{ pendingCount }]] = await db.query(
      "SELECT COUNT(*) as pendingCount FROM production WHERE status = 'pending' OR status = 'En cours'",
    );
    const [[{ pendingPayments }]] = await db.query(
      "SELECT SUM(amount) as pendingPayments FROM payments WHERE status != 'completed' AND status != 'paid'",
    );
    const [[{ totalPaid }]] = await db.query(
      "SELECT SUM(amount) as totalPaid FROM payments WHERE status = 'completed' OR status = 'paid'",
    );
    const [[{ totalDeliveries }]] = await db.query(
      "SELECT COUNT(*) as totalDeliveries FROM deliveries",
    );
    const [[{ deliveredCount }]] = await db.query(
      "SELECT COUNT(*) as deliveredCount FROM deliveries WHERE status = 'delivered'",
    );

    // Total surface cultivée
    const [[{ totalCultivated }]] = await db.query(
      "SELECT SUM(land_area) as totalCultivated FROM farmers",
    );

    // Activités récentes (logs)
    const [recentLogs] = await db.query(`
      SELECT 
        l.id, 
        u.full_name as userName, 
        l.action, 
        l.status, 
        l.created_at as timestamp 
      FROM system_logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC 
      LIMIT 10
    `);

    // Production mensuelle calculée à partir de la DB (6 derniers mois)
    const [monthlyRows] = await db.query(`
      SELECT 
        DATE_FORMAT(m.month_date, '%b') as month,
        COALESCE(SUM(p.quantity_tons), 0) as harvested
      FROM (
        SELECT DATE_SUB(CURDATE(), INTERVAL 5 MONTH) as month_date
        UNION SELECT DATE_SUB(CURDATE(), INTERVAL 4 MONTH)
        UNION SELECT DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
        UNION SELECT DATE_SUB(CURDATE(), INTERVAL 2 MONTH)
        UNION SELECT DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
        UNION SELECT CURDATE()
      ) m
      LEFT JOIN production p ON DATE_FORMAT(p.harvest_date, '%Y-%m') = DATE_FORMAT(m.month_date, '%Y-%m')
      GROUP BY month, m.month_date
      ORDER BY m.month_date ASC
    `);

    const productionChart = monthlyRows.map((row) => ({
      month: row.month,
      harvested: Number(row.harvested) || 0,
      cultivated: Math.round(Number(row.harvested) * 1.1) || 0,
    }));

    res.json({
      totalUsers,
      totalFarmers,
      totalProduction: totalProduction || 0,
      pendingCount: pendingCount || 0,
      pendingPayments: pendingPayments || 0,
      totalPaid: totalPaid || 0,
      totalDeliveries: totalDeliveries || 0,
      deliveredCount: deliveredCount || 0,
      totalCultivated: totalCultivated || 0,
      recentLogs,
      productionChart,
    });
  } catch (error) {
    console.error("Erreur GET /dashboard-stats:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route pour ajouter un nouveau paiement
app.post("/payments/add", authorize(["admin", "employe"]), async (req, res) => {
  const { farmerId, amount, date, method, status } = req.body;
  const userId = req.headers["x-user-id"];

  if (!farmerId || !amount || !date) {
    return res.status(400).json({
      message: "Veuillez remplir tous les champs obligatoires (Fériculteur, Montant, Date)",
    });
  }

  try {
    // DÉTECTION PARAMETER TAMPERING (Montant excessif)
    if (amount > 100000) {
      const action = "Parameter Tampering Détecté";
      const details = `Tentative de paiement suspect : ${amount} MAD pour le fella7 ${farmerId}. Seuil dépassé.`;
      console.warn(`🚨 [SECURITY] ${action}: ${details}`);
      await createLog(userId || null, action, details, "critical", req);
      return res.status(400).json({
        message: "Parameter Tampering Détecté",
        error: "Montant non autorisé ou suspect.",
      });
    }

    console.log("📝 Tentative d'ajout de paiement:", { farmerId, amount, date, method, status });
    const [result] = await db.query(
      "INSERT INTO payments (farmer_id, amount, payment_date, transaction_ref, status) VALUES (?, ?, ?, ?, ?)",
      [farmerId, amount, date, method, status],
    );
    const newId = result.insertId || result.id;
    console.log("✅ Paiement ajouté avec succès, ID:", newId);

    // Notification temps réel via WebSocket
    if (io) {
      io.emit("payment_updated", { action: "add" });
    }

    await createLog(
      null,
      "Nouveau paiement",
      `Paiement de ${amount} MAD ajouté pour l'agriculteur ID: ${farmerId}`,
      "success",
      req,
    );
    res.status(201).json({ message: "Paiement ajouté avec succès", id: newId });
  } catch (error) {
    console.error("❌ Erreur POST /payments/add:", error);
    res.status(500).json({ message: "Erreur ajout paiement", error: error.message });
  }
});

// Route pour mettre à jour le statut d'un paiement
app.put("/payments/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    await db.query("UPDATE payments SET status = ? WHERE id = ?", [status, id]);

    // Notification temps réel via WebSocket
    if (io) {
      io.emit("payment_updated", { action: "update", id });
    }

    await createLog(
      null,
      "Mise à jour paiement",
      `Paiement ID: ${id} mis à jour, statut: ${status}`,
      "info",
      req,
    );
    res.json({ message: "Statut du paiement mis à jour" });
  } catch (error) {
    res.status(500).json({ message: "Erreur mise à jour paiement", error: error.message });
  }
});

// Route pour supprimer un paiement
app.delete("/payments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM payments WHERE id = ?", [id]);

    // Notification temps réel via WebSocket
    if (io) {
      io.emit("payment_updated", { action: "delete", id });
    }

    await createLog(null, "Suppression paiement", `Paiement ID: ${id} supprimé`, "warning", req);
    res.json({ message: "Paiement supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression paiement", error: error.message });
  }
});

// Route pour l'historique des paiements d'un agriculteur spécifique (pour le client)
app.get("/farmer-payments/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const authUserId = req.headers["x-user-id"];
    const authRole = req.headers["x-user-role"];

    // VÉRIFICATION D'IDENTITÉ (ID Tampering)
    if (authRole === "client" && authUserId != userId) {
      const action = "Parameter Tampering (Payment Data Leak)";
      const details = `L'utilisateur ${authUserId} a tenté de consulter les paiements de l'utilisateur ${userId}.`;
      await createLog(authUserId, action, details, "critical", req);
      return res.status(403).json({
        message: "Parameter Tampering Détecté",
        error: "Accès non autorisé aux informations de paiement.",
      });
    }

    const [rows] = await db.query(
      `
      SELECT p.id, p.amount, p.payment_date as date, p.status, p.transaction_ref as method
      FROM payments p
      JOIN farmers f ON p.farmer_id = f.id
      WHERE f.user_id = ?
      ORDER BY p.payment_date DESC
    `,
      [userId],
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur paiements agriculteur", error: error.message });
  }
});

// Route pour l'historique des paiements (global admin/employé)
app.get("/payments", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, 
        u.full_name as farmerName, 
        p.amount, 
        p.transaction_ref as method, 
        p.status, 
        DATE_FORMAT(p.payment_date, '%Y-%m-%d') as date 
      FROM payments p
      LEFT JOIN farmers f ON p.farmer_id = f.id
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY p.payment_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Erreur GET /payments:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route pour la production
app.get("/production", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, 
        p.product_name as product,
        p.quantity_tons as quantity, 
        p.harvest_date as startDate, 
        p.status,
        p.progress,
        p.sugar_content,
        u.full_name as farmerName
      FROM production p
      LEFT JOIN farmers f ON p.farmer_id = f.id
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY p.harvest_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Erreur GET /production:", error);
    res.status(500).json({ message: "Erreur production", error: error.message });
  }
});

app.get("/farmer-production/:userId", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, 
        p.product_name as product,
        p.quantity_tons as quantity, 
        p.harvest_date as date, 
        p.status,
        p.progress,
        p.sugar_content
      FROM production p
      LEFT JOIN farmers f ON p.farmer_id = f.id
      WHERE f.user_id = ?
      ORDER BY p.harvest_date DESC
    `, [req.params.userId]);
    res.json(rows);
  } catch (error) {
    console.error("Erreur GET /farmer-production:", error);
    res.status(500).json({ message: "Erreur production", error: error.message });
  }
});

app.get("/farmer-deliveries/:userId", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.id,
        d.driver_name as driverName,
        d.truck_plate as vehicle,
        d.origin,
        d.destination_factory as destination,
        d.eta,
        d.status,
        d.delivery_date as date
      FROM deliveries d
      LEFT JOIN farmers f ON d.farmer_id = f.id
      WHERE f.user_id = ?
      ORDER BY d.delivery_date DESC
    `, [req.params.userId]);
    res.json(rows);
  } catch (error) {
    console.error("Erreur GET /farmer-deliveries:", error);
    res.status(500).json({ message: "Erreur livraisons", error: error.message });
  }
});

app.get("/deliveries", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.id, 
        d.driver_name as driverName, 
        d.truck_plate as vehicle, 
        d.origin, 
        d.destination_factory as destination, 
        d.eta, 
        d.status,
        u.full_name as farmerName
      FROM deliveries d
      LEFT JOIN farmers f ON d.farmer_id = f.id
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY d.delivery_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Erreur GET /deliveries:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route pour ajouter une livraison
app.post("/deliveries", async (req, res) => {
  const { farmerId, vehicle, driverName, origin, destination, eta, status } = req.body;
  if (!vehicle || !driverName || !origin || !destination) {
    return res.status(400).json({
      message:
        "Veuillez remplir les champs obligatoires (Véhicule, Chauffeur, Origine, Destination)",
    });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO deliveries (farmer_id, truck_plate, driver_name, origin, destination_factory, eta, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [farmerId || null, vehicle, driverName, origin, destination, eta, status || "en_route"],
    );
    console.log("✅ Livraison ajoutée avec succès, ID:", result.insertId);

    // Notification temps réel via WebSocket
    if (io) {
      io.emit("delivery_updated", { action: "add", id: result.insertId });
    }

    await createLog(
      null,
      "Nouvelle livraison",
      `Livraison ${vehicle} par ${driverName} enregistrée`,
      "success",
      req,
    );
    res.status(201).json({ message: "Livraison enregistrée", id: result.insertId });
  } catch (error) {
    console.error("❌ Erreur POST /deliveries:", error);
    res.status(500).json({ message: "Erreur ajout livraison", error: error.message });
  }
});

// Route pour mettre à jour le statut d'une livraison
app.patch("/deliveries/:id/status", async (req, res) => {
  const { status } = req.body;
  const userId = req.headers["x-user-id"];
  const allowedStatuses = ["en_route", "delivered", "retard", "cancelled"];

  try {
    // DÉTECTION PARAMETER TAMPERING (Statut invalide)
    if (!allowedStatuses.includes(status)) {
      const action = "Parameter Tampering Détecté";
      const details = `Tentative de changement de statut invalide : "${status}" pour la livraison ${req.params.id}.`;
      console.warn(`🚨 [SECURITY] ${action}: ${details}`);
      await createLog(userId || null, action, details, "critical", req);
      return res.status(400).json({
        message: "Parameter Tampering Détecté",
        error: "Statut de livraison non autorisé.",
      });
    }

    await db.query("UPDATE deliveries SET status = ? WHERE id = ?", [status, req.params.id]);

    // Notification temps réel via WebSocket
    if (io) {
      io.emit("delivery_updated", { action: "update", id: req.params.id, status });
    }

    res.json({ message: "Statut mis à jour" });
  } catch (error) {
    res.status(500).json({ message: "Erreur mise à jour statut", error: error.message });
  }
});

// Route pour supprimer une livraison
app.delete("/deliveries/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM deliveries WHERE id = ?", [req.params.id]);

    // Notification temps réel via WebSocket
    if (io) {
      io.emit("delivery_updated", { action: "delete", id: req.params.id });
    }

    res.json({ message: "Livraison supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression livraison", error: error.message });
  }
});

// Route pour récupérer les paramètres de sécurité
app.get("/settings", async (req, res) => {
  try {
    // Renvoyer le cache actuel qui est synchronisé avec la DB au démarrage et lors des updates
    res.json(securitySettings);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération paramètres", error: error.message });
  }
});

// Route pour mettre à jour un paramètre
app.post("/settings/update", async (req, res) => {
  const { key, value } = req.body;
  try {
    await db.query(
      "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      [key, String(value), String(value)],
    );
    // Mettre à jour le cache local
    securitySettings[key] = value === true;

    await createLog(
      null,
      "Changement sécurité",
      `Paramètre ${key} mis à jour : ${value}`,
      "warning",
      req,
    );
    res.json({ message: "Paramètre mis à jour" });
  } catch (error) {
    res.status(500).json({ message: "Erreur mise à jour paramètre", error: error.message });
  }
});

// Route pour récupérer les logs (Admin)
app.get("/logs", authorize(["admin"]), async (req, res) => {
  try {
    const logFilePath = path.join(__dirname, "logs", "combined.log");
    let fileLogs = [];

    if (fs.existsSync(logFilePath)) {
      const fileContent = fs.readFileSync(logFilePath, "utf8");
      const lines = fileContent.trim().split("\n");

      // Prendre seulement les 100 derniers logs du fichier
      fileLogs = lines
        .slice(-100)
        .map((line, index) => {
          try {
            const logEntry = JSON.parse(line);
            return {
              id: "file-" + index,
              userName: logEntry.userName || logEntry.metadata?.userName || "Système",
              role: logEntry.role || logEntry.metadata?.role || "admin",
              action: logEntry.message || "Action inconnue",
              details: logEntry.details || logEntry.metadata?.details || "",
              ipAddress: logEntry.ip || logEntry.metadata?.ip || "127.0.0.1",
              timestamp: logEntry.timestamp || logEntry["@timestamp"],
              status:
                logEntry.status ||
                logEntry.metadata?.status ||
                (logEntry.level === "critical"
                  ? "critical"
                  : logEntry.level === "error"
                    ? "failed"
                    : "success"),
            };
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean)
        .reverse();
    }

    // Récupérer les logs de la DB pour compléter
    let dbLogs = [];
    try {
      const [rows] = await db.query(`
        SELECT 
          id, 
          user_name as userName, 
          role, 
          action, 
          details,
          ip_address as ipAddress, 
          UNIX_TIMESTAMP(created_at) * 1000 as timestamp, 
          status 
        FROM system_logs 
        ORDER BY created_at DESC 
        LIMIT 100
      `);
      dbLogs = rows.map((l) => ({ ...l, id: "db-" + l.id }));
    } catch (dbErr) {
      console.error("Erreur DB logs fallback:", dbErr.message);
    }

    // Fusionner et trier par date (plus récent en premier)
    const allLogs = [...fileLogs, ...dbLogs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 100);

    res.json(allLogs);
  } catch (error) {
    console.error("Erreur logs endpoint:", error);
    res.status(500).json({ message: "Erreur journaux", error: error.message });
  }
});

// Route de connexion
app.post("/login", async (req, res) => {
  const { email, password, role, captcha } = req.body;
  const ip = req.userIp;
  const key = `${ip}:${role}`; // Unique key for IP + role combination

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Veuillez remplir tous les champs" });
  }

  // Check if this IP + role is blocked first
  if (securitySettings.security_ip_block) {
    const blockData = loginAttempts.get(key);
    if (blockData && blockData.lockUntil && Date.now() < blockData.lockUntil) {
      const remainingMs = blockData.lockUntil - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return res.status(403).json({
        message: `Accès bloqué pour ce rôle. Veuillez patienter ${remainingMin} minute(s) avant de réessayer la connexion.`,
        lockUntil: new Date(blockData.lockUntil).toLocaleTimeString(),
      });
    } else if (blockData && blockData.lockUntil) {
      // If lock time expired, clear it
      BLOCKED_KEYS.delete(key);
      loginAttempts.delete(key);
    }
  }

  // Vérification du CAPTCHA si activé
  if (securitySettings.security_captcha) {
    const savedCaptcha = activeCaptchas.get(ip);
    console.log(
      `[LOGIN ATTEMPT] IP: ${ip}, Submitted Captcha: ${captcha}, Saved Captcha: ${savedCaptcha?.code}`,
    );

    if (!captcha || !savedCaptcha || savedCaptcha.code !== captcha.toUpperCase()) {
      return res.status(400).json({ message: "Code CAPTCHA invalide" });
    }
    if (Date.now() > savedCaptcha.expiresAt) {
      activeCaptchas.delete(ip);
      return res.status(400).json({ message: "CAPTCHA expiré" });
    }
    activeCaptchas.delete(ip); // Consommé
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ? AND role = ?", [
      email,
      role,
    ]);

    if (users.length === 0) {
      // Gestion brute force pour email inexistant ou mauvais role - track by key (ip+role)
      const attempts = (loginAttempts.get(key)?.count || 0) + 1;
      loginAttempts.set(key, { count: attempts, lastAttempt: Date.now() });

      if (attempts >= MAX_ATTEMPTS) {
        BLOCKED_KEYS.add(key);
        loginAttempts.set(key, { ...loginAttempts.get(key), lockUntil: Date.now() + LOCK_TIME });
        const message =
          "Accès bloqué pour ce rôle. Veuillez patienter 2 minute(s) avant de réessayer la connexion.";

        // Loguer l'événement critique
        await createLog(
          null,
          "Attaque Brute Force",
          `IP bloquée après trop de tentatives : ${ip} (Email: ${email})`,
          "critical",
          req,
        );

        // Notification temps réel d'alerte critique et persistance
        sendStaffNotification(
          "URGENT",
          `🚨 BRUTE FORCE : L'IP ${ip} a été bloquée après 5 tentatives échouées.`,
          { ip, email },
        );

        return res.status(403).json({ message });
      } else {
        await createLog(
          null,
          "Connexion échouée",
          `Tentative invalide: ${email} | IP: ${ip}`,
          "failed",
          req,
        );
        // Notification temps réel simple échec
        if (io) {
          io.to("staff").emit("notification", {
            type: "info",
            message: `⚠️ Tentative de connexion échouée (${attempts}/5) depuis ${ip}.`,
          });
        }
      }
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const user = users[0];

    // Vérification du mot de passe
    if (user.password !== password) {
      const attempts = (loginAttempts.get(key)?.count || 0) + 1;
      loginAttempts.set(key, { count: attempts, lastAttempt: Date.now() });

      if (attempts >= MAX_ATTEMPTS) {
        BLOCKED_KEYS.add(key);
        loginAttempts.set(key, { ...loginAttempts.get(key), lockUntil: Date.now() + LOCK_TIME });
        const message =
          "Accès bloqué pour ce rôle. Veuillez patienter 2 minute(s) avant de réessayer la connexion.";

        // Loguer l'événement critique
        await createLog(
          user.id,
          "Attaque Brute Force",
          `IP bloquée : ${ip} (Compte: ${email})`,
          "critical",
          req,
        );

        // Notification temps réel d'alerte critique et persistance
        sendStaffNotification(
          "URGENT",
          `🚨 BRUTE FORCE : Tentatives répétées sur le compte ${email} depuis l'IP ${ip}.`,
          { ip, email, userId: user.id },
        );

        return res.status(403).json({ message });
      } else {
        await createLog(user.id, "Connexion échouée", "Mauvais mot de passe", "failed", req);
        // Notification temps réel simple échec
        if (io) {
          io.to("staff").emit("notification", {
            type: "info",
            message: `⚠️ Mot de passe erroné pour ${email} (${attempts}/5).`,
          });
        }
      }
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Succès de la connexion : on réinitialise les tentatives
    loginAttempts.delete(key);
    BLOCKED_KEYS.delete(key);

    // Mise à jour de la date de dernière connexion
    await db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);

    await createLog(
      user.id,
      "Connexion réussie",
      `Session ouverte pour ${user.full_name}`,
      "success",
      req,
    );

    // Notification temps réel pour les employés si un client se connecte
    if (role === "client") {
      sendStaffNotification("LOGIN", `L'agriculteur ${user.full_name} vient de se connecter.`, {
        userId: user.id,
      });
    }

    // Créer une session si l'expiration est activée
    const token = `session_${user.id}_${Date.now()}`;
    activeSessions.set(token, {
      userId: user.id,
      expiresAt: Date.now() + SESSION_DURATION,
    });

    // Si c'est un agriculteur, récupérer ses détails
    let details = {};
    if (role === "client") {
      const [farmers] = await db.query("SELECT * FROM farmers WHERE user_id = ?", [user.id]);
      if (farmers.length > 0) {
        details = farmers[0];
      }
    }

    res.json({
      message: "Connexion réussie",
      token, // Envoyer le token au frontend
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        cin: details.cin,
        region: details.region,
      },
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
});

// Route d'inscription pour les agriculteurs et employés
app.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    cin,
    phone,
    region,
    role: requestedRole,
    department,
    status,
    landArea,
    cropType,
  } = req.body;
  const authRole = req.headers["x-user-role"];

  // DÉTECTION PARAMETER TAMPERING (Role Escalation)
  // Seul un admin peut créer un autre admin ou employé
  let finalRole = "client";
  if (requestedRole && requestedRole !== "client") {
    if (authRole !== "admin") {
      const action = "Parameter Tampering (Privilege Escalation)";
      const details = `Tentative d'inscription avec le rôle "${requestedRole}" par un utilisateur non-admin.`;
      console.warn(`🚨 [SECURITY] ${action}: ${details}`);
      await createLog(null, action, details, "critical", req);
      return res.status(403).json({
        message: "Parameter Tampering Détecté",
        error: "Vous n'êtes pas autorisé à créer un compte avec ce rôle.",
      });
    }
    finalRole = requestedRole;
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires" });
  }

  // CIN est obligatoire uniquement pour les agriculteurs
  if (finalRole === "client" && !cin) {
    return res.status(400).json({ message: "Le CIN est obligatoire pour un agriculteur" });
  }

  // Politique de mots de passe stricts
  if (securitySettings.security_strict_pwd) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial.",
      });
    }
  }

  try {
    // 1. Vérifier si l'utilisateur existe déjà
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // 2. Insérer l'utilisateur (Note: le mot de passe devrait être haché en production)
    console.log(`📝 Insertion de l'utilisateur : ${email} (${finalRole})`);
    const [userResult] = await db.query(
      "INSERT INTO users (full_name, email, password, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, password, phone || null, finalRole, status || "active"],
    );

    const userId = userResult.insertId;

    if (!userId) {
      throw new Error("Échec de la récupération de l'ID utilisateur inséré");
    }

    console.log(`✅ Utilisateur inséré avec ID : ${userId}`);

    // 3. Insérer les détails de l'agriculteur UNIQUEMENT si c'est un client
    if (finalRole === "client") {
      console.log("🌾 Enregistrement agriculteur:", userId, cin, region);
      await db.query(
        "INSERT INTO farmers (user_id, cin, region, land_area, crop_type) VALUES (?, ?, ?, ?, ?)",
        [userId, cin || "N/A", region || null, landArea || 0, cropType || null],
      );
    }
    // 4. Insérer dans la table employees si c'est un employé ou admin
    else {
      console.log("👷 Enregistrement employé:", userId, department);
      await db.query("INSERT INTO employees (user_id, department) VALUES (?, ?)", [
        userId,
        department || "General",
      ]);
    }

    await createLog(
      userId,
      "Inscription",
      `Nouvel utilisateur inscrit (${finalRole})`,
      "success",
      req,
    );

    // Notification temps réel pour les employés
    sendStaffNotification(
      "REGISTER",
      `Un nouvel utilisateur (${finalRole}), ${name}, vient d'être créé.`,
      { userId },
    );

    // Générer un token pour que l'utilisateur soit connecté immédiatement
    const token = `session_${userId}_${Date.now()}`;
    activeSessions.set(token, {
      userId: userId,
      expiresAt: Date.now() + SESSION_DURATION,
    });

    res.status(201).json({
      message: "Compte créé avec succès",
      token,
      user: { id: userId, name, email, role: finalRole, cin, region, department, status },
    });
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
});

// Exemple de route pour tester la DB
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({
      message: "Connexion à la base de données réussie",
      result: rows[0].result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la connexion à la base de données",
      error: error.message,
    });
  }
});

// Gestion des erreurs globales
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
});

// Démarrage du serveur
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur express avec Socket.io en cours d'exécution sur le port ${PORT}`);
  logger.info(`Serveur démarré sur le port ${PORT}`, { ip: "127.0.0.1" });
});

// Garder le processus en vie
setInterval(() => {
  // Activité minimale pour empêcher l'exit si l'event loop se vide (ne devrait pas arriver avec listen)
}, 10000);
