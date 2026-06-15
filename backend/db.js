const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cosumar_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

const assertDatabaseConnection = async () => {
  const connection = await promisePool.getConnection();
  try {
    await connection.ping();
    console.log("Base de donnees MySQL connectee.");
  } finally {
    connection.release();
  }
};

assertDatabaseConnection().catch((err) => {
  console.error("Impossible de se connecter a MySQL:", err.message);
  console.error("Configurez backend/.env puis lancez `npm run setup-db` dans le dossier backend.");
});

module.exports = {
  query: (sql, params) => promisePool.query(sql, params),
  execute: (sql, params) => promisePool.execute(sql, params),
  getConnection: () => promisePool.getConnection(),
};
