from fastapi import APIRouter, HTTPException, Depends, Header
from app.schemas.user import SupabaseAuthEvent
from app.services.onboarding import OnboardingService
from app.core.config import get_settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks/auth", tags=["Auth"])

SERVICE = OnboardingService()

def verify_webhook_secret(
    x_webhook_secret: str = Header(None)
):
    settings = get_settings()
    expected = settings.WEBHOOK_SECRET
    
    if expected and x_webhook_secret != expected:
        logger.warning(f"Invalid webhook signature attempt: {x_webhook_secret}")
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    
    return True

@router.post("/signup", dependencies=[Depends(verify_webhook_secret)])
async def handle_user_signup(event: SupabaseAuthEvent):
    """
    Supabase Auth Trigger: New User Signup
    """
    logger.info(f"Received signup event for user: {event.email}")
    
    try:
        result = await SERVICE.onboard_new_user(event)
        return {"status": "ok", "details": result}
    except Exception as e:
        logger.error(f"Error processing signup webhook: {e}", exc_info=True)
        # We generally return 200 to Supabase to prevent infinite retry loops 
        # unless it's a truly ephemeral error.
        # But for development/debugging, 500 might be better. 
        # Let's return 200 with error details.
        return {"status": "error", "message": str(e)}
