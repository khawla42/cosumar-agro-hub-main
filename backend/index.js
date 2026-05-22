const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares de base (CORS et JSON) AVANT TOUTE CHOSE
app.use(cors());
app.use(express.json());
app.use(helmet());

// 2. Middleware de détection d'IP (Normalisation pour tout le serveur)
app.use((req, res, next) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ip && ip.includes('::ffff:')) {
    ip = ip.split('::ffff:')[1];
  }
  if (ip === '::1') ip = '127.0.0.1';
  req.userIp = ip;
  next();
});

// Configuration de Winston... (le reste du code)
const logger = winston.createLogger({
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  },
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' })
    }),
    winston.format.json()
  ),
  defaultMeta: { service: 'cosumar-agro-backend' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/critical.log', level: 'critical' })
  ],
});

// Suivi des tentatives de connexion (Brute Force Protection)
const loginAttempts = new Map();
const BLOCKED_IPS = new Set();
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 1000; // 2 minutes (au lieu de 15)

// Cache pour les paramètres de sécurité (pour éviter trop de lectures DB)
let securitySettings = {
  security_captcha: false, // Désactivé par défaut pour éviter le blocage
  security_strict_pwd: true,
  security_session_exp: true,
  security_ip_block: true
};

// Stockage temporaire des CAPTCHAs (Simple Map IP -> Code)
const activeCaptchas = new Map();

// Route pour générer un CAPTCHA simple
app.get('/auth/captcha', (req, res) => {
  const ip = req.userIp || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const captchaText = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  console.log(`[CAPTCHA GEN] IP: ${ip}, Code: ${captchaText}`);
  
  activeCaptchas.set(ip, {
    code: captchaText,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  });
  
  res.json({ captcha: captchaText });
});

// Fonction pour rafraîchir les paramètres depuis la DB
async function refreshSecuritySettings() {
  try {
    const [rows] = await db.query('SELECT setting_key, setting_value FROM settings');
    rows.forEach(row => {
      securitySettings[row.setting_key] = row.setting_value === 'true';
    });
  } catch (err) {
    console.error('Erreur rafraîchissement settings:', err.message);
  }
}
// Rafraîchir au démarrage
setTimeout(refreshSecuritySettings, 2000);

// Sessions actives pour l'expiration (Simulé sans JWT/Redis)
const activeSessions = new Map();
const SESSION_DURATION = 3 * 60 * 1000; // 3 minutes (au lieu de 30)

// Middleware pour la protection brute force
app.use((req, res, next) => {
  const ip = req.userIp;

  if (BLOCKED_IPS.has(ip) && securitySettings.security_ip_block) {
    const blockData = loginAttempts.get(ip);
    if (blockData && Date.now() < blockData.lockUntil) {
      const remainingMs = blockData.lockUntil - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return res.status(403).json({ 
        message: `Accès bloqué. Veuillez patienter ${remainingMin} minute(s) avant de réessayer la connexion.`,
        lockUntil: new Date(blockData.lockUntil).toLocaleTimeString()
      });
    } else {
      BLOCKED_IPS.delete(ip);
      loginAttempts.delete(ip);
    }
  }
  next();
});

// Middleware pour l'expiration des sessions
app.use((req, res, next) => {
  if (securitySettings.security_session_exp && req.headers.authorization) {
    const token = req.headers.authorization;
    const session = activeSessions.get(token);
    
    if (session) {
      if (Date.now() > session.expiresAt) {
        activeSessions.delete(token);
        return res.status(401).json({ message: 'Session expirée. Veuillez vous reconnecter.', code: 'SESSION_EXPIRED' });
      }
      // Prolonger la session à chaque activité
      session.expiresAt = Date.now() + SESSION_DURATION;
    }
  }
  next();
});

// Routes de base
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Cosumar Agro Hub' });
});

// Route pour récupérer tous les utilisateurs (pour l'admin)
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, full_name as name, email, role, status, DATE_FORMAT(last_login, "%d/%m/%Y %H:%i:%s") as lastLogin FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
});

