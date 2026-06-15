-- ==========================================================
-- BASE DE DONNÉES COSUMAR AGRO HUB - COMPLÈTE (SCHÉMA + DONNÉES)
-- Pour importation dans XAMPP/phpMyAdmin
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `cosumar_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `cosumar_db`;

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Structure de la table `regions`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `regions`;

CREATE TABLE `regions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(11,8) NOT NULL,
  `status` enum('optimal','warning','critical') DEFAULT 'optimal',
  `production` varchar(50) DEFAULT NULL,
  `farmers` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Déchargement des données de la table `regions`
-- --------------------------------------------------------

INSERT INTO `regions` (`id`, `name`, `lat`, `lng`, `status`, `production`, `farmers`, `created_at`) VALUES
  (1, 'Doukkala', '32.99080000', '-8.27250000', 'optimal', 'Betterave', 1250, '2026-06-13 16:45:00'),
  (2, 'Gharb', '34.26100000', '-6.58180000', 'warning', 'Canne à sucre', 850, '2026-06-13 16:45:00'),
  (3, 'Tadla', '32.33730000', '-6.35330000', 'optimal', 'Betterave', 1100, '2026-06-13 16:45:00'),
  (4, 'Moulouya', '34.68140000', '-1.90860000', 'critical', 'Betterave', 400, '2026-06-13 16:45:00'),
  (5, 'Loukkos', '35.19320000', '-6.15570000', 'optimal', 'Canne à sucre', 720, '2026-06-13 16:45:00');

-- --------------------------------------------------------
-- Structure de la table `users`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','employe','client') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Déchargement des données de la table `users`
-- --------------------------------------------------------

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `phone`, `status`, `last_login`, `created_at`) VALUES
  (1, 'Administrateur Système', 'admin@cosumar.ma', 'admin123', 'admin', '0600000001', 'active', NULL, '2026-06-13 16:44:59'),
  (2, 'Responsable Zone', 'employe@cosumar.ma', 'employe123', 'employe', '0600000002', 'active', NULL, '2026-06-13 16:44:59'),
  (3, 'Ahmed El Fassi', 'ahmed@gmail.com', 'client123', 'client', '0611223344', 'active', NULL, '2026-06-13 16:44:59'),
  (4, 'Fatima Mansouri', 'fatima@gmail.com', 'client123', 'client', '0655667788', 'active', NULL, '2026-06-13 16:44:59'),
  (5, 'Mohamed Alami', 'mohamed@gmail.com', 'client123', 'client', '0699887766', 'active', NULL, '2026-06-13 16:44:59'),
  (6, 'Youssef Bennani', 'youssef@gmail.com', 'client123', 'client', '0644332211', 'active', NULL, '2026-06-13 16:44:59'),
  (7, 'Khadija Idrisi', 'khadija@gmail.com', 'client123', 'client', '0677889900', 'active', NULL, '2026-06-13 16:44:59');

