# Script PowerShell pour démarrer le frontend et le backend
Write-Host "🚀 Démarrage de la plateforme de maintenance..." -ForegroundColor Green
Write-Host ""

# Vérifier si Python est installé
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python détecté: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    exit 1
}

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installation des dépendances si nécessaire..." -ForegroundColor Yellow

# Installer les dépendances du frontend si nécessaire
if (!(Test-Path "frontend/node_modules")) {
    Write-Host "Installation des dépendances frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

# Installer les dépendances du backend si nécessaire
if (!(Test-Path "backend/venv")) {
    Write-Host "Création de l'environnement virtuel Python..." -ForegroundColor Yellow
    Set-Location backend
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    Set-Location ..
} else {
    Write-Host "Activation de l'environnement virtuel Python..." -ForegroundColor Yellow
    Set-Location backend
    .\venv\Scripts\Activate.ps1
    Set-Location ..
}

Write-Host ""
Write-Host "🌐 Démarrage des serveurs..." -ForegroundColor Green
Write-Host "   - Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter les serveurs" -ForegroundColor Yellow
Write-Host ""

# Démarrer les deux serveurs en parallèle
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    .\venv\Scripts\Activate.ps1
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location frontend
    npm run dev
}

# Attendre que l'utilisateur appuie sur Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Vérifier si les jobs sont toujours en cours
        if ($backendJob.State -eq "Failed") {
            Write-Host "❌ Le backend a échoué" -ForegroundColor Red
            Receive-Job $backendJob
            break
        }
        
        if ($frontendJob.State -eq "Failed") {
            Write-Host "❌ Le frontend a échoué" -ForegroundColor Red
            Receive-Job $frontendJob
            break
        }
    }
} catch {
    Write-Host ""
    Write-Host "🛑 Arrêt des serveurs..." -ForegroundColor Yellow
} finally {
    # Nettoyer les jobs
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Write-Host "✅ Serveurs arrêtés" -ForegroundColor Green
}