// Route pour récupérer tous les agriculteurs (pour les employés)
app.get('/farmers', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.id, 
        u.full_name as name, 
        f.cin, 
        f.region, 
        f.land_area as cultivatedQty,
        f.crop_type as landStatus,
        u.phone
      FROM farmers f
      JOIN users u ON f.user_id = u.id
      ORDER BY u.full_name ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des agriculteurs', error: error.message });
  }
});

// Route pour récupérer les stats d'un agriculteur spécifique
app.get('/farmer-stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Récupérer l'ID de l'agriculteur à partir de l'ID utilisateur
    const [farmers] = await db.query('SELECT id, land_area, crop_type FROM farmers WHERE user_id = ?', [userId]);
    
    if (farmers.length === 0) {
      return res.status(404).json({ message: 'Agriculteur non trouvé' });
    }
    
    const farmerId = farmers[0].id;

    // Calculer la production totale
    const [[{ totalHarvested }]] = await db.query(
      'SELECT SUM(quantity_tons) as totalHarvested FROM production WHERE farmer_id = ?', 
      [farmerId]
    );

    res.json({
      landArea: farmers[0].land_area || 0,
      totalHarvested: totalHarvested || 0,
      cropType: farmers[0].crop_type || 'Betterave'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur stats agriculteur', error: error.message });
  }
});

// Route pour soumettre des données de production
app.post('/submit-production', async (req, res) => {
  try {
    const { userId, cultivatedQty, harvestedQty } = req.body;

    // 1. Trouver l'ID farmer
    const [farmers] = await db.query('SELECT id FROM farmers WHERE user_id = ?', [userId]);
    if (farmers.length === 0) {
      return res.status(404).json({ message: 'Agriculteur non trouvé' });
    }
    const farmerId = farmers[0].id;

    // 2. Mettre à jour la surface cultivée si elle a changé
    if (cultivatedQty) {
      await db.query('UPDATE farmers SET land_area = ? WHERE id = ?', [cultivatedQty, farmerId]);
    }

    // 3. Ajouter une nouvelle entrée de production si une quantité a été récoltée
    if (harvestedQty) {
      await db.query(
        'INSERT INTO production (farmer_id, quantity_tons, harvest_date, status) VALUES (?, ?, CURDATE(), ?)',
        [farmerId, harvestedQty, 'pending']
      );
      await createLog(userId, 'Saisie production', `Récolte de ${harvestedQty}T enregistrée`, 'success', req);
    }

    res.json({ message: 'Données enregistrées avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement', error: error.message });
  }
});

// Route pour les statistiques du tableau de bord
app.get('/dashboard-stats', async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalFarmers }]] = await db.query('SELECT COUNT(*) as totalFarmers FROM farmers');
    const [[{ totalProduction }]] = await db.query('SELECT SUM(quantity_tons) as totalProduction FROM production');
    const [[{ pendingPayments }]] = await db.query("SELECT SUM(amount) as pendingPayments FROM payments WHERE status = 'pending'");

    // Récupérer les 5 derniers logs récents
    let recentLogs = [];
    try {
      const logFilePath = path.join(__dirname, 'logs', 'combined.log');
      if (fs.existsSync(logFilePath)) {
        const fileContent = fs.readFileSync(logFilePath, 'utf8');
        const lines = fileContent.trim().split('\n');
        recentLogs = lines.map((line, index) => {
          try {
            const logEntry = JSON.parse(line);
            return {
              id: 'file-' + index,
              userName: logEntry.userName || 'Système',
              action: logEntry.message || 'Action inconnue',
              timestamp: logEntry.timestamp,
              status: logEntry.status || (logEntry.level === 'critical' ? 'critical' : (logEntry.level === 'error' ? 'failed' : 'success'))
            };
          } catch (e) { return null; }
        }).filter(Boolean).reverse().slice(0, 5);
      }

      if (recentLogs.length === 0) {
        const [rows] = await db.query('SELECT id, user_name as userName, action, created_at as timestamp, status FROM system_logs ORDER BY created_at DESC LIMIT 5');
        recentLogs = rows;
      }
    } catch (logErr) {
      console.error('Error fetching recent logs for dashboard:', logErr);
    }

    res.json({
      totalUsers,
      totalFarmers,
      totalProduction: totalProduction || 0,
      pendingPayments: pendingPayments || 0,
      recentLogs
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Erreur stats dashboard', error: error.message });
  }
});

