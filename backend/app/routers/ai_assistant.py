import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

logger = logging.getLogger("mahakumbh_ai_assistant")

router = APIRouter(
    prefix="/assistant",
    tags=["AI Pilgrim Assistant Engine"]
)

class ChatRequest(BaseModel):
    user_id: str = Field(..., examples=["PILGRIM_9982_AZ"])
    message: str = Field(..., examples=["How do I reach Ram Ghat with less crowd?"])
    language: str = Field(default="hi", examples=["hi"])
    latitude: Optional[float] = Field(default=23.1765, examples=[23.1765])
    longitude: Optional[float] = Field(default=75.7885, examples=[75.7885])
    audio_requested: bool = Field(default=False, examples=[True])

class ChatResponse(BaseModel):
    success: bool
    detected_language: str
    translated_text: str
    response_text: str
    audio_payload_base64: Optional[str] = None
    next_action_directive: Optional[str] = None

MOCK_TTS_AUDIO_BASE64 = "UklGRigAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQQAAAAAAA=="

UJJAIN_CONTEXT = {
    "main_ghats": ["Ram Ghat", "Dutt Akhada Ghat", "Triveni Ghat", "Narsingh Ghat"],
    "core_landmarks": ["Mahakaleshwar Temple", "Harsiddhi Temple", "Shipra River Front"],
    "event": "Ujjain Simhastha / Kumbh cycle",
    "next_major_cycle": "2028"
}

@router.get("/knowledge")
async def knowledge():
    return {
        "success": True,
        "city": "Ujjain",
        "event": UJJAIN_CONTEXT["event"],
        "next_major_cycle": UJJAIN_CONTEXT["next_major_cycle"],
        "ghats": UJJAIN_CONTEXT["main_ghats"],
        "landmarks": UJJAIN_CONTEXT["core_landmarks"]
    }

@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def process_assistant_chat(payload: ChatRequest):
    logger.info("Incoming query from pilgrim %s in language code '%s'", payload.user_id, payload.language)

    query_text = payload.message.strip()
    if not query_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The incoming chat query string cannot be empty."
        )

    detected_lang = payload.language
    directive = "DISPLAY_GENERAL_INFO"
    lower_query = query_text.lower()

    if any(term in lower_query for term in ["ram ghat", "ghat", "sangam", "route", "map", "मार्ग", "घाट"]):
        resolved_response = (
            "For live navigation, open the map tab and allow location access. The app highlights Ujjain ghats like Ram Ghat, Dutt Akhada Ghat, "
            "and Mahakaleshwar Temple on an interactive map. During heavy crowd movement, prefer wider approach roads and follow police barricade signage."
        )
        directive = "OPEN_LIVE_MAP"
    elif any(term in lower_query for term in ["date", "snan", "shahi", "simhastha", "kumbh", "तारीख", "शाही"]):
        resolved_response = (
            "Ujjain Simhastha is the Kumbh gathering held every 12 years on the banks of the Shipra River. The next major Simhastha cycle is expected in 2028, "
            "so use the schedule section for key pilgrimage readiness information and local planning guidance."
        )
        directive = "SHOW_SCHEDULE"
    elif any(term in lower_query for term in ["lost", "help", "emergency", "sos", "खो", "मदद"]):
        resolved_response = (
            "Use the red SOS button immediately if you need urgent help. Keep your phone location on, remain at a visible point, and move only if instructed by officials or emergency teams."
        )
        directive = "TRIGGER_EMERGENCY_PROTOCOL"
    else:
        resolved_response = (
            f"Namaste. I understood your message: '{query_text}'. I can help with live map guidance around Ujjain, important ghat locations, Simhastha context, "
            f"and emergency support options. Choose the map tab for real-time location examples and landmarks."
        )

    audio_data = MOCK_TTS_AUDIO_BASE64 if payload.audio_requested else None

    return ChatResponse(
        success=True,
        detected_language=detected_lang,
        translated_text=query_text,
        response_text=resolved_response,
        audio_payload_base64=audio_data,
        next_action_directive=directive
    )
