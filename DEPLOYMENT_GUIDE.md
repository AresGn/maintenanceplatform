# Guide de Déploiement - Maintenance Platform

## 🚀 Déploiement sur Vercel (Frontend + Backend séparés)

### Étape 1: Déployer le Frontend

1. **Connecter le repository principal à Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Cliquer sur "New Project"
   - Importer le repository: `https://github.com/AresGn/maintenanceplatform.git`
   - Vercel détectera automatiquement la configuration grâce au `vercel.json`

2. **Configuration automatique**
   - Le frontend sera buildé depuis le dossier `frontend/`
   - Déploiement automatique sur chaque push vers `main`
   - URL générée: `https://maintenanceplatform-xxx.vercel.app`

### Étape 2: Déployer le Backend (Projet séparé)

1. **Créer un nouveau projet Vercel pour le backend**
   - Créer un nouveau projet Vercel
   - Importer le même repository mais configurer pour le dossier `backend/`
   - Ou créer un repository séparé avec seulement le contenu du dossier `backend/`

2. **Configuration du backend**
   - Vercel utilisera le fichier `backend/vercel.json`
   - Point d'entrée: `backend/api/index.py`
   - Requirements: `backend/requirements-vercel.txt`

3. **Variables d'environnement backend**
   Dans les settings Vercel du projet backend, ajouter:
   ```
   DATABASE_URL=your_neon_database_url
   SECRET_KEY=your_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

### Étape 3: Connecter Frontend et Backend

1. **Récupérer l'URL du backend déployé**
   - Exemple: `https://maintenance-backend-xxx.vercel.app`

2. **Mettre à jour la configuration frontend**
   - Modifier `frontend/.env.production`
   - Remplacer `YOUR_BACKEND_PROJECT_NAME` par le nom réel du projet backend

3. **Variables d'environnement frontend**
   Dans les settings Vercel du projet frontend, ajouter:
   ```
   VITE_API_BASE_URL=https://maintenance-backend-xxx.vercel.app/api
   ```

### Étape 4: Test et Validation

1. **Tester le backend**
   - Aller sur `https://maintenance-backend-xxx.vercel.app/`
   - Vérifier `https://maintenance-backend-xxx.vercel.app/health`

2. **Tester le frontend**
   - Aller sur `https://maintenanceplatform-xxx.vercel.app`
   - Tester la connexion (login avec admin/admin123)

## 🔧 Configuration Alternative (Recommandée)

### Option 1: Backend sur Railway/Render

Si Vercel pose des problèmes avec le backend Python:

1. **Déployer le backend sur Railway**
   - Plus adapté pour FastAPI avec base de données
   - Support natif de PostgreSQL
   - URL stable: `https://maintenance-backend.railway.app`

2. **Frontend reste sur Vercel**
   - Configuration plus simple
   - Meilleure performance pour les sites statiques

### Option 2: Tout sur Railway

1. **Déployer frontend et backend sur Railway**
   - Un seul projet avec deux services
   - Configuration plus cohérente
   - Gestion simplifiée des variables d'environnement

## 📝 Checklist de Déploiement

### Avant le déploiement:
- [ ] Build frontend réussi (`npm run build`)
- [ ] Tests backend passent
- [ ] Variables d'environnement configurées
- [ ] Base de données Neon accessible

### Après le déploiement:
- [ ] Frontend accessible
- [ ] Backend répond aux requêtes
- [ ] Authentification fonctionne
- [ ] CORS configuré correctement
- [ ] Base de données connectée

## 🚨 Problèmes Courants

### Erreur "cd: frontend: No such directory"
**Solution appliquée**: Utiliser `rootDirectory: "frontend"` dans vercel.json au lieu de `cd frontend &&` dans les commandes.

### CORS Errors
```javascript
// Si erreurs CORS, vérifier la configuration backend
allow_origins=["https://your-frontend-domain.vercel.app"]
```

### Database Connection
```python
# Vérifier la variable DATABASE_URL
# Format: postgresql://user:password@host:port/database
```

### Build Errors
```bash
# Si erreurs TypeScript, vérifier:
npm run build  # Doit passer sans erreurs
```

## 📞 Support

En cas de problème:
1. Vérifier les logs Vercel
2. Tester les endpoints individuellement
3. Vérifier les variables d'environnement
4. Consulter la documentation Vercel/Railway
