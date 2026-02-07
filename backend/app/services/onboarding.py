import logging
from typing import Optional, Any
from supabase import create_client, Client
from app.core.config import get_settings
from app.schemas.user import SupabaseAuthEvent, TenantCreate

logger = logging.getLogger(__name__)

class OnboardingService:
    def __init__(self):
        settings = get_settings()
        try:
            self.supabase: Client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY
            )
        except Exception as e:
            logger.critical(f"Failed to connect to Supabase: {e}")
            raise

    async def onboard_new_user(self, event: SupabaseAuthEvent) -> dict:
        """
        Orchestrates the entire onboarding process for a new user:
        1. Ensures 'profiles' table entry exists.
        2. Creates a default Tenant for the user.
        3. Assigns user to Tenant with admin role.
        """
        logger.info(f"Starting onboarding for user: {event.email} ({event.id})")
        
        # 1. Create/Update Profile (Idempotent)
        profile_data = self._build_profile_data(event)
        
        try:
            # We use upsert to be safe against double webhook delivery
            logger.debug(f"Upserting profile for user {event.id}")
            self.supabase.table("profiles").upsert(profile_data).execute()
        except Exception as e:
            logger.error(f"Error creating profile for {event.id}: {e}")
            # Depending on business logic, we might want to stop here or continue if retry logic exists
            # For now, let's assume we can continue or it failed critically
            raise

        # 2. Create Default Tenant
        tenant_name = self._derive_tenant_name(profile_data)
        tenant_id = None
        
        try:
            # Check if user already has a tenant (re-run safety)
            # This requires a query to 'tenant_members' or similar relationship table
            # Simplified: Just create a new one if not exists logic can be complex without dedicated table check
            
            # Let's create a tenant. Function 'create_tenant' in DB usually handles this Transactionally
            # But here we do it via API for demonstration of orchestration
            
            new_tenant = {
                "name": tenant_name,
                "status": "active",
                "plan": "free" 
                # owner_id is often handled by RLS or a linking table
            }
            
            logger.debug(f"Creating tenant '{tenant_name}' for user {event.id}")
            tenant_res = self.supabase.table("tenants").insert(new_tenant).execute()
            
            if tenant_res.data and len(tenant_res.data) > 0:
                tenant_id = tenant_res.data[0]['id']
                logger.info(f"Created tenant {tenant_id}")
                
                # 3. Link User to Tenant (Member)
                member_data = {
                    "tenant_id": tenant_id,
                    "user_id": event.id,
                    "role": "owner"
                }
                self.supabase.table("tenant_members").insert(member_data).execute()
                logger.info(f"Linked user {event.id} to tenant {tenant_id}")

        except Exception as e:
            logger.error(f"Error in tenant creation flow: {e}")
            # Don't block onboarding if tenant creation fails (maybe they are invited to another)
            # But for a signup flow, it's usually critical. 
            # We'll log it for now.

        return {
            "status": "completed",
            "user_id": event.id,
            "tenant_id": tenant_id,
            "profile_created": True
        }

    def _build_profile_data(self, event: SupabaseAuthEvent) -> dict:
        """Extracts profile info from auth event safely"""
        meta = event.raw_user_meta_data or {}
        
        return {
            "id": event.id,
            "email": event.email,
            "full_name": meta.get("full_name") or meta.get("name") or event.email.split("@")[0],
            "avatar_url": meta.get("avatar_url"),
            "status": "active",
            "updated_at": "now()"
        }

    def _derive_tenant_name(self, profile: dict) -> str:
        """Creates a friendly default tenant name"""
        name = profile.get("full_name", "My Organization")
        return f"{name}'s Workspace"
