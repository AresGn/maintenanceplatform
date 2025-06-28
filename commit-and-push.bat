@echo off
echo 🚀 Préparation du commit et push...
echo.

REM Vérifier si git est installé
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git n'est pas installé ou n'est pas dans le PATH
    pause
    exit /b 1
)

echo ✅ Git détecté
echo.

REM Afficher le statut actuel
echo 📋 Statut actuel du repository:
git status --short
echo.

REM Ajouter tous les fichiers modifiés
echo 📦 Ajout des fichiers modifiés...
git add .
echo.

REM Créer le commit avec un message détaillé
echo 💾 Création du commit...
git commit -m "🎨 Amélioration majeure des tableaux de bord et du header

✨ Nouvelles fonctionnalités:
- Tableaux de bord basés sur les rôles (Admin, Superviseur, Technicien)
- Routage automatique selon le rôle utilisateur
- Header moderne avec design amélioré et notifications
- Composants réutilisables (StatCard, AlertsWidget, DashboardLayout)

🐛 Corrections importantes:
- Problème 'Bienvenue undefined' corrigé (mapping backend/frontend)
- Header caché résolu (layout amélioré)
- Débordements de texte éliminés
- Cards trop étroites optimisées

🎨 Améliorations UI/UX:
- Header redesigné (80px, gradient, hover effects)
- Responsive design optimisé
- Suppression des éléments problématiques (Pierre Durand)
- Actions rapides optimisées dans dashboard admin

🔧 Améliorations techniques:
- Service d'authentification avec transformation des données
- Types TypeScript complets
- Scripts de démarrage unifiés
- Architecture modulaire"

if %errorlevel% neq 0 (
    echo ❌ Erreur lors du commit
    pause
    exit /b 1
)

echo ✅ Commit créé avec succès
echo.

REM Pousser vers le repository distant
echo 🌐 Push vers le repository distant...
git push

if %errorlevel% neq 0 (
    echo ❌ Erreur lors du push
    echo Vérifiez votre connexion internet et vos permissions
    pause
    exit /b 1
)

echo.
echo ✅ Push réussi !
echo 🎉 Toutes les modifications ont été sauvegardées
echo.
echo 📋 Résumé des changements:
echo    - Tableaux de bord fonctionnels pour les 3 rôles
echo    - Header amélioré et responsive
echo    - Problèmes de débordement résolus
echo    - Architecture modulaire mise en place
echo.
pause
