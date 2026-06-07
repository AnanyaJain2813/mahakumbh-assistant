import logging
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

logger = logging.getLogger("kumbhmantra_ai_assistant")

router = APIRouter(prefix="/assistant", tags=["Assistant"])


class ChatRequest(BaseModel):
    user_id: str = Field(..., examples=["PILGRIM_CORE_NODE"])
    message: str = Field(..., min_length=1, examples=["Where is the nearest medical camp?"])
    language: str = Field(default="hi", examples=["hi"])
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    audio_requested: bool = False


class ActionCard(BaseModel):
    title: str
    value: str
    severity: str = "info"


class ChatResponse(BaseModel):
    success: bool
    detected_language: str
    response_text: str
    next_action_directive: str
    confidence: float
    cards: list[ActionCard]


def _language_prefix(language: str) -> str:
    if language == "en":
        return "KumbhMantra:"
    if language == "ta":
        return "கும்பமந்திரா:"
    if language == "te":
        return "కుంభమంత్ర:"
    return "कुंभमंत्र:"


@router.post("/chat", response_model=ChatResponse)
async def process_assistant_chat(payload: ChatRequest):
    query_text = payload.message.strip()
    if not query_text:
        raise HTTPException(status_code=400, detail="Query text can not be blank.")

    lower_query = query_text.lower()
    directive = "DISPLAY_INFO"
    cards: list[ActionCard] = []
    prefix = _language_prefix(payload.language)

    if any(token in lower_query for token in ["snan", "date", "तारीख", "स्नान", "calendar"]):
        resolved_response = (
            f"{prefix} Main bathing windows: Makar Sankranti on Jan 14, Mauni Amavasya peak on "
            "Jan 29, Basant Panchami on Feb 03, Maghi Purnima on Feb 12. Arrive early, avoid "
            "reverse walking lanes, and follow sector announcements."
        )
        directive = "SHOW_TIMELINE"
        cards = [
            ActionCard(title="Peak window", value="Mauni Amavasya, Jan 29", severity="high"),
            ActionCard(title="Best movement", value="Sector-wise staggered entry"),
        ]
    elif any(token in lower_query for token in ["bridge", "पुल", "पांटून", "route", "मार्ग"]):
        resolved_response = (
            f"{prefix} Recommended flow: enter from Sector 4, move toward Sangam through Pontoon "
            "Bridge 12, and return through Bridge 18. This separates inbound and outbound crowds."
        )
        directive = "HIGHLIGHT_BRIDGES"
        cards = [
            ActionCard(title="Inbound", value="Pontoon Bridge 12"),
            ActionCard(title="Outbound", value="Pontoon Bridge 18"),
        ]
    elif any(token in lower_query for token in ["lost", "खोया", "found", "missing"]):
        resolved_response = (
            f"{prefix} Go to the Central Lost and Found desk near Sector 2. Keep a photo, age, "
            "clothing description, and last-seen ghat ready. SOS can escalate to police support."
        )
        directive = "TRIGGER_LOST_FOUND"
        cards = [
            ActionCard(title="Desk", value="Central Lost and Found, Sector 2"),
            ActionCard(title="Escalation", value="Police response post"),
        ]
    elif any(token in lower_query for token in ["medical", "doctor", "hospital", "मेडिकल", "चिकित्सा"]):
        resolved_response = (
            f"{prefix} Nearest medical support is Sector 4 Medical Camp, about 140 meters from "
            "the demo position. For chest pain, fainting, or separation in dense crowds, trigger SOS."
        )
        directive = "SHOW_MEDICAL_NODE"
        cards = [
            ActionCard(title="Nearest camp", value="Sector 4 Medical Camp", severity="medium"),
            ActionCard(title="Response mode", value="Rapid medical triage"),
        ]
    elif any(token in lower_query for token in ["sos", "emergency", "help", "आपात"]):
        resolved_response = (
            f"{prefix} Emergency mode can dispatch your location to the response grid. Stay visible, "
            "avoid moving into opposing flow, and keep your phone reachable."
        )
        directive = "ARM_SOS"
        cards = [ActionCard(title="Emergency", value="One-tap SOS available", severity="critical")]
    else:
        resolved_response = (
            f"{prefix} I logged your request: '{query_text}'. Current demo context places you near "
            "Sector 4 with police, medical, and route support available in the local cache."
        )
        directive = "DEFAULT_DISPLAY"
        cards = [
            ActionCard(title="Sector", value="4"),
            ActionCard(title="Fallback", value="Offline cache ready"),
        ]

    logger.info("assistant directive=%s user=%s", directive, payload.user_id)
    return ChatResponse(
        success=True,
        detected_language=payload.language,
        response_text=resolved_response,
        next_action_directive=directive,
        confidence=0.91,
        cards=cards,
    )
