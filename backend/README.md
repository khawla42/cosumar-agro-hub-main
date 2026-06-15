# Backend Cosumar Agro Hub

Ce backend est construit avec Node.js, Express et MySQL.

## Prérequis

- Node.js installé
- MySQL installé et en cours d'exécution

## Installation

1. Accédez au dossier backend :
   ```bash
   cd backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```

## Configuration

1. Créez une base de données MySQL nommée `cosumar_db` (ou le nom que vous avez choisi dans le fichier `.env`).
2. Modifiez le fichier `.env` avec vos identifiants MySQL :
   ```env
   PORT=5000
      DB_HOST=localhost
      DB_USER=votre_utilisateur
      DB_PASSWORD=votre_mot_de_passe
      DB_NAME=cosumar_db
   ```

## Démarrage

- Pour le développement (avec redémarrage automatique) :
  ```bash
   npm run dev
  ```
- Pour la production :
  ```bash
   npm start
  ```

## Points de terminaison (Endpoints)

- `GET /` : Message de bienvenue.
- `GET /test-db` : Vérifie la connexion à la base de données.

## Intégration ELK (Elasticsearch, Logstash, Kibana)

Le backend est maintenant compatible avec la suite ELK :

- **Format** : Les logs sont générés au format **JSON structuré**.
- **Localisation** : Les fichiers de logs se trouvent dans `backend/logs/combined.log` et `backend/logs/error.log`.
- **Configuration ELK** : Utilisez **Filebeat** pour lire ces fichiers JSON et les envoyer vers Logstash ou directement vers Elasticsearch.

Le serveur API est configuré sur le port **5000**.
L'interface utilisateur (frontend) est généralement sur le port **8080** ou **5173**.
