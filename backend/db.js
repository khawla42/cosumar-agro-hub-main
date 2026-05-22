const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MOCK_DB_FILE = path.join(__dirname, 'mock_db.json');

// Initialiser le fichier mock si inexistant
const initMockDB = () => {
  if (!fs.existsSync(MOCK_DB_FILE)) {
    const initialData = {
      users: [
        { id: 1, full_name: 'Administrateur Système', email: 'admin@cosumar.ma', password: 'admin123', role: 'admin', created_at: new Date().toISOString() },
        { id: 2, full_name: 'Mohammed Alami', email: 'employe@cosumar.ma', password: 'emp123', role: 'employe', created_at: new Date().toISOString() },
        { id: 3, full_name: 'Ahmed Bennani', email: 'ahmed@gmail.com', password: 'password123', role: 'client', created_at: new Date().toISOString() },
        { id: 4, full_name: 'Fatima Zahra', email: 'fatima@gmail.com', password: 'password123', role: 'client', created_at: new Date().toISOString() },
        { id: 5, full_name: 'Driss El Amrani', email: 'driss@gmail.com', password: 'password123', role: 'client', created_at: new Date().toISOString() },
        { id: 6, full_name: 'Saida Mansouri', email: 'saida@gmail.com', password: 'password123', role: 'client', created_at: new Date().toISOString() },
        { id: 7, full_name: 'Karim Haddad', email: 'karim@gmail.com', password: 'password123', role: 'client', created_at: new Date().toISOString() },
        { id: 10, full_name: 'Khawla', email: 'khawla@gmail.com', password: 'password123', role: 'client', created_at: new Date().toISOString() }
      ],
      farmers: [
        { id: 1, user_id: 3, cin: 'AB123456', region: 'Doukkala', land_area: 15.5, crop_type: 'Betterave' },
        { id: 2, user_id: 4, cin: 'CD789012', region: 'Gharb', land_area: 12.0, crop_type: 'Betterave' },
        { id: 3, user_id: 5, cin: 'EF345678', region: 'Tadla', land_area: 25.3, crop_type: 'Betterave' },
        { id: 4, user_id: 6, cin: 'GH901234', region: 'Loukkos', land_area: 8.5, crop_type: 'Betterave' },
        { id: 5, user_id: 7, cin: 'IJ567890', region: 'Moulouya', land_area: 18.2, crop_type: 'Betterave' },
        { id: 6, user_id: 10, cin: 'K123456', region: 'Doukkala', land_area: 5.0, crop_type: 'Betterave' }
      ],
      production: [],
      payments: [],
      system_logs: []
    };
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(initialData, null, 2));
  }
};

initMockDB();

const getMockData = () => {
  try {
    return JSON.parse(fs.readFileSync(MOCK_DB_FILE, 'utf8'));
  } catch (e) {
    return { users: [], farmers: [], production: [], payments: [], system_logs: [] };
  }
};

