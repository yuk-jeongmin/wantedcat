from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base

class Event(Base): #Pydantic 모델 구
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255))
    event_time = Column(DateTime)
    duration_seconds = Column(Float)
    weight_info = Column(String(255))
    video_url = Column(String(255))
