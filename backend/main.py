from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from backend.config import settings
from backend.routers import health_router
from backend.models import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting application...")
    init_db()
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

app.include_router(health_router.router, prefix="/api/v1", tags=["health"])


@app.get("/")
async def root():
    return {
        "message": "Healthcare Resource Management System API",
        "version": "1.0.0",
        "status": "operational"
    }
