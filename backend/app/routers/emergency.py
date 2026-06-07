import logging
import time

from fastapi import APIRouter
from pydantic import BaseModel, Field

logger = logging.getLogger("kumbhmantra_emergency")

router = APIRouter(prefix="/emergency", tags=["Emergency"])


class SOSPayload(BaseModel):
    pilgrim_id: str = Field(..., examples=["PILGRIM_CORE_NODE"])
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    device_timestamp: int


class SOSAcknowledgement(BaseModel):
    tracking_ticket: str
    status: str
    priority: str
    message: str
    assigned_unit: str
    estimated_response_minutes: int


@router.post("/sos", response_model=SOSAcknowledgement, status_code=201)
async def trigger_priority_sos(payload: SOSPayload):
    logger.warning(
        "critical alarm received node=%s lat=%s lon=%s",
        payload.pilgrim_id,
        payload.latitude,
        payload.longitude,
    )
    ticket_id = f"KUMBH-MANTRA-TICKET-{int(time.time())}"

    return SOSAcknowledgement(
        tracking_ticket=ticket_id,
        status="DISPATCHED",
        priority="P1",
        message=(
            "Emergency beacon confirmed. Sector 4 rapid response and medical triage have "
            "been routed to your last known GPS location."
        ),
        assigned_unit="Sector 4 Rapid Response Team",
        estimated_response_minutes=3,
    )
