const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function exportDatabase() {
  console.log("🚀 Exportation de la base de données...");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "cosumar_db",
  });

  const outputPath = path.join(__dirname, "cosumar_db_complete.sql");
  let sqlContent = "";

  sqlContent += "-- ==========================================================\n";
  sqlContent += "-- BASE DE DONNÉES COSUMAR AGRO HUB - COMPLÈTE (SCHÉMA + DONNÉES)\n";
  sqlContent += "-- Pour importation dans XAMPP/phpMyAdmin\n";
  sqlContent += "-- ==========================================================\n\n";

  // Disable foreign key checks FIRST
  sqlContent += "SET FOREIGN_KEY_CHECKS = 0;\n";
  sqlContent += "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
  sqlContent += "START TRANSACTION;\n";
  sqlContent += `SET time_zone = \"+00:00\";\n\n`;

  // Get all tables in correct dependency order
  const tableNames = [
    "regions",
    "users",
    "employees",
    "farmers",
    "plots",
    "production",
    "deliveries",
    "payments",
    "system_logs",
    "contact_messages",
    "user_message_read",
    "calendar_events",
    "notifications"
  ];

  for (const tableName of tableNames) {
    console.log(`📤 Exportation de la table : ${tableName}...`);

    // Drop table if exists
    sqlContent += `-- --------------------------------------------------------\n`;
    sqlContent += `-- Structure de la table \`${tableName}\`\n`;
    sqlContent += `-- --------------------------------------------------------\n\n`;
    sqlContent += `DROP TABLE IF EXISTS \`${tableName}\`;\n\n`;

    // Create table structure
    const [createTable] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
    sqlContent += createTable[0]["Create Table"] + ";\n\n";

    // Get table data
    const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
    if (rows.length > 0) {
      sqlContent += `-- --------------------------------------------------------\n`;
      sqlContent += `-- Déchargement des données de la table \`${tableName}\`\n`;
      sqlContent += `-- --------------------------------------------------------\n\n`;

      const columns = Object.keys(rows[0]);
      sqlContent += `INSERT INTO \`${tableName}\` (${columns.map(c => `\`${c}\``).join(", ")}) VALUES\n`;

      const valueSets = rows.map(row => {
        const values = columns.map(col => {
          const val = row[col];
          if (val === null) return "NULL";
          if (typeof val === "number") return val;
          if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace("T", " ")}'`;
          return `'${val.toString().replace(/'/g, "\\'")}'`;
        });
        return `  (${values.join(", ")})`;
      });

      sqlContent += valueSets.join(",\n") + ";\n\n";
    }
  }

  // Re-enable foreign key checks
  sqlContent += "-- Réactiver les contraintes de clé étrangère\n";
  sqlContent += "SET FOREIGN_KEY_CHECKS = 1;\n";
  sqlContent += "COMMIT;\n";

  fs.writeFileSync(outputPath, sqlContent, "utf8");
  console.log(`\n✅ Base de données exportée avec succès vers :`);
  console.log(`📁 ${outputPath}`);
  console.log("\n📝 Instructions pour XAMPP:");
  console.log("1. Ouvrez phpMyAdmin dans votre navigateur (généralement http://localhost/phpmyadmin)");
  console.log("2. Créez une nouvelle base de données nommée 'cosumar_db'");
  console.log("3. Sélectionnez la base de données");
  console.log("4. Cliquez sur l'onglet 'Importer'");
  console.log("5. Choisissez le fichier 'cosumar_db_complete.sql'");
  console.log("6. Cliquez sur 'Exécuter'");

  await connection.end();
}

exportDatabase().catch(err => {
  console.error("❌ Erreur lors de l'exportation:", err.message);
  process.exit(1);
});
