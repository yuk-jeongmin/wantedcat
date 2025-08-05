from pydantic import BaseModel
from datetime import datetime

class SasRequest(BaseModel):
    fileName: str
    containerName: str

class SasResponse(BaseModel):
    sasUrl: str
    blobUrl: str

# EventData를 EventCreate로 이름을 변경하고 user_id 추가
class EventCreate(BaseModel):
    user_id: str
    event_time: datetime
    duration_seconds: float
    weight_info: str
    video_url: str

# DB에서 읽어올 때 사용할 모델 (선택 사항이지만 좋은 습관)
class Event(EventCreate):
    id: int

    class Config:
        orm_mode = True # SQLAlchemy 모델과 호환되도록 설정