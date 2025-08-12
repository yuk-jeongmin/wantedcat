from pydantic import BaseModel
from datetime import datetime

class SasRequest(BaseModel):
    fileName: str
    containerName: str

class SasResponse(BaseModel):
    sasUrl: str
    blobUrl: str

class EventCreate(BaseModel):
    user_id: str
    event_time: datetime
    duration_seconds: float
    weight_info: str
    video_url: str

class Event(EventCreate):
    id: int
    class Config:
        orm_mode = True