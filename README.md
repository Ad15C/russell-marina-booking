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

##  Utilisateurs

Un utilisateur est caractérisé par :
- un nom
- une adresse e-mail
- un mot de passe (hashé)

---

##  Catways

Les catways possèdent :
- un numéro de pont
- un type
- une description

---

##  Réservations

Une réservation contient :
- le numéro du catway
- le nom du client
- le nom du bateau
- une date de début
- une date de fin

---

##  Technologies et dépendances

Le projet utilise les technologies suivantes :

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

##  Lancer le projet

1. Installer les dépendances :
```bash
npm install

Contact

Pour toute question concernant ce projet, merci de contacter :

Adeline
📧 ad15canon@gmail.com
