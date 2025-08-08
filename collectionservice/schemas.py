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
        orm_mode = True # SQLAlchemy 모델과 호환되도록 설정
        
# --- User 관련 스키마 ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    stream_key: Optional[str] = None

    class Config:
        orm_mode = True

# --- 스트리밍 서버 인증용 스키마 ---
class StreamAuthRequest(BaseModel):
    stream_key: str

# --- 재생 URL 응답용 스키마 ---
class PlaybackResponse(BaseModel):
    playback_url: str