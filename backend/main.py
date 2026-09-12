from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import logging
import os

from backend.config import settings
from backend.routers import health_router, ml_router, surveillance_router
from backend.models import init_db
from backend.ml.predictor import predictor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting application...")
    init_db()
    predictor.load_models()
    logger.info(f"ML Model Status: {'Ready' if predictor.is_ready() else 'Not Trained'}")
    yield
    logger.info("Shutting down application...")


app = FastAPI(
    title="Healthcare Resource Management System",
    description="Intelligent healthcare resource allocation and patient management system",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(health_router.router, prefix="/api/v1", tags=["health"])
app.include_router(ml_router.router, prefix="/api/v1", tags=["ml"])
app.include_router(surveillance_router.router, prefix="/api/v1", tags=["surveillance"])

# Path to frontend
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")

if os.path.exists(frontend_dir):
    # Mount frontend static directory for CSS/JS/assets
    app.mount("/css", StaticFiles(directory=os.path.join(frontend_dir, "css")), name="css")
    app.mount("/js", StaticFiles(directory=os.path.join(frontend_dir, "js")), name="js")
    
    # Mount assets if available
    assets_dir = os.path.join(frontend_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    async def serve_frontend():
        return FileResponse(os.path.join(frontend_dir, "index.html"))

    @app.get("/api")
    async def api_root():
        return {
            "message": "Healthcare Resource Management System API",
            "version": "1.0.0",
            "status": "operational",
            "endpoints": {
                "patients": "/api/v1/patients",
                "resources": "/api/v1/resources",
                "admissions": "/api/v1/admissions",
                "allocations": "/api/v1/resource-allocations",
                "health": "/api/v1/health",
                "ml_predict": "/api/v1/ml/predict",
                "ml_model_info": "/api/v1/ml/model-info",
                "docs": "/docs"
            }
        }
else:
    @app.get("/")
    async def root():
        return {
            "message": "Healthcare Resource Management System API",
            "version": "1.0.0",
            "status": "operational"
        }
