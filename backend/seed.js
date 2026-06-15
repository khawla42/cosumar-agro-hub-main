const mysql = require("mysql2/promise");
require("dotenv").config();

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "cosumar_db",
  });

  console.log("🌱 Démarrage de la population de la base de données...");

  try {
    // 1. Nettoyage des tables existantes (optionnel, mais recommandé pour un seed propre)
    // Désactiver temporairement les contraintes de clé étrangère
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    const tables = [
      "notifications",
      "system_logs",
      "payments",
      "deliveries",
      "production",
      "plots",
      "farmers",
      "employees",
      "users",
      "regions",
      "calendar_events",
      "contact_messages",
    ];
    for (const table of tables) {
      await connection.query(`TRUNCATE TABLE ${table}`);
    }
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✅ Tables vidées.");

    // 2. Création des UTILISATEURS
    const users = [
      ["Administrateur Système", "admin@cosumar.ma", "admin123", "admin", "0600000001"],
      ["Responsable Zone", "employe@cosumar.ma", "employe123", "employe", "0600000002"],
      ["Ahmed El Fassi", "ahmed@gmail.com", "client123", "client", "0611223344"],
      ["Fatima Mansouri", "fatima@gmail.com", "client123", "client", "0655667788"],
      ["Mohamed Alami", "mohamed@gmail.com", "client123", "client", "0699887766"],
      ["Youssef Bennani", "youssef@gmail.com", "client123", "client", "0644332211"],
      ["Khadija Idrisi", "khadija@gmail.com", "client123", "client", "0677889900"],
    ];

    for (const [name, email, pwd, role, phone] of users) {
      await connection.query(
        "INSERT INTO users (full_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
        [name, email, pwd, role, phone],
      );
    }
    console.log("✅ Utilisateurs créés.");

    // 3. Création des EMPLOYÉS
    const [adminRow] = await connection.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    const [employeRow] = await connection.query(
      "SELECT id FROM users WHERE role = 'employe' LIMIT 1",
    );

    await connection.query(
      "INSERT INTO employees (user_id, matricule, department, position, hire_date) VALUES (?, ?, ?, ?, ?)",
      [adminRow[0].id, "ADM001", "Direction", "Admin Système", "2023-01-15"],
    );
    await connection.query(
      "INSERT INTO employees (user_id, matricule, department, position, hire_date) VALUES (?, ?, ?, ?, ?)",
      [employeRow[0].id, "EMP042", "Opérations", "Superviseur Zone", "2023-06-10"],
    );
    console.log("✅ Détails employés créés.");

    // 4. Création des AGRICULTEURS (Fellahs)
    const [farmerUsers] = await connection.query(
      "SELECT id, full_name FROM users WHERE role = 'client'",
    );
    const regions_maroc = ["Doukkala", "Gharb", "Tadla", "Moulouya", "Loukkos"];
    const crop_types = ["Betterave Sucrière", "Canne à Sucre"];

    for (let i = 0; i < farmerUsers.length; i++) {
      await connection.query(
        "INSERT INTO farmers (user_id, cin, region, land_area, crop_type, land_status) VALUES (?, ?, ?, ?, ?, ?)",
        [
          farmerUsers[i].id,
          `AB${100000 + i}`,
          regions_maroc[i % regions_maroc.length],
          Math.random() * 50 + 5, // 5 à 55 hectares
          crop_types[0],
          "Propriétaire",
        ],
      );
    }
    console.log("✅ Agriculteurs créés.");

    // 5. Création des PARCELLES (Plots)
    const [farmers] = await connection.query("SELECT id FROM farmers");
    for (const farmer of farmers) {
      const numPlots = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numPlots; j++) {
        await connection.query(
          "INSERT INTO plots (farmer_id, location_gps, area, culture_type, planting_date) VALUES (?, ?, ?, ?, ?)",
          [
            farmer.id,
            `${33 + Math.random()} , ${-7 + Math.random()}`,
            Math.random() * 10 + 2,
            "Betterave",
            "2023-11-15",
          ],
        );
      }
    }
    console.log("✅ Parcelles créées.");

    // 6. Création de la PRODUCTION
    const [plots] = await connection.query("SELECT id, farmer_id FROM plots");
    for (const plot of plots) {
      // Générer des récoltes pour les 6 derniers mois pour remplir le diagramme
      for (let m = 0; m < 6; m++) {
        await connection.query(
          "INSERT INTO production (farmer_id, plot_id, quantity_tons, sugar_content, harvest_date, status, progress) VALUES (?, ?, ?, ?, DATE_SUB(CURDATE(), INTERVAL ? MONTH), ?, ?)",
          [
            plot.farmer_id,
            plot.id,
            Math.random() * 20 + 5, // Quantité par mois
            16 + Math.random() * 3,
            m,
            "validated",
            100,
          ],
        );
      }
    }
    console.log("✅ Production créée (6 derniers mois pour les diagrammes).");

    // 7. Création des LIVRAISONS
    const [productions] = await connection.query("SELECT id, farmer_id FROM production");
    const factories = ["Sidi Bennour", "Mechra Bel Ksiri", "Souk Sebt", "Berkane", "Larache"];
    for (const prod of productions) {
      await connection.query(
        "INSERT INTO deliveries (production_id, farmer_id, truck_plate, driver_name, origin, destination_factory, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          prod.id,
          prod.farmer_id,
          `${Math.floor(Math.random() * 99999)}|A|${Math.floor(Math.random() * 99)}`,
          "Chauffeur " + Math.floor(Math.random() * 100),
          "Zone Agricole",
          factories[Math.floor(Math.random() * factories.length)],
          "delivered",
        ],
      );
    }
    console.log("✅ Livraisons créées.");

    // 8. Création des PAIEMENTS
    let pIdx = 0;
    for (const prod of productions) {
      const amount = Math.floor(Math.random() * 50000) + 10000;
      await connection.query(
        "INSERT INTO payments (farmer_id, production_id, amount, payment_date, status, transaction_ref) VALUES (?, ?, ?, ?, ?, ?)",
        [
          prod.farmer_id,
          prod.id,
          amount,
          "2024-06-01",
          pIdx % 2 === 0 ? "completed" : "pending",
          "VIR-" + Math.floor(Math.random() * 1000000),
        ],
      );
      pIdx++;
    }
    console.log("✅ Paiements créés.");

    // 9. Création des RÉGIONS (Carte)
    const regionsData = [
      ["Doukkala", 32.9908, -8.2725, "optimal", "Betterave", 1250],
      ["Gharb", 34.261, -6.5818, "warning", "Canne à sucre", 850],
      ["Tadla", 32.3373, -6.3533, "optimal", "Betterave", 1100],
      ["Moulouya", 34.6814, -1.9086, "critical", "Betterave", 400],
      ["Loukkos", 35.1932, -6.1557, "optimal", "Canne à sucre", 720],
    ];

    for (const [name, lat, lng, status, prod, count] of regionsData) {
      await connection.query(
        "INSERT INTO regions (name, lat, lng, status, production, farmers) VALUES (?, ?, ?, ?, ?, ?)",
        [name, lat, lng, status, prod, count],
      );
    }
    console.log("✅ Régions créées.");

    // 10. Événements Calendrier
    const events = [
      [
        "Distribution de semences",
        "visite",
        "09:00",
        "Centre Technique Sidi Bennour",
        "2026-06-10",
      ],
      ["Réunion de coordination", "reunion", "14:30", "Siège Casablanca", "2026-06-12"],
      ["Contrôle phytosanitaire", "visite", "10:00", "Zone Gharb", "2026-06-15"],
    ];
    for (const [title, type, time, location, date] of events) {
      await connection.query(
        "INSERT INTO calendar_events (title, type, time, location, date) VALUES (?, ?, ?, ?, ?)",
        [title, type, time, location, date],
      );
    }
    console.log("✅ Événements calendrier créés.");

    // 11. Messages de contact
    await connection.query(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [
        "Ali Baba",
        "ali@example.com",
        "Demande d'adhésion",
        "Je souhaite rejoindre la filière betterave.",
      ],
    );
    console.log("✅ Messages de contact créés.");

    console.log("✨ Base de données peuplée avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error.message);
  } finally {
    await connection.end();
  }
}

seed();
