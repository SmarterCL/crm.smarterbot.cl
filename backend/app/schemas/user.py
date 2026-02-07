from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Any, Dict, List
from datetime import datetime

# --- Incoming Payloads (Supabase Webhooks) ---

class UserMetadata(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    sub: Optional[str] = None

class SupabaseAuthEvent(BaseModel):
    id: str  # The user UUID
    email: EmailStr
    raw_user_meta_data: Optional[Dict[str, Any]] = None # flexible format
    phone: Optional[str] = None
    created_at: str
    role: Optional[str] = "authenticated"

# --- Internal Business Objects ---

class TenantCreate(BaseModel):
    name: str = Field(..., min_length=3, description="Tenant name")
    owner_id: str
    plan: Optional[str] = "free"

class TenantResponse(BaseModel):
    id: str
    name: str
    status: str
    created_at: datetime
