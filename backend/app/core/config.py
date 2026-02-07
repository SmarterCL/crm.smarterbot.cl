from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    # App General
    PROJECT_NAME: str = "SmarterOS Conductor"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development" # development, production, test
    
    # Supabase (Required)
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    
    # Security
    WEBHOOK_SECRET: Optional[str] = None # Authenticate incomings from Supabase
    
    # Chatwoot (Optional for now)
    CHATWOOT_API_URL: Optional[str] = None
    CHATWOOT_ACCESS_TOKEN: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore" # Ignore extra env vars (like Next.js ones)
    )

@lru_cache
def get_settings():
    return Settings()
