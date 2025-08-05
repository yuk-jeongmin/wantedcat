import os
from datetime import datetime, timedelta

from azure.storage.blob import (BlobSasPermissions, BlobServiceClient,
                                generate_blob_sas)
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel

# --- 초기 설정 ---
# .env 파일에서 환경 변수 불러오기
load_dotenv()

# FastAPI 앱 생성
app = FastAPI()

# 환경 변수에서 설정값 읽기
AZURE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
API_KEY = os.getenv("API_KEY")

# API Key 헤더 설정 (클라이언트는 'X-API-Key' 라는 이름의 헤더에 API 키를 담아 보내야 함)
api_key_header = APIKeyHeader(name="X-API-Key")

# Blob 서비스 클라이언트 생성
blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)

# --- 데이터 모델 정의 (Pydantic) ---
# 클라이언트가 SAS를 요청할 때 보낼 데이터의 형식
class SasRequest(BaseModel):
    fileName: str
    containerName: str

# 서버가 클라이언트에게 SAS 정보를 응답할 때의 형식
class SasResponse(BaseModel):
    sasUrl: str
    blobUrl: str

# 클라이언트가 이벤트 데이터를 보낼 때의 형식
class EventData(BaseModel):
    event_time: datetime
    duration_seconds: float
    weight_info: str
    video_url: str


# --- API 키 인증 함수 ---
async def get_api_key(api_key_from_header: str = Security(api_key_header)):
    """요청 헤더의 API 키가 서버의 키와 일치하는지 확인합니다."""
    if api_key_from_header == API_KEY:
        return api_key_from_header
    else:
        # 키가 일치하지 않으면 401 Unauthorized 에러 발생
        raise HTTPException(status_code=401, detail="Invalid or missing API Key")


# --- API 엔드포인트 정의 ---
@app.post("/api/sas/generate", response_model=SasResponse, dependencies=[Depends(get_api_key)])
async def generate_sas_url(request: SasRequest):
    
    blob_name = request.fileName
    container_name = request.containerName
    
    print(f"SAS 토큰 생성 요청 수신: 컨테이너='{container_name}', 파일명='{blob_name}'")

    # SAS 토큰 생성
    sas_token = generate_blob_sas(
        account_name=blob_service_client.account_name,
        container_name=container_name,
        blob_name=blob_name,
        account_key=blob_service_client.credential.account_key,
        permission=BlobSasPermissions(write=True),
        expiry=datetime.utcnow() + timedelta(minutes=10) # 10분 
    )

    sas_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{container_name}/{blob_name}?{sas_token}"
    blob_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{container_name}/{blob_name}"

    return SasResponse(sasUrl=sas_url, blobUrl=blob_url)


@app.post("/api/events", dependencies=[Depends(get_api_key)])
async def receive_event_data(event: EventData):
    # 받은 데이터를 예쁘게 출력 (dict()로 변환 후)
    print(event.dict())

    # --- 여기에 데이터베이스 저장 로직을 구현합니다. ---
    # 예:
    # db_session = SessionLocal()
    # new_event = EventModel(**event.dict())
    # db_session.add(new_event)
    # db_session.commit()
    # db_session.close()
    # -----------------------------------------------

    return {"status": "success", "message": "Event data received"}