// Route pour ajouter un nouveau paiement
app.post('/payments/add', async (req, res) => {
  const { farmerId, amount, date, method, status } = req.body;
  try {
    await db.query(
      'INSERT INTO payments (farmer_id, amount, payment_date, transaction_ref, status) VALUES (?, ?, ?, ?, ?)',
      [farmerId, amount, date, method, status]
    );
    await createLog(null, 'Nouveau paiement', `Paiement de ${amount} MAD ajouté pour l'agriculteur ID: ${farmerId}`, 'success', req);
    res.json({ message: 'Paiement ajouté avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur ajout paiement', error: error.message });
  }
});

// Route pour supprimer un paiement
app.delete('/payments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM payments WHERE id = ?', [id]);
    await createLog(null, 'Suppression paiement', `Paiement ID: ${id} supprimé`, 'warning', req);
    res.json({ message: 'Paiement supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression paiement', error: error.message });
  }
});

// Route pour l'historique des paiements d'un agriculteur spécifique (pour le client)
app.get('/farmer-payments/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(`
      SELECT p.id, p.amount, p.payment_date as date, p.status, p.transaction_ref as method
      FROM payments p
      JOIN farmers f ON p.farmer_id = f.id
      WHERE f.user_id = ?
      ORDER BY p.payment_date DESC
    `, [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur paiements agriculteur', error: error.message });
  }
});

// Route pour l'historique des paiements (global admin)
app.get('/payments', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, 
        u.full_name as farmerName, 
        p.amount, 
        p.payment_date as date, 
        p.status, 
        p.transaction_ref as method
      FROM payments p
      JOIN farmers f ON p.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      ORDER BY p.payment_date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur paiements', error: error.message });
  }
});

// Route pour la production
app.get('/production', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id, 
        'Sucre Blanc' as product, -- Valeur par défaut pour l'exemple
        quantity_tons as quantity, 
        harvest_date as startDate, 
        status,
        75 as progress -- Valeur simulée
      FROM production 
      ORDER BY harvest_date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur production', error: error.message });
  }
});

// Route pour les livraisons
app.get('/deliveries', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id, 
        driver_name as driverName, 
        truck_plate as vehicle, 
        'Région' as origin, 
        destination_factory as destination, 
        status, 
        '14:00' as eta 
      FROM deliveries
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur livraisons', error: error.message });
  }
});

// Route pour récupérer les paramètres de sécurité
app.get('/settings', async (req, res) => {
  try {
    // Renvoyer le cache actuel qui est synchronisé avec la DB au démarrage et lors des updates
    res.json(securitySettings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération paramètres', error: error.message });
  }
});

// Route pour mettre à jour un paramètre
app.post('/settings/update', async (req, res) => {
  const { key, value } = req.body;
  try {
    await db.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [key, String(value), String(value)]
    );
    // Mettre à jour le cache local
    securitySettings[key] = value === true;
    
    await createLog(null, 'Changement sécurité', `Paramètre ${key} mis à jour : ${value}`, 'warning', req);
    res.json({ message: 'Paramètre mis à jour' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur mise à jour paramètre', error: error.message });
  }
});

// Helper pour enregistrer les logs
async function createLog(userId, action, details, status = 'success', req = null) {
  try {
    let userName = 'Système';
    let role = 'admin';
    let ip = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : '127.0.0.1';

    if (userId) {
      try {
        const [users] = await db.query('SELECT full_name, role FROM users WHERE id = ?', [userId]);
        if (users.length > 0) {
          userName = users[0].full_name;
          role = users[0].role;
        }
      } catch (dbErr) {
        console.error('Erreur lecture utilisateur pour log:', dbErr.message);
      }
    }

    // Déterminer le niveau de log
    let logLevel = 'info';
    if (status === 'critical') logLevel = 'critical';
    else if (status === 'failed') logLevel = 'error';
    else if (status === 'warning') logLevel = 'warn';

    // 1. TOUJOURS envoyer vers Winston pour intégration ELK (même si la DB échoue)
    logger.log({
      level: logLevel,
      message: action,
      userId,
      userName,
      role,
      details,
      ip,
      status
    });

    // 2. Tenter l'enregistrement dans MySQL
    try {
      await db.query(
        'INSERT INTO system_logs (user_id, user_name, role, action, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, userName, role, action, details, ip, status]
      );
    } catch (dbErr) {
      console.error('Erreur écriture table system_logs:', dbErr.message);
    }
  } catch (error) {
    console.error('Erreur critique dans createLog:', error);
  }
}

// Route pour les journaux (logs)
app.get('/logs', async (req, res) => {
  try {
    const logFilePath = path.join(__dirname, 'logs', 'combined.log');
    let logs = [];

    if (fs.existsSync(logFilePath)) {
      const fileContent = fs.readFileSync(logFilePath, 'utf8');
      const lines = fileContent.trim().split('\n');
      
      logs = lines.map((line, index) => {
        try {
          const logEntry = JSON.parse(line);
          return {
            id: 'file-' + index,
            userName: logEntry.userName || 'Système',
            role: logEntry.role || 'admin',
            action: logEntry.message || 'Action inconnue',
            ipAddress: logEntry.ip || (logEntry.details && logEntry.details.ip) || '127.0.0.1',
            timestamp: logEntry.timestamp,
            status: logEntry.status || (logEntry.level === 'critical' ? 'critical' : (logEntry.level === 'error' ? 'failed' : 'success'))
          };
        } catch (e) {
          return null;
        }
      }).filter(Boolean).reverse(); // Plus récents en premier
    }

    // Si on a moins de logs que prévu ou si le fichier est vide, on peut compléter avec la DB
    if (logs.length < 10) {
      try {
        const [rows] = await db.query(`
          SELECT 
            id, 
            user_name as userName, 
            role, 
            action, 
            ip_address as ipAddress, 
            DATE_FORMAT(created_at, "%d/%m/%Y %H:%i:%s") as timestamp, 
            status 
          FROM system_logs 
          ORDER BY created_at DESC 
          LIMIT 100
        `);
        // Éviter les doublons si nécessaire, mais ici on va juste fusionner ou remplacer
        if (logs.length === 0) logs = rows;
      } catch (dbErr) {
        console.error('Erreur DB logs fallback:', dbErr.message);
      }
    }

    res.json(logs.slice(0, 100)); // Limiter à 100 logs
  } catch (error) {
    console.error('Erreur logs endpoint:', error);
    res.status(500).json({ message: 'Erreur journaux', error: error.message });
  }
});

// Route de connexion
app.post('/login', async (req, res) => {
  const { email, password, role, captcha } = req.body;
  const ip = req.userIp;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
  }

  // Vérification du CAPTCHA si activé
   if (securitySettings.security_captcha) {
     const savedCaptcha = activeCaptchas.get(ip);
     console.log(`[LOGIN ATTEMPT] IP: ${ip}, Submitted Captcha: ${captcha}, Saved Captcha: ${savedCaptcha?.code}`);
     
     if (!captcha || !savedCaptcha || savedCaptcha.code !== captcha.toUpperCase()) {
       return res.status(400).json({ message: 'Code CAPTCHA invalide' });
     }
     if (Date.now() > savedCaptcha.expiresAt) {
       activeCaptchas.delete(ip);
       return res.status(400).json({ message: 'CAPTCHA expiré' });
     }
     activeCaptchas.delete(ip); // Consommé
   }

  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [email, role]
    );

    if (users.length === 0) {
      // Gestion brute force pour email inexistant ou mauvais role
      if (securitySettings.security_ip_block) {
        const attempts = (loginAttempts.get(ip)?.count || 0) + 1;
        loginAttempts.set(ip, { count: attempts, lastAttempt: Date.now() });

        if (attempts >= MAX_ATTEMPTS) {
          BLOCKED_IPS.add(ip);
          loginAttempts.set(ip, { ...loginAttempts.get(ip), lockUntil: Date.now() + LOCK_TIME });
          const message = "Accès bloqué. Veuillez patienter 2 minute(s) avant de réessayer la connexion.";
          await createLog(null, 'Accès bloqué', message + ` (Email: ${email})`, 'critical', req);
          return res.status(403).json({ message });
        } else {
          await createLog(null, 'Connexion échouée', `Tentative invalide: ${email} | IP: ${ip}`, 'failed', req);
        }
      }
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const user = users[0];

    // Vérification du mot de passe
    if (user.password !== password) {
      if (securitySettings.security_ip_block) {
        const attempts = (loginAttempts.get(ip)?.count || 0) + 1;
        loginAttempts.set(ip, { count: attempts, lastAttempt: Date.now() });

        if (attempts >= MAX_ATTEMPTS) {
          BLOCKED_IPS.add(ip);
          loginAttempts.set(ip, { ...loginAttempts.get(ip), lockUntil: Date.now() + LOCK_TIME });
          const message = "Accès bloqué. Veuillez patienter 2 minute(s) avant de réessayer la connexion.";
          await createLog(user.id, 'Accès bloqué', message + ` (Compte: ${email})`, 'critical', req);
          return res.status(403).json({ message });
        } else {
          await createLog(user.id, 'Connexion échouée', 'Mauvais mot de passe', 'failed', req);
        }
      }
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Succès de la connexion : on réinitialise les tentatives
    loginAttempts.delete(ip);
    BLOCKED_IPS.delete(ip);

    // Mise à jour de la date de dernière connexion
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    await createLog(user.id, 'Connexion réussie', `Session ouverte pour ${user.full_name}`, 'success', req);

    // Créer une session si l'expiration est activée
    const token = `session_${user.id}_${Date.now()}`;
    activeSessions.set(token, {
      userId: user.id,
      expiresAt: Date.now() + SESSION_DURATION
    });

    // Si c'est un agriculteur, récupérer ses détails
    let details = {};
    if (role === 'client') {
      const [farmers] = await db.query('SELECT * FROM farmers WHERE user_id = ?', [user.id]);
      if (farmers.length > 0) {
        details = farmers[0];
      }
    }

    res.json({
      message: 'Connexion réussie',
      token, // Envoyer le token au frontend
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        cin: details.cin,
        region: details.region
      }
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
});

// Route d'inscription pour les agriculteurs
app.post('/register', async (req, res) => {
  const { name, email, password, cin, region } = req.body;

  if (!name || !email || !password || !cin) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
  }

  // Politique de mots de passe stricts
  if (securitySettings.security_strict_pwd) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial.' 
      });
    }
  }

  try {
    // 1. Vérifier si l'utilisateur existe déjà
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // 2. Insérer l'utilisateur (Note: le mot de passe devrait être haché en production)
    const [userResult] = await db.query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, 'client']
    );

    const userId = userResult.insertId;

    // 3. Insérer les détails de l'agriculteur
    await db.query(
      'INSERT INTO farmers (user_id, cin, region) VALUES (?, ?, ?)',
      [userId, cin, region]
    );

    await createLog(userId, 'Inscription', 'Nouvel agriculteur inscrit', 'success', req);

    res.status(201).json({ 
      message: 'Compte créé avec succès',
      user: { id: userId, name, email, role: 'client', cin, region }
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
});

// Exemple de route pour tester la DB
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ 
      message: 'Connexion à la base de données réussie', 
      result: rows[0].result 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Erreur lors de la connexion à la base de données',
      error: error.message 
    });
  }
});

// Gestion des erreurs globales
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

// Démarrage du serveur
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur express en cours d'exécution sur le port ${PORT}`);
  logger.info(`Serveur démarré sur le port ${PORT}`, { ip: '127.0.0.1' });
});

// Garder le processus en vie
setInterval(() => {
  // Activité minimale pour empêcher l'exit si l'event loop se vide (ne devrait pas arriver avec listen)
}, 10000);
