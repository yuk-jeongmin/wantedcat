import os
from datetime import datetime, timedelta
import crud
import models
import schemas
from database import SessionLocal, engine, get_db

from azure.storage.blob import (BlobSasPermissions, BlobServiceClient,
                                  generate_blob_sas)
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from sqlalchemy.orm import Session

# --- 초기 설정 ---
load_dotenv()

# (앱 최초 실행 시) SQLAlchemy 모델을 기반으로 DB 테이블 생성 (이미 있다면 아무 작업 안 함)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

AZURE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
API_KEY = os.getenv("API_KEY")
api_key_header = APIKeyHeader(name="X-API-Key")
blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)

# --- API 키 인증 함수 ---
async def get_api_key(api_key_from_header: str = Security(api_key_header)):
    if api_key_from_header == API_KEY:
        return api_key_from_header
    else:
        raise HTTPException(status_code=401, detail="Invalid or missing API Key")

# --- API 엔드포인트 정의 ---
@app.post("/api/sas/generate", response_model=schemas.SasResponse, dependencies=[Depends(get_api_key)])
async def generate_sas_url(request: schemas.SasRequest):
    blob_name = request.fileName
    container_name = request.containerName
    
    print(f"SAS 토큰 생성 요청 수신: 컨테이너='{container_name}', 파일명='{blob_name}'")

    sas_token = generate_blob_sas(
        account_name=blob_service_client.account_name,
        container_name=container_name,
        blob_name=blob_name,
        account_key=blob_service_client.credential.account_key,
        permission=BlobSasPermissions(write=True),
        expiry=datetime.utcnow() + timedelta(minutes=10)
    )

    sas_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{container_name}/{blob_name}?{sas_token}"
    blob_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{container_name}/{blob_name}"

    return schemas.SasResponse(sasUrl=sas_url, blobUrl=blob_url)

@app.post("/api/events", dependencies=[Depends(get_api_key)])
async def receive_event_data(
    event: schemas.EventCreate, # 수정된 Pydantic 모델 사용
    db: Session = Depends(get_db) # DB 세션 주입
):
    print("Received event data:", event.dict())

    # CRUD 함수를 호출하여 DB에 이벤트 저장
    created_event = crud.create_event(db=db, event=event)

    print("Successfully saved to DB:", created_event.__dict__)
    
    return {"status": "success", "message": "Event data received and saved."}

@app.get("/api/events/{user_id}", dependencies=[Depends(get_api_key)])
def list_events_by_user(user_id: str, db: Session = Depends(get_db)):
    return crud.get_events_by_user(db, user_id)
