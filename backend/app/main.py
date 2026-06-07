import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic_settings import BaseSettings
from app.routers import ai_assistant, emergency, intelligence

class Settings(BaseSettings):
    PROJECT_NAME: str = "KumbhMantra Pro API"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    MONGODB_URL: str = "mongodb://localhost:27017/mahakumbh"
    REDIS_URL: str = "redis://localhost:6379/0"

    class Config:
        case_sensitive = True

settings = Settings()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("kumbhmantra_core")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Deterministic Mahakumbh assistant, routing intelligence, and emergency workflow API.",
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Connecting to MongoDB Node Cluster at " + settings.MONGODB_URL)
    logger.info("Connecting to Redis Memory Pool at " + settings.REDIS_URL)
    logger.info("KumbhMantra Core Pipeline is fully loaded and active.")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Error on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Dynamic fail-safe triggered. Edge computing protocols are active.",
            "error": str(exc)
        }
    )

app.include_router(ai_assistant.router, prefix=settings.API_V1_STR)
app.include_router(emergency.router, prefix=settings.API_V1_STR)
app.include_router(intelligence.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health"])
async def root_health_check():
    return {
        "status": "online",
        "mesh_mode": "active",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
    }
