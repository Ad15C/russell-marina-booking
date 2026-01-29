# Port de Plaisance Russell

Bienvenue sur le projet du **Port de Plaisance Russell**.

Cette application a pour objectif de gérer les réservations d'emplacements pour amarrer des bateaux (catways) au sein d'un port de plaisance.

---

## Objectif du projet

Mise en place d'une **API REST privée** permettant :

- La gestion des utilisateurs (authentification)
- La gestion des catways
- La gestion des réservations de catways

---

## Utilisateurs

Un utilisateur est caractérisé par :

- un nom
- une adresse e-mail
- un mot de passe (hashé)

---

## Catways

Les catways possèdent :

- un numéro de pont
- un type (court ou long)
- un état (libre, occupé, maintenance)
- une description

---

## Réservations

Une réservation contient :

- le numéro du catway
- le nom du client
- le nom du bateau
- une date de début (`checkIn`)
- une date de fin (`checkOut`)

Chaque réservation est validée pour :

- ne pas chevaucher une autre réservation sur le même catway
- ne pas avoir de date d’arrivée antérieure à aujourd’hui
- avoir une date de départ postérieure à la date d’arrivée

---

## Technologies et dépendances

### Dépendances principales

- express
- mongoose
- cors
- bcryptjs
- jsonwebtoken
- cookie-session

### Dépendances de développement

- nodemon
- clinic
- clinic flame
- autocannon
- jest
- supertest
- env-cmd

---

## Contact

Pour toutes questions concernant ce projet:
Adeline
ad15canon@gmail.com

## Lancer le projet

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp env/.env.dev .env
# Modifier .env pour ajouter votre URI MongoDB et éventuellement le PORT

# 3. Initialiser la base de données
node seed.js
#Les collections Catways et Réservations seront vidées puis remplies avec les données du seed

# 4. Lancer le serveur
npm start
#L'API sera disponible sur http://localhost:3000/

# 5.Tests
npm test

