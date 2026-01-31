# ArchiveWH - Warhammer Club Website

## Description
Site complet pour un club Warhammer avec gestion des listes d'armées (40k/AoS), rapports de batailles, et codex admin.

## Stack Technologique
- **Frontend**: React + Vite
- **Backend**: Express.js + MySQL
- **Database**: MySQL 8.0

## Architecture

```
ArchiveWH/
├── frontend/                  # React app
│   ├── src/
│   │   ├── pages/            # Pages principales
│   │   │   ├── armyList.jsx
│   │   │   ├── battleReport.jsx
│   │   │   └── codex.jsx
│   │   ├── assets/components/ # Composants réutilisables
│   │   └── App.jsx
│   └── vite.config.js
├── backend/                   # Express server
│   ├── routes/               # Routes API
│   │   ├── armyLists.js
│   │   ├── battleReports.js
│   │   └── codex.js
│   ├── index.js              # Serveur principal
│   ├── db.js                 # Pool MySQL
│   ├── schema.sql            # Schéma DB
│   └── package.json
```

## Installation

### Prerequis
- Node.js 16+
- MySQL Server en local

### 1. Database Setup

Créer la base et importer le schéma:

```bash
mysql -u root -p < backend/schema.sql
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Éditer `.env` si nécessaire (par défaut: localhost, root, base archivewh)

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Lancement

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## Fonctionnalités

### Listes d'Armées
- Créer/lister les listes d'armées par utilisateur
- Support 40k + AoS
- Contenu texte/description

### Rapports de Batailles
- Créer/lister les rapports
- Association aux utilisateurs
- Datés automatiquement

### Codex (Admin)
- Section réservée aux admins
- Créer/consulter les entrées
- Gestion centralisée du contenu

## API Endpoints

### Army Lists
- `GET /api/army-lists` - Lister toutes les listes
- `POST /api/army-lists` - Créer une nouvelle liste

### Battle Reports
- `GET /api/battle-reports` - Lister tous les rapports
- `POST /api/battle-reports` - Créer un nouveau rapport

### Codex
- `GET /api/codex` - Lister les entrées
- `POST /api/codex` - Créer une entrée (admin)

## Notes de Développement

- Les utilisateurs sont actuellement mockés (user_id: 1)
- Ajouter l'authentification, validation, et vérification des droits admin
- Implémenter la pagination pour les listes
- Ajouter les routes PUT/DELETE pour l'édition/suppression
- Configurer les variables d'environnement pour la prod
