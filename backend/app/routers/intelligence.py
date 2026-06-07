from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/intelligence", tags=["Intelligence"])


class TelemetrySnapshot(BaseModel):
    crowd_index: str
    active_alerts: int
    medical_nodes_online: int
    bridge_recommendation: str
    offline_cache_status: str


@router.get("/snapshot", response_model=TelemetrySnapshot)
async def get_intelligence_snapshot():
    return TelemetrySnapshot(
        crowd_index="normal",
        active_alerts=0,
        medical_nodes_online=22,
        bridge_recommendation="Use Pontoon Bridge 12 inbound and Bridge 18 outbound",
        offline_cache_status="ready",
    )
