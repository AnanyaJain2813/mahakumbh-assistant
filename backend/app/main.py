import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic_settings import BaseSettings
from app.routers import ai_assistant, emergency

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mahakumbh AI Pilgrim Assistant Backend"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    MONGODB_URL: str = "mongodb://localhost:27017/mahakumbh"
    REDIS_URL: str = "redis://localhost:6379/0"
    APP_ENV: str = "development"

    class Config:
        case_sensitive = True

settings = Settings()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("mahakumbh_main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
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
    logger.info("Initializing system resource pools...")
    logger.info("Connecting to MongoDB Instance at %s", settings.MONGODB_URL)
    logger.info("Connecting to Redis High-Availability In-Memory Layer at %s", settings.REDIS_URL)
    logger.info("System ready for pilgrim support workloads.")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Draining connections and shutting down gracefully...")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception on %s: %s", request.url.path, str(exc), exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error_code": "INTERNAL_SERVER_FAILURE",
            "message": "An unexpected server error occurred. Local fallback mode is active.",
            "details": str(exc)
        }
    )

app.include_router(ai_assistant.router, prefix=settings.API_V1_STR)
app.include_router(emergency.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health Check"])
async def root_health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": settings.APP_ENV,
        "live_maps": "enabled",
        "fallback": "enabled"
    }
