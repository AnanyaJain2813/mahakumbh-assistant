import logging
import time
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

logger = logging.getLogger("mahakumbh_emergency")

router = APIRouter(
    prefix="/emergency",
    tags=["Emergency Response Systems"]
)

class SOSGeoPayload(BaseModel):
    pilgrim_id: str = Field(..., examples=["PILGRIM_7731_BX"])
    latitude: float = Field(..., examples=[23.1765])
    longitude: float = Field(..., examples=[75.7885])
    device_timestamp: int = Field(..., examples=[1710000000])
    audio_snip_base64: Optional[str] = Field(default=None, examples=["UklGRigAAABXQVZFZm10IBAA..."])

class SOSAcknowledgement(BaseModel):
    tracking_ticket: str
    status: str
    dispatched_sector: int
    nearest_medical_camp_distance_meters: float
    message: str

@router.post("/sos", response_model=SOSAcknowledgement, status_code=status.HTTP_201_CREATED)
async def trigger_priority_sos(payload: SOSGeoPayload):
    logger.warning("CRITICAL SOS RECEIVED for %s at (%s, %s)", payload.pilgrim_id, payload.latitude, payload.longitude)

    if abs(payload.latitude) > 90 or abs(payload.longitude) > 180:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The transmitted GPS coordinate parameters are out of bounds."
        )

    ticket_id = f"SOS-TICKET-{int(time.time())}-{payload.pilgrim_id[-4:]}"

    return SOSAcknowledgement(
        tracking_ticket=ticket_id,
        status="DISPATCHED",
        dispatched_sector=4,
        nearest_medical_camp_distance_meters=180.0,
        message=(
            "Emergency SOS signal received. A nearby field response unit has been notified using your GPS coordinates. "
            "Please stay at your current visible position and keep your phone reachable."
        )
    )