-- --------------------------------------------------------
-- Structure de la table `employees`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `matricule` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricule` (`matricule`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Déchargement des données de la table `employees`
-- --------------------------------------------------------

INSERT INTO `employees` (`id`, `user_id`, `matricule`, `department`, `position`, `hire_date`) VALUES
  (1, 1, 'ADM001', 'Direction', 'Admin Système', '2023-01-15 00:00:00'),
  (2, 2, 'EMP042', 'Opérations', 'Superviseur Zone', '2023-06-09 23:00:00');

-- --------------------------------------------------------
-- Structure de la table `farmers`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `farmers`;

CREATE TABLE `farmers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `cin` varchar(20) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `land_area` float DEFAULT 0,
  `crop_type` varchar(100) DEFAULT NULL,
  `land_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cin` (`cin`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `farmers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Déchargement des données de la table `farmers`
-- --------------------------------------------------------

INSERT INTO `farmers` (`id`, `user_id`, `cin`, `region`, `land_area`, `crop_type`, `land_status`) VALUES
  (1, 3, 'AB100000', 'Doukkala', 6.21728, 'Betterave Sucrière', 'Propriétaire'),
  (2, 4, 'AB100001', 'Gharb', 16.9861, 'Betterave Sucrière', 'Propriétaire'),
  (3, 5, 'AB100002', 'Tadla', 18.2903, 'Betterave Sucrière', 'Propriétaire'),
  (4, 6, 'AB100003', 'Moulouya', 12.5892, 'Betterave Sucrière', 'Propriétaire'),
  (5, 7, 'AB100004', 'Loukkos', 10.6189, 'Betterave Sucrière', 'Propriétaire');

-- --------------------------------------------------------
-- Structure de la table `plots`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `plots`;

CREATE TABLE `plots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmer_id` int(11) NOT NULL,
  `location_gps` varchar(255) DEFAULT NULL,
  `area` float NOT NULL,
  `culture_type` enum('Betterave') NOT NULL,
  `planting_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `farmer_id` (`farmer_id`),
  CONSTRAINT `plots_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Déchargement des données de la table `plots`
-- --------------------------------------------------------

INSERT INTO `plots` (`id`, `farmer_id`, `location_gps`, `area`, `culture_type`, `planting_date`) VALUES
  (1, 1, '33.64686510619079 , -6.3806013705510845', 6.99872, 'Betterave', '2023-11-15 00:00:00'),
  (2, 1, '33.184014297316956 , -6.4923891047383595', 3.96616, 'Betterave', '2023-11-15 00:00:00'),
  (3, 2, '33.60032233628631 , -6.351409157310544', 10.4898, 'Betterave', '2023-11-15 00:00:00'),
  (4, 2, '33.2345600441631 , -6.497559023195612', 2.92328, 'Betterave', '2023-11-15 00:00:00'),
  (5, 3, '33.58384054735238 , -6.574555274473824', 7.94823, 'Betterave', '2023-11-15 00:00:00'),
  (6, 3, '33.64712611633483 , -6.839543094392947', 5.03896, 'Betterave', '2023-11-15 00:00:00'),
  (7, 3, '33.398562909496164 , -6.715463115332833', 2.39833, 'Betterave', '2023-11-15 00:00:00'),
  (8, 4, '33.14354231064987 , -6.3249519420365585', 10.0634, 'Betterave', '2023-11-15 00:00:00'),
  (9, 5, '33.62965426566967 , -6.561420864771689', 3.54084, 'Betterave', '2023-11-15 00:00:00'),
  (10, 5, '33.463681951876886 , -6.9900122492991414', 2.23666, 'Betterave', '2023-11-15 00:00:00');

-- --------------------------------------------------------
-- Structure de la table `production`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `production`;

CREATE TABLE `production` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmer_id` int(11) NOT NULL,
  `plot_id` int(11) DEFAULT NULL,
  `product_name` varchar(100) DEFAULT 'Betterave',
  `quantity_tons` float NOT NULL,
  `sugar_content` float DEFAULT 16.5,
  `harvest_date` date DEFAULT NULL,
  `status` enum('pending','validated','processed') DEFAULT 'pending',
  `progress` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `farmer_id` (`farmer_id`),
  KEY `plot_id` (`plot_id`),
  CONSTRAINT `production_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `production_ibfk_2` FOREIGN KEY (`plot_id`) REFERENCES `plots` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Déchargement des données de la table `production`
-- --------------------------------------------------------

INSERT INTO `production` (`id`, `farmer_id`, `plot_id`, `product_name`, `quantity_tons`, `sugar_content`, `harvest_date`, `status`, `progress`) VALUES
  (1, 1, 1, 'Betterave', 19.2474, 17.5853, '2026-06-12 23:00:00', 'validated', 100),
  (2, 1, 1, 'Betterave', 8.64512, 18.6275, '2026-05-12 23:00:00', 'validated', 100),
  (3, 1, 1, 'Betterave', 19.7439, 16.2276, '2026-04-12 23:00:00', 'validated', 100),
  (4, 1, 1, 'Betterave', 19.3699, 16.1579, '2026-03-13 00:00:00', 'validated', 100),
  (5, 1, 1, 'Betterave', 10.7078, 18.9747, '2026-02-13 00:00:00', 'validated', 100),
  (6, 1, 1, 'Betterave', 14.9603, 17.2886, '2026-01-13 00:00:00', 'validated', 100),
  (7, 1, 2, 'Betterave', 15.7362, 18.7065, '2026-06-12 23:00:00', 'validated', 100),
  (8, 1, 2, 'Betterave', 8.37789, 16.3413, '2026-05-12 23:00:00', 'validated', 100),
  (9, 1, 2, 'Betterave', 20.087, 18.5509, '2026-04-12 23:00:00', 'validated', 100),
  (10, 1, 2, 'Betterave', 6.39078, 16.8149, '2026-03-13 00:00:00', 'validated', 100),
  (11, 1, 2, 'Betterave', 23.1387, 16.6317, '2026-02-13 00:00:00', 'validated', 100),
  (12, 1, 2, 'Betterave', 7.14519, 17.349, '2026-01-13 00:00:00', 'validated', 100),
  (13, 2, 3, 'Betterave', 8.23377, 16.0935, '2026-06-12 23:00:00', 'validated', 100),
  (14, 2, 3, 'Betterave', 21.4706, 16.032, '2026-05-12 23:00:00', 'validated', 100),
  (15, 2, 3, 'Betterave', 19.7762, 16.7882, '2026-04-12 23:00:00', 'validated', 100),
  (16, 2, 3, 'Betterave', 23.832, 16.2532, '2026-03-13 00:00:00', 'validated', 100),
  (17, 2, 3, 'Betterave', 18.7717, 18.9581, '2026-02-13 00:00:00', 'validated', 100),
  (18, 2, 3, 'Betterave', 5.51674, 16.0332, '2026-01-13 00:00:00', 'validated', 100),
  (19, 2, 4, 'Betterave', 11.4352, 17.2079, '2026-06-12 23:00:00', 'validated', 100),
  (20, 2, 4, 'Betterave', 15.8759, 17.9983, '2026-05-12 23:00:00', 'validated', 100),
  (21, 2, 4, 'Betterave', 21.971, 16.8768, '2026-04-12 23:00:00', 'validated', 100),
  (22, 2, 4, 'Betterave', 11.0241, 17.1291, '2026-03-13 00:00:00', 'validated', 100),
  (23, 2, 4, 'Betterave', 10.3939, 16.5268, '2026-02-13 00:00:00', 'validated', 100),
  (24, 2, 4, 'Betterave', 12.1815, 18.7933, '2026-01-13 00:00:00', 'validated', 100),
  (25, 3, 5, 'Betterave', 8.25582, 18.6492, '2026-06-12 23:00:00', 'validated', 100),
  (26, 3, 5, 'Betterave', 16.0669, 17.257, '2026-05-12 23:00:00', 'validated', 100),
  (27, 3, 5, 'Betterave', 23.8064, 18.7149, '2026-04-12 23:00:00', 'validated', 100),
  (28, 3, 5, 'Betterave', 18.4561, 18.9265, '2026-03-13 00:00:00', 'validated', 100),
  (29, 3, 5, 'Betterave', 6.56437, 17.3828, '2026-02-13 00:00:00', 'validated', 100),
  (30, 3, 5, 'Betterave', 8.44304, 17.6178, '2026-01-13 00:00:00', 'validated', 100),
  (31, 3, 6, 'Betterave', 12.8165, 17.2205, '2026-06-12 23:00:00', 'validated', 100),
  (32, 3, 6, 'Betterave', 18.405, 16.0116, '2026-05-12 23:00:00', 'validated', 100),
  (33, 3, 6, 'Betterave', 20.3253, 18.911, '2026-04-12 23:00:00', 'validated', 100),
  (34, 3, 6, 'Betterave', 23.0685, 17.2151, '2026-03-13 00:00:00', 'validated', 100),
  (35, 3, 6, 'Betterave', 9.83297, 17.1766, '2026-02-13 00:00:00', 'validated', 100),
  (36, 3, 6, 'Betterave', 14.1107, 18.0526, '2026-01-13 00:00:00', 'validated', 100),
  (37, 3, 7, 'Betterave', 20.9077, 18.9559, '2026-06-12 23:00:00', 'validated', 100),
  (38, 3, 7, 'Betterave', 14.7952, 17.2453, '2026-05-12 23:00:00', 'validated', 100),
  (39, 3, 7, 'Betterave', 23.9343, 18.215, '2026-04-12 23:00:00', 'validated', 100),
  (40, 3, 7, 'Betterave', 15.8459, 18.4824, '2026-03-13 00:00:00', 'validated', 100),
  (41, 3, 7, 'Betterave', 7.38191, 17.7136, '2026-02-13 00:00:00', 'validated', 100),
  (42, 3, 7, 'Betterave', 13.773, 17.3184, '2026-01-13 00:00:00', 'validated', 100),
  (43, 4, 8, 'Betterave', 18.2871, 18.0773, '2026-06-12 23:00:00', 'validated', 100),
  (44, 4, 8, 'Betterave', 16.2382, 17.1258, '2026-05-12 23:00:00', 'validated', 100),
  (45, 4, 8, 'Betterave', 6.12763, 18.0559, '2026-04-12 23:00:00', 'validated', 100),
  (46, 4, 8, 'Betterave', 21.9036, 18.9864, '2026-03-13 00:00:00', 'validated', 100),
  (47, 4, 8, 'Betterave', 17.5696, 17.8417, '2026-02-13 00:00:00', 'validated', 100),
  (48, 4, 8, 'Betterave', 5.98121, 18.4392, '2026-01-13 00:00:00', 'validated', 100),
  (49, 5, 9, 'Betterave', 24.856, 16.6758, '2026-06-12 23:00:00', 'validated', 100),
  (50, 5, 9, 'Betterave', 17.6733, 17.4316, '2026-05-12 23:00:00', 'validated', 100),
  (51, 5, 9, 'Betterave', 10.8733, 17.4967, '2026-04-12 23:00:00', 'validated', 100),
  (52, 5, 9, 'Betterave', 11.788, 16.1949, '2026-03-13 00:00:00', 'validated', 100),
  (53, 5, 9, 'Betterave', 9.42237, 17.704, '2026-02-13 00:00:00', 'validated', 100),
  (54, 5, 9, 'Betterave', 9.59637, 16.7127, '2026-01-13 00:00:00', 'validated', 100),
  (55, 5, 10, 'Betterave', 24.4411, 17.1326, '2026-06-12 23:00:00', 'validated', 100),
  (56, 5, 10, 'Betterave', 10.4649, 16.6582, '2026-05-12 23:00:00', 'validated', 100),
  (57, 5, 10, 'Betterave', 6.42923, 18.2786, '2026-04-12 23:00:00', 'validated', 100),
  (58, 5, 10, 'Betterave', 22.7973, 16.5574, '2026-03-13 00:00:00', 'validated', 100),
  (59, 5, 10, 'Betterave', 8.74146, 18.1587, '2026-02-13 00:00:00', 'validated', 100),
  (60, 5, 10, 'Betterave', 11.1905, 17.4551, '2026-01-13 00:00:00', 'validated', 100);

-- --------------------------------------------------------
-- Structure de la table `deliveries`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `deliveries`;

CREATE TABLE `deliveries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `production_id` int(11) DEFAULT NULL,
  `farmer_id` int(11) DEFAULT NULL,
  `delivery_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `truck_plate` varchar(20) DEFAULT NULL,
  `driver_name` varchar(255) DEFAULT NULL,
  `origin` varchar(100) DEFAULT NULL,
  `destination_factory` varchar(255) DEFAULT NULL,
  `eta` varchar(10) DEFAULT NULL,
  `status` enum('en_route','delivered','cancelled','retard') DEFAULT 'en_route',
  PRIMARY KEY (`id`),
  KEY `production_id` (`production_id`),
  KEY `farmer_id` (`farmer_id`),
  CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`production_id`) REFERENCES `production` (`id`) ON DELETE SET NULL,
  CONSTRAINT `deliveries_ibfk_2` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Déchargement des données de la table `deliveries`
-- --------------------------------------------------------

INSERT INTO `deliveries` (`id`, `production_id`, `farmer_id`, `delivery_date`, `truck_plate`, `driver_name`, `origin`, `destination_factory`, `eta`, `status`) VALUES
  (1, 1, 1, '2026-06-13 16:45:00', '89507|A|86', 'Chauffeur 32', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (2, 2, 1, '2026-06-13 16:45:00', '35157|A|98', 'Chauffeur 64', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (3, 3, 1, '2026-06-13 16:45:00', '48085|A|12', 'Chauffeur 66', 'Zone Agricole', 'Larache', NULL, 'delivered'),
  (4, 4, 1, '2026-06-13 16:45:00', '48828|A|10', 'Chauffeur 36', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (5, 5, 1, '2026-06-13 16:45:00', '83049|A|94', 'Chauffeur 10', 'Zone Agricole', 'Larache', NULL, 'delivered'),
  (6, 6, 1, '2026-06-13 16:45:00', '19281|A|64', 'Chauffeur 48', 'Zone Agricole', 'Sidi Bennour', NULL, 'delivered'),
  (7, 7, 1, '2026-06-13 16:45:00', '17611|A|13', 'Chauffeur 8', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (8, 8, 1, '2026-06-13 16:45:00', '86805|A|92', 'Chauffeur 38', 'Zone Agricole', 'Sidi Bennour', NULL, 'delivered'),
  (9, 9, 1, '2026-06-13 16:45:00', '69494|A|80', 'Chauffeur 0', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (10, 10, 1, '2026-06-13 16:45:00', '92791|A|51', 'Chauffeur 81', 'Zone Agricole', 'Sidi Bennour', NULL, 'delivered'),
  (11, 11, 1, '2026-06-13 16:45:00', '75813|A|81', 'Chauffeur 72', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (12, 12, 1, '2026-06-13 16:45:00', '49820|A|54', 'Chauffeur 23', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (13, 13, 2, '2026-06-13 16:45:00', '17182|A|31', 'Chauffeur 29', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (14, 14, 2, '2026-06-13 16:45:00', '57972|A|43', 'Chauffeur 46', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (15, 15, 2, '2026-06-13 16:45:00', '61824|A|59', 'Chauffeur 77', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (16, 16, 2, '2026-06-13 16:45:00', '17382|A|35', 'Chauffeur 23', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (17, 17, 2, '2026-06-13 16:45:00', '31683|A|13', 'Chauffeur 15', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (18, 18, 2, '2026-06-13 16:45:00', '70939|A|40', 'Chauffeur 6', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (19, 19, 2, '2026-06-13 16:45:00', '68223|A|23', 'Chauffeur 67', 'Zone Agricole', 'Larache', NULL, 'delivered'),
  (20, 20, 2, '2026-06-13 16:45:00', '46717|A|98', 'Chauffeur 64', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (21, 21, 2, '2026-06-13 16:45:00', '57900|A|96', 'Chauffeur 92', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (22, 22, 2, '2026-06-13 16:45:00', '80545|A|94', 'Chauffeur 59', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (23, 23, 2, '2026-06-13 16:45:00', '77348|A|46', 'Chauffeur 3', 'Zone Agricole', 'Sidi Bennour', NULL, 'delivered'),
  (24, 24, 2, '2026-06-13 16:45:00', '15191|A|88', 'Chauffeur 4', 'Zone Agricole', 'Larache', NULL, 'delivered'),
  (25, 25, 3, '2026-06-13 16:45:00', '56086|A|3', 'Chauffeur 77', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (26, 26, 3, '2026-06-13 16:45:00', '70628|A|89', 'Chauffeur 81', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (27, 27, 3, '2026-06-13 16:45:00', '18240|A|49', 'Chauffeur 56', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (28, 28, 3, '2026-06-13 16:45:00', '4981|A|80', 'Chauffeur 96', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (29, 29, 3, '2026-06-13 16:45:00', '16618|A|94', 'Chauffeur 64', 'Zone Agricole', 'Sidi Bennour', NULL, 'delivered'),
  (30, 30, 3, '2026-06-13 16:45:00', '7046|A|15', 'Chauffeur 23', 'Zone Agricole', 'Larache', NULL, 'delivered'),
  (31, 31, 3, '2026-06-13 16:45:00', '89954|A|22', 'Chauffeur 47', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (32, 32, 3, '2026-06-13 16:45:00', '16103|A|73', 'Chauffeur 34', 'Zone Agricole', 'Sidi Bennour', NULL, 'delivered'),
  (33, 33, 3, '2026-06-13 16:45:00', '87267|A|30', 'Chauffeur 26', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (34, 34, 3, '2026-06-13 16:45:00', '24789|A|44', 'Chauffeur 28', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (35, 35, 3, '2026-06-13 16:45:00', '41725|A|32', 'Chauffeur 0', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (36, 36, 3, '2026-06-13 16:45:00', '4251|A|21', 'Chauffeur 25', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (37, 37, 3, '2026-06-13 16:45:00', '84084|A|8', 'Chauffeur 99', 'Zone Agricole', 'Sidi Bennour', NULL, 'delivered'),
  (38, 38, 3, '2026-06-13 16:45:00', '41272|A|17', 'Chauffeur 8', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (39, 39, 3, '2026-06-13 16:45:00', '78207|A|69', 'Chauffeur 3', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (40, 40, 3, '2026-06-13 16:45:00', '87613|A|63', 'Chauffeur 20', 'Zone Agricole', 'Sidi Bennour', NULL, 'delivered'),
  (41, 41, 3, '2026-06-13 16:45:00', '90312|A|25', 'Chauffeur 50', 'Zone Agricole', 'Larache', NULL, 'delivered'),
  (42, 42, 3, '2026-06-13 16:45:00', '14792|A|96', 'Chauffeur 52', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (43, 43, 4, '2026-06-13 16:45:00', '93933|A|52', 'Chauffeur 29', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (44, 44, 4, '2026-06-13 16:45:00', '29747|A|27', 'Chauffeur 93', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (45, 45, 4, '2026-06-13 16:45:00', '35527|A|19', 'Chauffeur 27', 'Zone Agricole', 'Larache', NULL, 'delivered'),
  (46, 46, 4, '2026-06-13 16:45:00', '74493|A|16', 'Chauffeur 78', 'Zone Agricole', 'Sidi Bennour', NULL, 'delivered'),
  (47, 47, 4, '2026-06-13 16:45:00', '14942|A|68', 'Chauffeur 33', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (48, 48, 4, '2026-06-13 16:45:00', '79920|A|73', 'Chauffeur 29', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (49, 49, 5, '2026-06-13 16:45:00', '66343|A|74', 'Chauffeur 7', 'Zone Agricole', 'Sidi Bennour', NULL, 'delivered'),
  (50, 50, 5, '2026-06-13 16:45:00', '42883|A|61', 'Chauffeur 40', 'Zone Agricole', 'Larache', NULL, 'delivered'),
  (51, 51, 5, '2026-06-13 16:45:00', '59677|A|16', 'Chauffeur 64', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (52, 52, 5, '2026-06-13 16:45:00', '34785|A|44', 'Chauffeur 98', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (53, 53, 5, '2026-06-13 16:45:00', '74581|A|57', 'Chauffeur 3', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (54, 54, 5, '2026-06-13 16:45:00', '13091|A|93', 'Chauffeur 70', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (55, 55, 5, '2026-06-13 16:45:00', '58386|A|43', 'Chauffeur 40', 'Zone Agricole', 'Sidi Bennour', NULL, 'delivered'),
  (56, 56, 5, '2026-06-13 16:45:00', '69428|A|32', 'Chauffeur 3', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (57, 57, 5, '2026-06-13 16:45:00', '22490|A|63', 'Chauffeur 68', 'Zone Agricole', 'Berkane', NULL, 'delivered'),
  (58, 58, 5, '2026-06-13 16:45:00', '49003|A|10', 'Chauffeur 41', 'Zone Agricole', 'Mechra Bel Ksiri', NULL, 'delivered'),
  (59, 59, 5, '2026-06-13 16:45:00', '78076|A|50', 'Chauffeur 29', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered'),
  (60, 60, 5, '2026-06-13 16:45:00', '88838|A|97', 'Chauffeur 89', 'Zone Agricole', 'Souk Sebt', NULL, 'delivered');

-- --------------------------------------------------------
-- Structure de la table `payments`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `payments`;

CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmer_id` int(11) NOT NULL,
  `production_id` int(11) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_date` date DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `transaction_ref` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `farmer_id` (`farmer_id`),
  KEY `production_id` (`production_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`production_id`) REFERENCES `production` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Déchargement des données de la table `payments`
