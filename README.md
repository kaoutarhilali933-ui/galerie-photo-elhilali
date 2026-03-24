# PhotoGallery — Gestion de Galerie Personnelle & Publique

Application web full-stack moderne permettant aux utilisateurs de gérer leurs photos, d’organiser leur affichage privé et de publier une galerie publique avec un système d’ordre personnalisé.

---

## Table des matières


1. Identifiants de test
2. Aperçu
3. Fonctionnalités
4. Technologies
5. Organisation du projet
7. Défis techniques résolus
8. Installation et lancement
9. Routes principales
10. Améliorations récentes
11. Pistes d’amélioration
12. Auteurs

---

## 1. Identifiants de test

### Compte utilisateur (galerie publique)

| Champ        | Valeur                                      |
| ------------ | ------------------------------------------- |
| Email        | [hafssa@gmail.com] |
| Mot de passe | 123456                                      |

 Ce compte contient déjà des photos publiées dans la galerie publique.

---

### 2.Compte administrateur

| Champ        | Valeur                                      |
| ------------ | ------------------------------------------- |
| Email        | [ihssan@gmail.com]|
| Mot de passe | 123456                                      |

---

## 3. Aperçu

PhotoGallery est un projet académique réalisé dans le cadre de la formation **INSSET (année 2025–2026)**.

L’application permet :

* la consultation de galeries publiques
* la gestion de photos personnelles
* la publication contrôlée de photos
* l’administration des utilisateurs

---

## 4. Fonctionnalités

### Utilisateur

* Inscription / Connexion (JWT)
* Upload de photos
* Suppression de photos
* Dashboard personnel (photos propres uniquement)
* Publication avec ordre personnalisé

### Galerie publique

* Liste dynamique des utilisateurs publics
* Accès à une galerie par pseudo
* Téléchargement des photos
* Lazy loading des images

### Administration

* Liste des utilisateurs
* Suppression utilisateur
* Déblocage utilisateur

---

## 5. Technologies

### Backend

* Symfony
* API Platform
* Doctrine ORM
* JWT

### Frontend

* React
* React Router
* Axios

### Base de données

* MySQL

### DevOps

* Docker

---

## 6. Organisation du projet

```bash
galerie-photo-elhilali/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

---

## 7. Défis techniques résolus

* Séparation des photos par utilisateur (`/api/my/photos`)
* Synchronisation galerie publique / utilisateurs
* Gestion de l’ordre de publication
* Correction des bugs d’affichage multi-utilisateurs


---

## 8. Installation et lancement

```bash
docker-compose up -d --build
```

Accès :

* Frontend : [http://localhost:5173](http://localhost:5173)
* Backend : [http://localhost:8000](http://localhost:8000)
* API Docs : [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

---

## 9. Routes principales

* GET /api/my/photos
* GET /api/public/users
* GET /api/public/galleries/{pseudo}
* POST /api/photos/upload
* GET /api/photos/{id}/download

---

## 10. Améliorations récentes

* Dashboard spécifique à l’utilisateur
* Galerie publique dynamique
* Upload avec gestion de visibilité
* Lazy loading des images

---

## 11. Pistes d’amélioration

* Pagination
* Recherche / filtres
* UI/UX avancée
* Déploiement cloud

---

## 12. Auteurs

Kaoutar El Hilali — Étudiante Développeuse Full Stack / L3 MN
Projet universitaire INSSET — 2025–2026
