from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# docker-compose.yml에 설정된 사용자, 비밀번호, 서비스 이름(호스트), DB이름을 사용
# 환경 변수에서 DB 정보를 가져오도록 수정하는 것이 더 안전합니다.
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "your_password") # .env 파일에 실제 비밀번호를 저장하세요.
DB_HOST = os.getenv("DB_HOST", "db") # Docker 서비스 이름
DB_NAME = os.getenv("DB_NAME", "my_app_db")

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """FastAPI 의존성을 통해 DB 세션을 관리하는 함수"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()