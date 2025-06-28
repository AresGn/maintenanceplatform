from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.auth import router as auth_router

app = FastAPI(
    title="Maintenance Platform API",
    description="API pour la plateforme de maintenance industrielle",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes d'authentification
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

@app.get("/")
async def root():
    return {"message": "API Maintenance Platform"}

@app.get("/health")
async def health():
    return {"status": "ok"}
