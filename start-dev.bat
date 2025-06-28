@echo off
echo 🚀 Démarrage de la plateforme de maintenance...
echo.

REM Vérifier si npm est installé
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installé ou n'est pas dans le PATH
    pause
    exit /b 1
)

REM Vérifier si Python est installé
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python n'est pas installé ou n'est pas dans le PATH
    pause
    exit /b 1
)

echo ✅ Dépendances détectées
echo.
echo 🌐 Démarrage des serveurs...
echo    - Backend: http://localhost:8000
echo    - Frontend: http://localhost:5173
echo.
echo Appuyez sur Ctrl+C pour arrêter les serveurs
echo.

REM Démarrer les serveurs avec npm run dev (utilise concurrently)
npm run dev