-- --------------------------------------------------------

INSERT INTO `payments` (`id`, `farmer_id`, `production_id`, `amount`, `payment_date`, `status`, `transaction_ref`) VALUES
  (1, 1, 1, '48124.00', '2024-05-31 23:00:00', 'completed', 'VIR-782546'),
  (2, 1, 2, '43286.00', '2024-05-31 23:00:00', 'pending', 'VIR-705728'),
  (3, 1, 3, '19912.00', '2024-05-31 23:00:00', 'completed', 'VIR-818535'),
  (4, 1, 4, '19510.00', '2024-05-31 23:00:00', 'pending', 'VIR-797457'),
  (5, 1, 5, '57238.00', '2024-05-31 23:00:00', 'completed', 'VIR-531400'),
  (6, 1, 6, '34193.00', '2024-05-31 23:00:00', 'pending', 'VIR-138574'),
  (7, 1, 7, '27870.00', '2024-05-31 23:00:00', 'completed', 'VIR-923212'),
  (8, 1, 8, '46590.00', '2024-05-31 23:00:00', 'pending', 'VIR-438286'),
  (9, 1, 9, '59091.00', '2024-05-31 23:00:00', 'completed', 'VIR-793074'),
  (10, 1, 10, '56560.00', '2024-05-31 23:00:00', 'pending', 'VIR-152694'),
  (11, 1, 11, '19110.00', '2024-05-31 23:00:00', 'completed', 'VIR-915310'),
  (12, 1, 12, '56541.00', '2024-05-31 23:00:00', 'pending', 'VIR-10805'),
  (13, 2, 13, '27796.00', '2024-05-31 23:00:00', 'completed', 'VIR-483786'),
  (14, 2, 14, '43437.00', '2024-05-31 23:00:00', 'pending', 'VIR-547484'),
  (15, 2, 15, '32982.00', '2024-05-31 23:00:00', 'completed', 'VIR-647602'),
  (16, 2, 16, '23081.00', '2024-05-31 23:00:00', 'pending', 'VIR-887555'),
  (17, 2, 17, '38191.00', '2024-05-31 23:00:00', 'completed', 'VIR-41124'),
  (18, 2, 18, '58051.00', '2024-05-31 23:00:00', 'pending', 'VIR-274541'),
  (19, 2, 19, '22243.00', '2024-05-31 23:00:00', 'completed', 'VIR-987254'),
  (20, 2, 20, '34910.00', '2024-05-31 23:00:00', 'pending', 'VIR-134729'),
  (21, 2, 21, '11859.00', '2024-05-31 23:00:00', 'completed', 'VIR-557728'),
  (22, 2, 22, '47382.00', '2024-05-31 23:00:00', 'pending', 'VIR-125509'),
  (23, 2, 23, '46564.00', '2024-05-31 23:00:00', 'completed', 'VIR-391430'),
  (24, 2, 24, '49240.00', '2024-05-31 23:00:00', 'pending', 'VIR-719805'),
  (25, 3, 25, '38765.00', '2024-05-31 23:00:00', 'completed', 'VIR-904529'),
  (26, 3, 26, '46048.00', '2024-05-31 23:00:00', 'pending', 'VIR-278167'),
  (27, 3, 27, '20616.00', '2024-05-31 23:00:00', 'completed', 'VIR-32407'),
  (28, 3, 28, '21239.00', '2024-05-31 23:00:00', 'pending', 'VIR-245926'),
  (29, 3, 29, '57077.00', '2024-05-31 23:00:00', 'completed', 'VIR-408007'),
  (30, 3, 30, '20153.00', '2024-05-31 23:00:00', 'pending', 'VIR-469738'),
  (31, 3, 31, '22462.00', '2024-05-31 23:00:00', 'completed', 'VIR-137820'),
  (32, 3, 32, '12264.00', '2024-05-31 23:00:00', 'pending', 'VIR-534283'),
  (33, 3, 33, '45616.00', '2024-05-31 23:00:00', 'completed', 'VIR-680979'),
  (34, 3, 34, '49091.00', '2024-05-31 23:00:00', 'pending', 'VIR-532704'),
  (35, 3, 35, '48804.00', '2024-05-31 23:00:00', 'completed', 'VIR-441259'),
  (36, 3, 36, '29975.00', '2024-05-31 23:00:00', 'pending', 'VIR-118720'),
  (37, 3, 37, '32948.00', '2024-05-31 23:00:00', 'completed', 'VIR-487467'),
  (38, 3, 38, '58106.00', '2024-05-31 23:00:00', 'pending', 'VIR-819160'),
  (39, 3, 39, '17558.00', '2024-05-31 23:00:00', 'completed', 'VIR-606748'),
  (40, 3, 40, '32798.00', '2024-05-31 23:00:00', 'pending', 'VIR-901509'),
  (41, 3, 41, '53008.00', '2024-05-31 23:00:00', 'completed', 'VIR-830240'),
  (42, 3, 42, '22479.00', '2024-05-31 23:00:00', 'pending', 'VIR-148192'),
  (43, 4, 43, '30512.00', '2024-05-31 23:00:00', 'completed', 'VIR-510973'),
  (44, 4, 44, '58112.00', '2024-05-31 23:00:00', 'pending', 'VIR-217759'),
  (45, 4, 45, '17299.00', '2024-05-31 23:00:00', 'completed', 'VIR-45233'),
  (46, 4, 46, '29298.00', '2024-05-31 23:00:00', 'pending', 'VIR-155610'),
  (47, 4, 47, '45836.00', '2024-05-31 23:00:00', 'completed', 'VIR-655908'),
  (48, 4, 48, '14593.00', '2024-05-31 23:00:00', 'pending', 'VIR-745059'),
  (49, 5, 49, '27299.00', '2024-05-31 23:00:00', 'completed', 'VIR-303978'),
  (50, 5, 50, '17801.00', '2024-05-31 23:00:00', 'pending', 'VIR-606095'),
  (51, 5, 51, '41740.00', '2024-05-31 23:00:00', 'completed', 'VIR-11167'),
  (52, 5, 52, '23474.00', '2024-05-31 23:00:00', 'pending', 'VIR-19860'),
  (53, 5, 53, '40256.00', '2024-05-31 23:00:00', 'completed', 'VIR-118830'),
  (54, 5, 54, '42303.00', '2024-05-31 23:00:00', 'pending', 'VIR-855357'),
  (55, 5, 55, '37568.00', '2024-05-31 23:00:00', 'completed', 'VIR-207682'),
  (56, 5, 56, '44253.00', '2024-05-31 23:00:00', 'pending', 'VIR-926204'),
  (57, 5, 57, '43036.00', '2024-05-31 23:00:00', 'completed', 'VIR-198822'),
  (58, 5, 58, '28562.00', '2024-05-31 23:00:00', 'pending', 'VIR-528461'),
  (59, 5, 59, '22964.00', '2024-05-31 23:00:00', 'completed', 'VIR-915562'),
  (60, 5, 60, '20591.00', '2024-05-31 23:00:00', 'pending', 'VIR-164684');