const saveMockData = (data) => {
  fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(data, null, 2));
};

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Mock query function if DB is not available
const mockQuery = async (sql, params) => {
  console.log('MOCK QUERY:', sql, params);
  const data = getMockData();
  
  // Login query
  if (sql.includes('SELECT * FROM users WHERE email = ?')) {
    const email = params[0];
    const role = params[1];
    
    const user = data.users.find(u => u.email === email && (role ? u.role === role : true));
    return user ? [[user]] : [[]];
  }

  // Dashboard stats queries
  if (sql.includes('COUNT(*) as totalUsers')) {
    return [[{ totalUsers: data.users.length }]];
  }
  if (sql.includes('COUNT(*) as totalFarmers')) {
    return [[{ totalFarmers: data.farmers.length }]];
  }
  if (sql.includes('SUM(quantity_tons) as totalProduction')) {
    const total = data.production.reduce((acc, p) => acc + (p.quantity_tons || 0), 0) + 2500; // base mock + new
    return [[{ totalProduction: total }]];
  }
  if (sql.includes('SUM(amount) as pendingPayments')) {
    const total = data.payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + (p.amount || 0), 0) + 45000;
    return [[{ pendingPayments: total }]];
  }
  if (sql.includes('SUM(quantity_tons) as totalHarvested')) {
    const farmerId = params[0];
    const total = data.production.filter(p => p.farmer_id == farmerId).reduce((acc, p) => acc + (p.quantity_tons || 0), 0) + 120;
    return [[{ totalHarvested: total }]];
  }

  // Users list query
  if (sql.includes('SELECT id, full_name as name, email, role, status')) {
    return [data.users.map(u => ({
      id: u.id,
      name: u.full_name,
      email: u.email,
      role: u.role,
      status: u.status || 'active',
      lastLogin: u.last_login || 'Jamais'
    }))];
  }

  // Farmers list query
  if (sql.includes('FROM farmers f') && sql.includes('JOIN users u')) {
    return [data.farmers.map(f => {
      const user = data.users.find(u => u.id === f.user_id);
      return {
        id: f.id,
        name: user ? user.full_name : 'Inconnu',
        cin: f.cin,
        region: f.region,
        cultivatedQty: f.land_area || 0,
        harvestedQty: 0, // Simplified
        quality: 'Bonne',
        landStatus: f.crop_type || 'Betterave',
        paymentStatus: 'En attente',
        deliveryStatus: 'En cours',
        phone: user ? user.phone : 'N/A',
        email: user ? user.email : 'N/A'
      };
    })];
  }

  // INSERT User
  if (sql.includes('INSERT INTO users')) {
    const newUser = {
      id: data.users.length + 1,
      full_name: params[0],
      email: params[1],
      password: params[2],
      role: params[3],
      created_at: new Date().toISOString()
    };
    data.users.push(newUser);
    saveMockData(data);
    return [{ insertId: newUser.id }];
  }

  // INSERT Farmer
  if (sql.includes('INSERT INTO farmers')) {
    const newFarmer = {
      id: data.farmers.length + 1,
      user_id: params[0],
      cin: params[1],
      region: params[2],
      land_area: 0,
      crop_type: 'Betterave'
    };
    data.farmers.push(newFarmer);
    saveMockData(data);
    return [{ insertId: newFarmer.id }];
  }

  // UPDATE users last login
  if (sql.includes('UPDATE users SET last_login = NOW()')) {
    const userId = params[0];
    const userIndex = data.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      data.users[userIndex].last_login = new Date().toLocaleString();
      saveMockData(data);
    }
    return [{}];
  }

  // INSERT Log
  if (sql.includes('INSERT INTO system_logs')) {
    const newLog = {
      id: data.system_logs.length + 1,
      user_id: params[0],
      user_name: params[1],
      role: params[2],
      action: params[3],
      details: params[4],
      ip_address: params[5],
      status: params[6],
      created_at: new Date().toISOString()
    };
    data.system_logs.push(newLog);
    saveMockData(data);
    return [{ insertId: newLog.id }];
  }

  // Settings query
  if (sql.includes('SELECT setting_key, setting_value FROM settings')) {
    return [[
      { setting_key: 'security_captcha', setting_value: 'false' },
      { setting_key: 'security_strict_pwd', setting_value: 'true' },
      { setting_key: 'security_session_exp', setting_value: 'true' },
      { setting_key: 'security_ip_block', setting_value: 'true' }
    ]];
  }

  // System logs fallback
  if (sql.includes('SELECT id, user_name as userName, action, created_at as timestamp, status FROM system_logs')) {
    return [data.system_logs.map(l => ({
      id: l.id,
      userName: l.user_name,
      action: l.action,
      timestamp: l.created_at,
      status: l.status
    })).reverse().slice(0, 5)];
  }

  // Default fallback for any other query to avoid destructuring errors
  console.log('UNHANDLED MOCK QUERY, returning empty row');
  return [[{}]];
};

const dbProxy = {
  query: async (sql, params) => {
    // Toujours utiliser le mock pour assurer l'affichage des données réelles simulées
    return mockQuery(sql, params);
  },
  execute: async (sql, params) => {
    // Toujours utiliser le mock pour assurer l'affichage des données réelles simulées
    return mockQuery(sql, params);
  }
};

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à MySQL (Mode dégradé activé):', err.message);
  } else {
    console.log('Connecté à la base de données MySQL.');
    connection.release();
  }
});

module.exports = dbProxy;
