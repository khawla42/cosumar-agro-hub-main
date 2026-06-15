# Rapport de Projet : COSUMAR Agro Hub

## 1. Vision Générale

**COSUMAR Agro Hub** est une plateforme numérique intégrée conçue pour moderniser et centraliser la gestion de l'écosystème agricole de COSUMAR. Elle connecte l'administration, les employés sur le terrain et les agriculteurs pour optimiser la production sucrière.

## 2. Architecture Technique (Tech Stack)

- **Frontend** : React.js (Vite), TanStack Router, Tailwind CSS, Lucide React (icones).
- **Backend** : Node.js, Express.
- **Temps Réel** : Socket.io pour les notifications instantanées.
- **Base de données** : MySQL.
- **Sécurité** : Protection SQL Injection, monitoring des logs, protection Brute Force.

## 3. Rôles et Fonctionnalités

### A. Administration (Admin)

Le rôle d'administrateur offre un contrôle total sur la plateforme :

- **Tableau de Bord** : Vue d'ensemble des statistiques de production et alertes de sécurité.
- **Gestion des Utilisateurs** : Contrôle des comptes agriculteurs et employés.
- **Monitoring Sécurité** : Consultation des journaux (logs) système et gestion des IPs bloquées.
- **Logistique** : Suivi global des livraisons et des paiements.

### B. Employé (Field Agent)

L'employé gère les opérations quotidiennes sur le terrain :

- **Gestion des Agriculteurs** : Suivi personnalisé des parcelles et de la production par région.
- **Planification** : Calendrier intégré pour les visites de terrain et les rendez-vous.
- **Production** : Mise à jour des données de récolte et suivi du rendement.
- **Carte Interactive** : Visualisation géographique des zones de culture et de leur état.

### C. Système de Sécurité Avancé

C'est le cœur protecteur du projet :

- **Détection d'Intrusion** : Analyse en temps réel des requêtes pour bloquer les injections SQL.
- **Système d'Alertes** : Notification immédiate des administrateurs en cas d'activité suspecte.
- **Historique des Logs** : Traçabilité complète de chaque action effectuée sur le système.

## 4. Modules Clés et Fichiers Associés

- **Messages** : Gestion des formulaires de contact (`src/routes/admin/messages.tsx`).
- **Production** : Analyse des données agricoles (`src/routes/employe/production.tsx`).
- **Paiements** : Suivi financier des agriculteurs (`src/routes/employe/payments.tsx`).
- **Livraisons** : Gestion du flux logistique (`src/routes/admin/deliveries.tsx`).

## 5. Points Forts du Projet

- **Interface Moderne** : Design épuré, réactif et supportant le mode sombre.
- **Stabilité** : Protection contre les erreurs de données (data hardening) sur toutes les pages.
- **Communication** : Système de notifications Push en temps réel.

---

_Document généré le 30 Mai 2026 pour COSUMAR Agro Hub._
