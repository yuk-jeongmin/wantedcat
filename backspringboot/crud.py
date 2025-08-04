from sqlalchemy.orm import Session
from . import models, schemas

def create_event(db: Session, event: schemas.EventCreate):
    """DB에 새로운 이벤트 데이터를 생성합니다."""
    # Pydantic 모델을 SQLAlchemy 모델 인스턴스로 변환
    db_event = models.Event(**event.dict())
    
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    return db_event