-- ==========================================================
-- BASE DE DONNÉES COSUMAR AGRO HUB (COMPLÈTE)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS cosumar_db;
USE cosumar_db;

-- 1. Table des UTILISATEURS (Table de base pour l'authentification)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employe', 'client') NOT NULL,
    phone VARCHAR(20),
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Table des EMPLOYÉS (Détails spécifiques pour Admin et Employés)
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    matricule VARCHAR(50) UNIQUE,
    department VARCHAR(100),
    position VARCHAR(100),
    hire_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Table des AGRICULTEURS (Détails spécifiques pour les Clients)
CREATE TABLE IF NOT EXISTS farmers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    cin VARCHAR(20) UNIQUE,
    region VARCHAR(100),
    land_area FLOAT DEFAULT 0, -- Surface totale possédée (en ha)
    crop_type VARCHAR(100),    -- Type de culture principale
    land_status VARCHAR(50),   -- Propriétaire, Locataire, etc.
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Table des PARCELLES (Terrains spécifiques d'un agriculteur)
CREATE TABLE IF NOT EXISTS plots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    location_gps VARCHAR(255),
    area FLOAT NOT NULL,      -- Surface de la parcelle
    culture_type ENUM('Betterave') NOT NULL,
    planting_date DATE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Table de la PRODUCTION (Récoltes enregistrées)
CREATE TABLE IF NOT EXISTS production (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    plot_id INT,
    quantity_tons FLOAT NOT NULL,
    sugar_content FLOAT,      -- Taux de sucre (richesse)
    harvest_date DATE,
    status ENUM('pending', 'validated', 'processed') DEFAULT 'pending',
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (plot_id) REFERENCES plots(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Table des LIVRAISONS (Logistique vers l'usine)
CREATE TABLE IF NOT EXISTS deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    production_id INT NOT NULL,
    delivery_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    truck_plate VARCHAR(20),
    driver_name VARCHAR(255),
    destination_factory VARCHAR(255),
    status ENUM('en_route', 'delivered', 'cancelled') DEFAULT 'en_route',
    FOREIGN KEY (production_id) REFERENCES production(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Table des PAIEMENTS (Transactions financières)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    production_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    payment_date DATE,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    transaction_ref VARCHAR(100) UNIQUE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (production_id) REFERENCES production(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. Table des JOURNAUX (Logs système)
CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    user_name VARCHAR(255),
    role VARCHAR(50),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    status ENUM('success', 'failed', 'warning') DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. Table des PARAMÈTRES (Configuration globale)
CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==========================================================
-- INSERTION DES DONNÉES PAR DÉFAUT (TEST)
-- ==========================================================

-- Paramètres de sécurité par défaut
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('security_mfa', 'true');
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('security_strict_pwd', 'true');
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('security_session_exp', 'true');
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('security_ip_block', 'true');

-- Admin par défaut (Mot de passe: admin123)
INSERT IGNORE INTO users (full_name, email, password, role) 
VALUES ('Administrateur Système', 'admin@cosumar.ma', 'admin123', 'admin');

-- Employé par défaut (Mot de passe: emp123)
INSERT IGNORE INTO users (full_name, email, password, role) 
VALUES ('Mohammed Alami', 'employe@cosumar.ma', 'emp123', 'employe');

-- Agriculteur par défaut (Mot de passe: client123)
INSERT IGNORE INTO users (full_name, email, password, role) 
VALUES ('Ahmed Bennani', 'client@cosumar.ma', 'client123', 'client');

-- Lien Agriculteur -> Détails Farmer
INSERT IGNORE INTO farmers (user_id, cin, region, land_area, crop_type, land_status)
SELECT id, 'AB123456', 'Doukkala', 15.5, 'Betterave', 'Propriétaire' 
FROM users WHERE email = 'client@cosumar.ma';
