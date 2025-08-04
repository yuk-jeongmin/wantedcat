FROM python:3.11

# 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# requirements.txt 파일을 먼저 복사하여 라이브러리를 설치합니다.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 현재 폴더의 모든 파일을 컨테이너의 /app 폴더로 복사합니다.
COPY . .

# 컨테이너가 시작될 때 main_server.py (제공해주신 코드)를 실행합니다.
CMD ["python", "-u", "homecamWeb.py"]