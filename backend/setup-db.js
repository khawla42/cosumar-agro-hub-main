const mysql = require("mysql2/promise");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function setup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  });

  console.log("🚀 Démarrage de la configuration de la base de données...");

  try {
    // Créer la base de données
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "cosumar_db"}`);
    await connection.query(`USE ${process.env.DB_NAME || "cosumar_db"}`);
    console.log(`✅ Base de données "${process.env.DB_NAME || "cosumar_db"}" prête.`);

    // Lire et exécuter le fichier init.sql
    const sqlPath = path.join(__dirname, "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Separer les requetes en retirant les commentaires ligne par ligne.
    const cleanedSql = sql
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("--"))
      .join("\n");

    const queries = cleanedSql
      .split(";")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    for (const query of queries) {
      try {
        await connection.query(query);
      } catch (err) {
        if (!err.message.includes("already exists")) {
          console.error(`❌ Erreur dans la requête : ${query.substring(0, 50)}...`);
          console.error(err.message);
        }
      }
    }

    console.log("✨ Toutes les tables ont été créées avec succès !");
    console.log("🎉 Votre backend est maintenant prêt à utiliser MySQL.");
  } catch (error) {
    console.error("❌ Erreur lors de la configuration :", error.message);
  } finally {
    await connection.end();
  }
}

setup();