-- --------------------------------------------------------
-- Structure de la table `system_logs`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `system_logs`;

CREATE TABLE `system_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `status` enum('success','failed','warning','critical') DEFAULT 'success',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `system_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Structure de la table `contact_messages`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `contact_messages`;

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Déchargement des données de la table `contact_messages`
-- --------------------------------------------------------

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
  (1, 'Ali Baba', 'ali@example.com', 'Demande d\'adhésion', 'Je souhaite rejoindre la filière betterave.', '2026-06-13 16:45:00');

-- --------------------------------------------------------
-- Structure de la table `user_message_read`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `user_message_read`;

CREATE TABLE `user_message_read` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `read_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_message` (`user_id`,`message_id`),
  KEY `message_id` (`message_id`),
  CONSTRAINT `user_message_read_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_message_read_ibfk_2` FOREIGN KEY (`message_id`) REFERENCES `contact_messages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Structure de la table `calendar_events`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `calendar_events`;

CREATE TABLE `calendar_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT 'visite',
  `time` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Déchargement des données de la table `calendar_events`
-- --------------------------------------------------------

INSERT INTO `calendar_events` (`id`, `title`, `type`, `time`, `location`, `date`, `created_at`) VALUES
  (1, 'Distribution de semences', 'visite', '09:00:00', 'Centre Technique Sidi Bennour', '2026-06-09 23:00:00', '2026-06-13 16:45:00'),
  (2, 'Réunion de coordination', 'reunion', '14:30:00', 'Siège Casablanca', '2026-06-11 23:00:00', '2026-06-13 16:45:00'),
  (3, 'Contrôle phytosanitaire', 'visite', '10:00:00', 'Zone Gharb', '2026-06-14 23:00:00', '2026-06-13 16:45:00');

-- --------------------------------------------------------
-- Structure de la table `notifications`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `notifications`;

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `type` enum('urgent','success','warning','info') DEFAULT 'info',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp(),
  `read` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Réactiver les contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
