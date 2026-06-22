# COSUMAR Agro Hub

Plateforme de gestion agricole pour la filière sucrière au Maroc.

## 📸 Captures d'écran

### Page d'accueil
![Home1](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Home1.PNG)
![Home2](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Home2.PNG)
![Home3](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Home3.PNG)
![Home4](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Home4.PNG)
![Home5](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Home5.PNG)
![Home6](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Home6.PNG)

### Authentification
![Choisissez votre rôle](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Choisissez_votre_rôle.PNG)
![Login Administrateur](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Login_Administrateur.PNG)
![Créer un compte Agriculteur](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Créer_un_compte_Agriculteur.jpeg)

### Tableaux de bord
![Tableau de bord](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Tableau_de_bord.jpeg)
![Client Dashboard](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/cleint.PNG)

### Production
![Production de Betterave](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Production_de_Betterave.jpeg)

### Gestion
![Gestion des Agriculteurs](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Gestion_des_Agriculteurs.jpeg)
![Employés](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Employés.PNG)
![Livraisons Admin](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Livraisons_Admin.jpeg)
![Paiements Admin](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Paiements_Admin.PNG)
![Nouvelle Transaction](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Nouvelle_Transaction.PNG)

### Sécurité
![Sécurité](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Sécurité.jpeg)
![Journaux du Système](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Journaux_du_Système.jpeg)

### Tests d'attaques (Défense)
- **Brute Force**
  ![Brute Force dans Kali sans Captcha](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/brute_force _dans_kali_sans_captcha.PNG)
  ![Sécurité Admin Brute Force sans Captcha](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Sécurité_admin_brute_Force_sans_captcha.PNG)
  ![Journaux Admin Brute Force Sans Captcha](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/journaux_admin_brute_Force_Sans_captcha.PNG)
  ![Notification Employé Brute Force Sans Captcha](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Notification_employe_bruteforce_sans_captcha.PNG)

- **SQL Injection & XSS**
  ![ELK Brute Force sans Captcha](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Elk_brute_force_sans_captcha.PNG)
  ![Alerts 1](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Alerts1.PNG)
  ![Alerts 2](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Alerts2.PNG)

- **Broken Access Control**
  ![Broken Access Control Détecté 1](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Broken_Access_Control_Détecté_1.PNG)
  ![Broken Access Control Détecté 2](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Broken_Access_Control_Détecté_2.PNG)
  ![Broken Access Control Détecté 3](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Broken_Access_Control_Détecté_3.PNG)
  ![Broken Access Control Détecté 4](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Broken_Access_Control_Détecté_4.PNG)

- **Parameter Tampering**
  ![Parameter Tampering 1](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/ParameterTamperingimage1.PNG)
  ![Parameter Tampering 2](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Parameter_Tampering_2.PNG)
  ![Parameter Tampering 3](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Parameter_Tampering_3.PNG)
  ![Parameter Tampering 4](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Parameter_Tampering_4.PNG)

### Autres
![Messages de Contact Admin](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Messages_de_Contact_Admin.PNG)
![Ajouter un Employé](https://raw.githubusercontent.com/khawla42/cosumar-agro-hub-main/main/image_attack/Ajouter_un_employé.PNG)

## 🚀 Installation

```bash
# Backend
cd backend
npm install
npm start

# Frontend
npm install
npm run dev
```

## 🛡️ Sécurité

Le projet inclut des protections contre:
- Brute Force (avec blocage IP)
- SQL Injection
- XSS (Cross-Site Scripting)
- Broken Access Control (contrôle d'accès par rôle)
- Parameter Tampering

## 📝 License

© 2026 COSUMAR. Tous droits réservés.
