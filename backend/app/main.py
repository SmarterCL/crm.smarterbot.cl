from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.routers import auth
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("smarter-conductor")

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SmarterOS Event Orchestrator"
)

# CORS (Configuration allowing specific origins is safer for prod)
# But for dev/demo we allow all.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to list of allowed domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": settings.VERSION}

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up Smarter Conductor...")
