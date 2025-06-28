@echo off
echo 🚀 Démarrage de la plateforme de maintenance...
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.

start "Backend Server" cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo ✅ Serveurs démarrés dans des fenêtres séparées
echo Fermez les fenêtres pour arrêter les serveurs
pause
