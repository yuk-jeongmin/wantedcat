import os
import mysql.connector
from flask import Flask, request, jsonify

# --- Flask App 생성 ---
app = Flask(__name__)

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get('DB_HOST'),
            user=os.environ.get('DB_USER'),
            password=os.environ.get('DB_PASSWORD'),
            database=os.environ.get('DB_NAME')
        )
        return conn
    except mysql.connector.Error as e:
        print(f"DB 연결 오류: {e}")
        return None

def create_table_if_not_exists():
    conn = get_db_connection()
    if not conn:
        print("테이블 생성 실패: DB에 연결할 수 없습니다.")
        return

    try:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mac VARCHAR(255) NOT NULL,
                event_time DATETIME NOT NULL,
                duration_seconds INT,
                weight_change FLOAT
            )
        """)
        print("'events' 테이블이 준비되었습니다.")
    except mysql.connector.Error as e:
        print(f"테이블 생성 오류: {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/', methods=['GET'])
def get_events():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, mac, event_time, duration_seconds, weight_change FROM events ORDER BY id DESC")
        events = cursor.fetchall()
        return jsonify(events)
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# --- API 엔드포인트: 데이터 입력 (POST) ---
@app.route('/data', methods=['POST'])
def add_event():
    # 요청 본문이 JSON인지 확인
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    data = request.get_json()
    
    # 필수 필드 확인
    required_fields = ['mac', 'event_time', 'duration_seconds', 'weight_change']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing data in JSON body"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        sql = """
            INSERT INTO events (mac, event_time, duration_seconds, weight_change) 
            VALUES (%s, %s, %s, %s)
        """
        val = (data['mac'], data['event_time'], data['duration_seconds'], data['weight_change'])
        cursor.execute(sql, val)
        conn.commit()
        
        # 입력된 데이터의 id와 함께 성공 메시지 반환
        return jsonify({"message": "Event added successfully", "id": cursor.lastrowid}), 201

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# --- 메인 실행 부분 ---
if __name__ == '__main__':
    # 서버 시작 전 테이블이 존재하는지 확인하고 없으면 생성
    create_table_if_not_exists()
    
    # Flask 웹 서버 실행
    app.run(host='0.0.0.0', port=5000)