# Port de Plaisance Russell - API REST

API REST développée avec Node.js et Express permettant la gestion des réservations de catways au sein d’un port de plaisance.

Le projet permet :
- la gestion des utilisateurs
- l’authentification sécurisée
- la gestion des catways
- la gestion des réservations
- la validation des contraintes métier

# Technologies utilisées

## Backend
- Node.js
- Express
- MongoDB
- Mongoose

## Authentification & sécurité
- bcryptjs
- jsonwebtoken
- cookie-session
- cors

## Tests & outils
- Jest
- Supertest
- Nodemon
- Clinic.js
- Autocannon

# Compétences développées
- Développement d'API REST
- Gestion d'authentification JWT
- Manipulation de MongoDB avec Mongoose
- Validation des règles métier
- Sécurisation d'une API
- Tests backend avec Jest et Supertest
- Gestion des routes Express
- Architecture backend Node.js


# Fonctionnalités

## Utilisateurs
- création de compte
- authentification sécurisée
- gestion des sessions

## Catways
- création et gestion des catways
- gestion des états :
    - libre
    - occupé
    - maintenance
 
## Réservations
- création des réservations
- validation des dates
- prévention des chevauchements
- gestion des disponibilités

# Structure du projet
```text
port-plaisance-russell/
├── controllers/
├── models/
├── routes/
├── middleware/
├── tests/
├── env/
├── seed.js
├── app.js
└── README.md
```

# Installation

## Installer les dépendances
```bash
npm install
```

## Configurer les variables d'environnement
```bash
cp env/.env.dev .env
```
Configurer:
- URI MongoDB
- PORT

## Initialiser la base de données
```bash
node seed.js
```
Les collections Catways et Réservations seront vidées puis remplies avec les données du seed

## Lancer le serveur
```bash
npm start
```
L'API sera disponible sur :
```bash
http://localhost:3000/
```

# 5.Tests
```bash
npm test
```

## Sécurité
Les données sensibles et variables d'environnement ne sont pas incluses dans le repository.

# Contact
📧 ad15canon@gmail.com

