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
    product_name VARCHAR(100) DEFAULT 'Betterave', -- Ajouté pour le type de produit
    quantity_tons FLOAT NOT NULL,
    sugar_content FLOAT DEFAULT 16.5,      -- Taux de sucre (richesse)
    harvest_date DATE,
    status ENUM('pending', 'validated', 'processed') DEFAULT 'pending',
    progress INT DEFAULT 0,                 -- Ajouté pour le suivi (0-100)
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (plot_id) REFERENCES plots(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Table des LIVRAISONS (Logistique vers l'usine)
CREATE TABLE IF NOT EXISTS deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    production_id INT NULL,
    farmer_id INT NULL,
    delivery_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    truck_plate VARCHAR(20),
    driver_name VARCHAR(255),
    origin VARCHAR(100),
    destination_factory VARCHAR(255),
    eta VARCHAR(10),
    status ENUM('en_route', 'delivered', 'cancelled', 'retard') DEFAULT 'en_route',
    FOREIGN KEY (production_id) REFERENCES production(id) ON DELETE SET NULL,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. Table des PAIEMENTS (Transactions financières)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    production_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    payment_date DATE,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    transaction_ref VARCHAR(100), -- Supprimé UNIQUE car on y stocke souvent le mode (Virement, etc.)
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
    status ENUM('success', 'failed', 'warning', 'critical') DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. Table des MESSAGES DE CONTACT
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 10. Table de suivi des messages lus par utilisateur
CREATE TABLE IF NOT EXISTS user_message_read (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message_id INT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES contact_messages(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_message (user_id, message_id)
) ENGINE=InnoDB;

-- 10. Table du CALENDRIER (Événements)
CREATE TABLE IF NOT EXISTS calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'visite',
    time TIME,
    location VARCHAR(255),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 11. Table des NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- NULL pour notifications globales (staff)
    type ENUM('urgent', 'success', 'warning', 'info') DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `read` BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Table des RÉGIONS (CARTE)
CREATE TABLE IF NOT EXISTS regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    status ENUM('optimal', 'warning', 'critical') DEFAULT 'optimal',
    production VARCHAR(50),
    farmers INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 13. Table des PARAMÈTRES (Configuration globale)
CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==========================================================
-- DONNEES SYSTEME MINIMALES
-- ==========================================================

-- Paramètres de sécurité par défaut
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('security_captcha', 'false');
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('security_strict_pwd', 'true');
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('security_session_exp', 'true');
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('security_ip_block', 'true');

-- Compte administrateur initial (a changer apres la premiere connexion)
INSERT IGNORE INTO users (full_name, email, password, role) 
VALUES ('Administrateur Système', 'admin@cosumar.ma', 'admin123', 'admin');
