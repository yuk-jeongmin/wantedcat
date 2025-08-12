from sqlalchemy.orm import Session
import models
import schemas

def create_event(db: Session, event: schemas.EventCreate):
    # Pydantic 모델을 SQLAlchemy 모델 인스턴스로 변환
    db_event = models.Event(**event.dict())
    
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    return db_event

def get_events_by_user(db: Session, user_id: str):
    # user_id 로 필터링해서 리스트를 반환
    return db.query(models.Event).filter(models.Event.user_id == user_id).all()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()
