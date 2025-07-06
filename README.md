"# Maintenance Platform

Une plateforme de gestion de maintenance industrielle moderne construite avec React et FastAPI.

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec gestion des rôles (Admin, Superviseur, Technicien)
- **Dashboard interactif** avec métriques en temps réel
- **Gestion des équipements** avec historique de maintenance
- **Planification des interventions** avec calendrier intégré
- **Suivi des performances** et rapports détaillés
- **Interface responsive** optimisée pour tous les appareils

## 🛠️ Technologies

### Frontend
- **React 18** avec TypeScript
- **Ant Design** pour l'interface utilisateur
- **React Router** pour la navigation
- **React Query** pour la gestion des données
- **Vite** pour le build et le développement

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** pour l'ORM
- **PostgreSQL** comme base de données (Neon)
- **Alembic** pour les migrations
- **JWT** pour l'authentification

## 📦 Installation et Développement

### Prérequis
- Node.js 18+
- Python 3.8+
- PostgreSQL (ou compte Neon)

### Installation rapide

1. **Cloner le repository**
```bash
git clone https://github.com/AresGn/maintenanceplatform.git
cd maintenanceplatform
```

2. **Installer les dépendances**
```bash
npm run install:all
```

3. **Configuration de la base de données**
```bash
# Configurer les variables d'environnement dans backend/.env
# Exemple avec Neon Database
DATABASE_URL=postgresql://username:password@host/database
```

4. **Lancer l'application en développement**
```bash
npm run dev
```

L'application sera accessible sur :
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## 🔧 Scripts disponibles

- `npm run dev` - Lance frontend et backend en mode développement
- `npm run build` - Build de production du frontend
- `npm run test` - Lance les tests
- `npm run start` - Lance l'application en mode production

## 🚀 Déploiement

### Frontend sur Vercel

Le projet est configuré pour un déploiement automatique sur Vercel :

1. **Connecter le repository à Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Importer le repository GitHub
   - Vercel détectera automatiquement la configuration

2. **Configuration automatique**
   - Le fichier `vercel.json` configure le build
   - Le frontend sera buildé automatiquement
   - Déploiement sur chaque push vers `main`

### Backend (Recommandations)

Le backend Python nécessite un hébergement supportant Python :

**Options recommandées :**
- **Railway** - Déploiement simple avec PostgreSQL intégré
- **Render** - Support Python avec base de données
- **Heroku** - Plateforme classique (payant)
- **DigitalOcean App Platform** - Solution cloud

**⚠️ Note importante :** Vercel ne supporte pas nativement Python pour le backend. Le frontend peut être déployé sur Vercel, mais le backend doit être hébergé séparément.

### Configuration de production

1. **Variables d'environnement frontend** (dans Vercel)
```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

2. **Variables d'environnement backend**
```
DATABASE_URL=your_production_database_url
SECRET_KEY=your_secret_key
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

## 📁 Structure du projet

```
maintenanceplatform/
├── frontend/          # Application React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── dist/          # Build de production
│   └── package.json
├── backend/           # API FastAPI
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── requirements.txt
├── vercel.json        # Configuration Vercel
└── package.json       # Configuration workspace
```

## 🔐 Authentification

L'application utilise un système d'authentification basé sur JWT avec trois niveaux d'accès :

- **Admin** : Accès complet à toutes les fonctionnalités
- **Superviseur** : Gestion des équipes et validation des interventions
- **Technicien** : Exécution des tâches de maintenance

### Comptes de test
- Admin: `admin` / `admin123`
- Superviseur: `super1` / `super123`
- Technicien: `tech1` / `tech123`

## 🌐 Déploiement en cours

- **Repository GitHub** : https://github.com/AresGn/maintenanceplatform.git
- **Frontend** : Prêt pour déploiement Vercel
- **Backend** : Nécessite hébergement Python séparé

## 📝 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request."
