from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class SasRequest(BaseModel):
    fileName: str
    containerName: str

class SasResponse(BaseModel):
    sasUrl: str
    blobUrl: str

class EventRequest(BaseModel):
    user_id: str
    event_time: datetime
    duration_seconds: float
    weight_info: str
    origin_video_url: str
    event_type: str
    bowl_where_cell: str

class EventCreate(BaseModel):
    user_id: str
    event_time: datetime
    duration_seconds: float
    weight_info: str
    origin_video_url: str
    bbox_video_url: str
    event_type: str
    cat_name: str

class Event(EventCreate):
    id: int
    class Config:
        orm_mode = True

# --- Aimodel 관련 스키마 ---
class AimodelCreate(BaseModel):
    user_id : str
    model_status : str
    model_name : str
    val_precision : float
    val_recall : float
    val_map50 : float

class AImodel(AimodelCreate):
    id: int

    class Config:
        orm_mode = True

class ModelRequest(BaseModel):
    user_id: str