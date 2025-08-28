import time
import requests
import json
import uuid
import subprocess
import os
import sys
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
KST = ZoneInfo("Asia/Seoul")
import logging
from pathlib import Path
import threading, requests, json, time
# 기본 logging 설정 (커스텀 설정 제거)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Configuration ---

import sys
# --- HX711 direct adapter (sensor_test.py 방식) ---
try:
    import RPi.GPIO as GPIO
    from hx711 import HX711
except Exception:
    GPIO = None
    HX711 = None

class HX711Pair:
    """
    sensor.latest() -> (v1, v2)
    sensor.start(), sensor.stop() 인터페이스를 oper_fi1과 동일하게 맞춘 어댑터
    """
    def __init__(self, dout1_pin: int, sck1_pin: int, dout2_pin: int, sck2_pin: int,
                 ref1: float = 435.0, ref2: float = 435.0, avg_n: int = 5):
        if HX711 is None:
            raise ImportError("hx711 라이브러리를 찾을 수 없습니다.")
        self.avg_n = avg_n
        # sensor_test.py와 동일한 핀 매핑: HX711(dout, sck)
        self.hx1 = HX711(dout1_pin, sck1_pin)
        self.hx2 = HX711(dout2_pin, sck2_pin)
        self.ref1 = ref1
        self.ref2 = ref2
        self._started = False

    def start(self):
        # sensor_test.py와 동일한 초기화/영점절차
        # 참고: set_reference_unit -> reset -> tare 순으로 맞춤
        self.hx1.set_reference_unit(self.ref1)
        self.hx1.reset()
        self.hx1.tare()

        self.hx2.set_reference_unit(self.ref2)
        self.hx2.reset()
        self.hx2.tare()

        self._started = True
        return self

    def latest(self):
        if not self._started:
            raise RuntimeError("HX711Pair.start() 이후에 호출해야 합니다.")
        # sensor_test.py처럼 평균 n회 측정
        v1 = float(self.hx1.get_weight(self.avg_n))
        v2 = float(self.hx2.get_weight(self.avg_n))
        return (v1, v2)

    def stop(self):
        # hx711 라이브러리는 내부에서 GPIO 사용 → 정리
        try:
            GPIO.cleanup()
        except Exception:
            pass

if len(sys.argv) < 4:
    print("usage: oper_fi1.py <key> <user_email> <homecamIp>")
    sys.exit(1)

streamingkey = sys.argv[1]
user_email = sys.argv[2]
homecam_ip = sys.argv[3]

print("STREAMKEY=", streamingkey)
print("USER_EMAIL=", user_email)
print("HOMECAM_IP=", homecam_ip)


API_KEY = "Yo"
BACKEND_URL = "https://app.4.230.152.143.nip.io/collection"
STREAMING_SERVER_URL= "rtmp://20.249.147.48:1935/live/"+streamingkey#"067dee4b-2c0d-4975-b9fa-e247bfa611c5"

EVENT_URL = BACKEND_URL
CONTAINER_NAME = "video"
USER_ID = user_email#"aivle0514@aivle.kt.co.kr"
HEADERS = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}
RTSP_URL = f"rtsp://aivle0514:123456789a@{homecam_ip}/stream1"#172.30.1.79:554/stream1"

BASE_DIR = Path(__file__).resolve().parent
HLS_DIR = str(BASE_DIR / "static")  # 절대경로
HLS_PLAYLIST = os.path.join(HLS_DIR, "stream.m3u8")

os.makedirs(HLS_DIR, exist_ok=True)
if not os.access(HLS_DIR, os.W_OK):
    raise PermissionError(f"[HLS] 디렉터리에 쓰기 권한이 없습니다: {HLS_DIR}")
MAX_EVENT_SECONDS = 60  # 1분 이상 지속되면 강제 종료
HEARTBEAT_SEC = 10
SEGMENT_DURATION = 2
MAX_HLS_FILES = 30
current_ffmpeg_process = None
STABILITY_THRESHOLD_SECONDS = 2

# 이벤트 영상의 앞, 뒤에 추가할 여유 시간 (초)
PRE_EVENT_BUFFER_SECONDS = 2
POST_EVENT_BUFFER_SECONDS = 2

# --- Functions ---

_session = requests.Session()

# def _upload_event_data_impl(event_data: dict):
#     try:
#         r = _session.post(
#             f"{EVENT_URL}/api/events/bbox/video",
#             headers=HEADERS,
#             data=json.dumps(event_data),
#             timeout=(10, 10),
#         )
#         r.raise_for_status()
#         try:
#             print("Event data successfully sent:", r.json())
#         except Exception:
#             print("Event data successfully sent (no JSON)")
#     except requests.exceptions.RequestException as e:
#         # 실패해도 메인 루프는 영향 없음
#         print(f" Failed to send event data: {e}")
#         if getattr(e, "response", None) is not None:
#             print(" Server's detailed error response:")
#             try:
#                 print(json.dumps(e.response.json(), indent=2))
#             except json.JSONDecodeError:
#                 print(e.response.text)
def _upload_event_data_impl(event_data: dict):
    try:
        r = _session.post(
            f"{EVENT_URL}/api/events/bbox/video",
            headers=HEADERS,
            data=json.dumps(event_data),
            timeout=(10, 10),
        )
        r.raise_for_status()
        # 성공 로그도 억제하려면 아래 두 줄 삭제
        try: print("Event data successfully sent:", r.json())
        except Exception: print("Event data successfully sent (no JSON)")
    except requests.exceptions.RequestException:
        # 완전 무시
        return



def upload_event_data_async(event_data: dict):
    # 즉시 반환: 메인(센서) 루프는 한 줄도 대기하지 않음
    t = threading.Thread(target=_upload_event_data_impl, args=(event_data,), daemon=True)
    t.start()


def start_hls_streaming():
    """RTSP 입력 → RTMP 송출 + HLS 동시 생성 (tee muxer)"""
    global current_ffmpeg_process

    rtmp_url = globals().get("RTMP_OUTPUT_URL", STREAMING_SERVER_URL)
    hls_dir = HLS_DIR.rstrip("/\\")
    hls_playlist_path = os.path.join(hls_dir, "playlist.m3u8")

    # HLS 디렉터리 준비 + 기존 파일 정리
    os.makedirs(hls_dir, exist_ok=True)
    for f in os.listdir(hls_dir):
        if f.endswith((".m3u8", ".ts")):
            try:
                os.remove(os.path.join(hls_dir, f))
            except OSError as e:
                print(f"[HLS clean] {f} 삭제 실패: {e}")
    print(f"기존 HLS 파일을 정리했습니다: {hls_dir}")

    hls_seg_pattern = os.path.join(hls_dir, "stream_%Y-%m-%d_%H-%M-%S.ts")
    hls_output = (
        f"[f=hls:"
        f"hls_time={SEGMENT_DURATION}:"
        f"hls_list_size={MAX_HLS_FILES}:"
        f"hls_flags=delete_segments+program_date_time:"
        f"strftime=1:"
        f"hls_segment_filename={hls_seg_pattern}]"
        f"{hls_playlist_path}"
    )

    rtmp_output = f"[f=flv]{rtmp_url}"
    tee_output_string = f"{hls_output}|{rtmp_output}"

    print("FFmpeg 스트리밍을 시작합니다...")
    print(f"  - 입력 (RTSP): {RTSP_URL}")
    print(f"  - 출력 1 (RTMP): {rtmp_url}")
    print(f"  - 출력 2 (HLS):  {hls_playlist_path}")

    command = [
        "ffmpeg",
        "-loglevel", "info",
        "-rtsp_transport", "tcp",
        "-thread_queue_size","64",
        "-i", RTSP_URL,
        "-f","lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
        "-map","0:v:0","-map","1:a:0",
        "-c:v", "libx264", "-preset", "veryfast", "-tune", "zerolatency", "-pix_fmt", "yuv420p","-g","50","-keyint_min","50","-sc_threshold","0",
        "-vf", "fps=15",
        "-c:a", "aac", "-ar", "44100", "-b:a", "1k",
        "-f", "tee",
        "-flush_packets", "1",
        "-blocksize", "4096",
        "-flags", "+global_header",
        "-muxpreload","0","-muxdelay","0",
        tee_output_string,
    ]
    
    env = os.environ.copy()
    env['TZ'] = 'Asia/Seoul'
    current_ffmpeg_process = subprocess.Popen(command, env=env)

def generate_sas_url(file_name):
    """Generates a SAS URL for uploading a file."""
    payload = {"fileName": file_name, "containerName": CONTAINER_NAME}
    try:
        response = requests.post(f"{BACKEND_URL}/api/sas/generate", headers=HEADERS
                                 , data=json.dumps(payload), timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"SAS URL request failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Server response: {e.response.text}")
        return None

def start_clip_job(clip_start, clip_end, event_value, event_key):
    def _job():
        # 세그먼트가 굳을 시간을 워커에서만 기다림
        time.sleep(POST_EVENT_BUFFER_SECONDS)
        process_and_upload_event_clip(clip_start, clip_end, event_value, event_key)
    threading.Thread(target=_job, daemon=True).start()


def upload_event_data(event_data):
    """Uploads event metadata to the backend (server will make bbox & save)."""
    try:
        response = requests.post(f"{EVENT_URL}/api/events/bbox/video",
                                 headers=HEADERS, data=json.dumps(event_data), timeout=10)
        response.raise_for_status()
        print("Event data successfully sent:", response.json())
    except requests.exceptions.RequestException as e:
        print(f"send event data: {e}")
        # --- 추가된 부분 ---
        # 서버로부터 받은 응답이 있는지 확인하고, 있다면 그 내용을 출력합니다.
        if e.response is not None:
            print(" Server's detailed response:")
            try:
                # 오류 내용이 JSON 형태일 경우 예쁘게 출력합니다.
                print(json.dumps(e.response.json(), indent=2))
            except json.JSONDecodeError:
                # JSON이 아닐 경우 텍스트 그대로 출력합니다.
                print(e.response.text)

def get_ts_files_in_range(start_time: datetime, end_time: datetime):
    """HLS 세그먼트 선택"""
    start_ts = start_time.timestamp()
    end_ts = end_time.timestamp()

    files = []
    for ent in os.scandir(HLS_DIR):
        if not ent.name.endswith('.ts'):
            continue
        try:
            mt = ent.stat().st_mtime
        except FileNotFoundError:
            continue
        if (start_ts - 2) <= mt <= (end_ts + 2):
            files.append(ent.path)

    files.sort(key=lambda p: os.path.getmtime(p))

    if not files:
        offset = (datetime.now() - datetime.utcnow()).total_seconds()
        start_ts2 = start_ts + offset
        end_ts2 = end_ts + offset
        for ent in os.scandir(HLS_DIR):
            if not ent.name.endswith('.ts'):
                continue
            try:
                mt = ent.stat().st_mtime
            except FileNotFoundError:
                continue
            if (start_ts2 - 2) <= mt <= (end_ts2 + 2):
                files.append(ent.path)
        files.sort(key=lambda p: os.path.getmtime(p))

    print(f"[clip] TS files found: {len(files)} between {start_time.isoformat()} and {end_time.isoformat()}")
    return files

def try_recover_real_sensor():
    """시뮬레이션 중 주기적으로 호출: 성공 시 실제 센서 객체 반환, 실패 시 None"""
    try:
        s = init_sensor_safe()
        if s is not None:
            print("[sensor] recovery success: switching to real sensor")
            return s
    except Exception as e:
        print(f"[sensor] recovery failed: {e}")
    return None

# def process_and_upload_event_clip(start_time, end_time, event_value=None, event_key="unknown"):
#     ts_files = get_ts_files_in_range(start_time, end_time)
#     if not ts_files:
#         print(f"[{event_key}] [clip] No HLS ts files found in the specified range.")
#         print(f"[{event_key}] [clip] Dir listing:", sorted([p for p in os.listdir(HLS_DIR) if p.endswith(".ts")])[-5:])
#         return

#     list_filename = f'mylist_{event_key}.txt'
#     with open(os.path.join(HLS_DIR, list_filename), 'w') as f:
#         for filename in ts_files:
#             f.write(f"file '{os.path.basename(filename)}'\n")

#     output_filename = f"{USER_ID}_{event_key}_{uuid.uuid4()}.mp4"
#     output_path = os.path.join(HLS_DIR, output_filename)
    
#     merge_command = [
#         'ffmpeg', '-f', 'concat', '-safe', '0', 
#         '-i', list_filename,
#         '-c', 'copy', os.path.basename(output_path)
#     ]
#     try:
#         subprocess.run(merge_command, check=True, cwd=HLS_DIR)
#     except subprocess.CalledProcessError as e:
#         print(f"[{event_key}] FFmpeg merge command failed: {e}")
#         return

#     sas_info = generate_sas_url(output_filename)
#     if not sas_info:
#         return

#     try:
#         with open(output_path, "rb") as video_file:
#             upload_headers = {'x-ms-blob-type': 'BlockBlob'}
            
#             response = requests.put(
#                 sas_info['sasUrl'], 
#                 data=video_file, 
#                 headers=upload_headers,
#                 timeout=(10, 60),
#             )
#             response.raise_for_status()
#             print(f"[{event_key}] Uploaded '{output_filename}' to Blob Storage.")
            
#     except requests.exceptions.RequestException as e:
#         print(f"[{event_key}] Video upload failed: {e}")
#         return

#     duration = (end_time - start_time).total_seconds()
#     event_data = {
#         "user_id": USER_ID,
#         "event_time": start_time.astimezone(KST).isoformat(),
#         "duration_seconds": int(duration),
#         "weight_info": str(abs(int(event_value))) if event_value is not None else "N/A",
#         "origin_video_url": sas_info['blobUrl'],
#         "event_type": event_key, 
#         "bowl_where_cell": '5',
#     }
#     # upload_event_data(event_data)
#     upload_event_data_async(event_data)

#     os.remove(os.path.join(HLS_DIR, list_filename))
#     os.remove(output_path)

def process_and_upload_event_clip(start_time, end_time, event_value=None, event_key="unknown"):
    ts_files = get_ts_files_in_range(start_time, end_time)
    if not ts_files:
        print(f"[{event_key}] [clip] No HLS ts files found in the specified range.")
        print(f"[{event_key}] [clip] Dir listing:", sorted([p for p in os.listdir(HLS_DIR) if p.endswith(".ts")])[-5:])
        return

    # ① 리스트 파일 이름을 유니크하게
    list_filename = f"mylist_{event_key}_{uuid.uuid4().hex}.txt"
    list_path = os.path.join(HLS_DIR, list_filename)

    with open(list_path, 'w') as f:
        for filename in ts_files:
            f.write(f"file '{os.path.basename(filename)}'\n")

    output_filename = f"{USER_ID}_{event_key}_{uuid.uuid4()}.mp4"
    output_path = os.path.join(HLS_DIR, output_filename)

    merge_command = [
        'ffmpeg', '-f', 'concat', '-safe', '0',
        '-i', list_filename,
        '-c', 'copy', os.path.basename(output_path)
    ]
    try:
        subprocess.run(merge_command, check=True, cwd=HLS_DIR)
    except subprocess.CalledProcessError as e:
        print(f"[{event_key}] FFmpeg merge command failed: {e}")
        # ② 리스트 파일은 남겨둘 이유가 없으니 지우되 에러 무시
        try: os.remove(list_path)
        except FileNotFoundError: pass
        except Exception as ex: print(f"[{event_key}] cleanup(list) failed: {ex}")
        return

    sas_info = generate_sas_url(output_filename)
    if not sas_info:
        # 병합은 됐지만 업로드 못할 때는 로컬 파일을 남겨 디버그/재시도에 쓰게 함
        try: os.remove(list_path)
        except FileNotFoundError: pass
        except Exception as ex: print(f"[{event_key}] cleanup(list) failed: {ex}")
        return

    try:
        with open(output_path, "rb") as video_file:
            upload_headers = {'x-ms-blob-type': 'BlockBlob'}
            response = requests.put(
                sas_info['sasUrl'],
                data=video_file,
                headers=upload_headers,
                timeout=(10, 60),
            )
            response.raise_for_status()
            print(f"[{event_key}] Uploaded '{output_filename}' to Blob Storage.")
    except requests.exceptions.RequestException as e:
        print(f"[{event_key}] Video upload failed: {e}")
        # 업로드 실패면 로컬 보존(원하면 여기서도 지워도 됨)
        try: os.remove(list_path)
        except FileNotFoundError: pass
        except Exception as ex: print(f"[{event_key}] cleanup(list) failed: {ex}")
        return

    duration = (end_time - start_time).total_seconds()
    event_data = {
        "user_id": USER_ID,
        "event_time": start_time.astimezone(KST).isoformat(),
        "duration_seconds": int(duration),
        "weight_info": str(abs(int(event_value))) if event_value is not None else "N/A",
        "origin_video_url": sas_info['blobUrl'],
        "event_type": event_key,
        "bowl_where_cell": '5',
    }
    upload_event_data_async(event_data)

    # ② 마지막 정리: 리스트/MP4 삭제(성공 시)
    for p in (list_path, output_path):
        try:
            os.remove(p)
        except FileNotFoundError:
            pass
        except Exception as ex:
            print(f"[{event_key}] cleanup failed: {ex}")

def init_sensor_safe():
    """센서를 안전하게 초기화하는 함수 (sensor_test.py 방식 우선)"""
    # try:
    print("[sensor] Attempting to initialize HX711 sensor...")

    # GPIO cleanup 선행 (재실행 시 잔여 상태 제거)
    try:
        import RPi.GPIO as GPIO
        GPIO.cleanup()
        print("[sensor] GPIO cleanup completed")
    except Exception as e:
        print(f"[sensor] GPIO cleanup warning: {e}")

    # --- sensor_test.py와 동일한 핀 매핑/스케일 ---
    # hx1: DOUT=5,  SCK=6
    # hx2: DOUT=13, SCK=19
    sensor = HX711Pair(
        dout1_pin=5,  sck1_pin=6,
        dout2_pin=13, sck2_pin=19,
        ref1=435.0, ref2=435.0, avg_n=5
    ).start()

    # 안정화 대기 및 테스트 읽기
    print("[sensor] Waiting for sensor stabilization...")
    time.sleep(2.0)
    test_values = sensor.latest()
    print(f"[sensor] Test reading successful: {test_values}")
    return sensor

    # except Exception as e:
    #     print(f"[sensor] Sensor initialization failed: {e} ({type(e).__name__})")

    #     # (선택) 만약 사용자의 커스텀 모듈이 있는 환경이면, 마지막 시도로 사용
    #     try:
    #         from sensors import DualHX711Reader
    #         print("[sensor] Fallback to sensors.DualHX711Reader...")
    #         sensor = DualHX711Reader(
    #             sck_pin=6, sck_pin2=19, dout1_pin=5, dout2_pin=13,
    #             scale1=435.0, scale2=435.0, sps=5.0, avg_n=5
    #         )
    #         sensor.start()
    #         time.sleep(2.0)
    #         _ = sensor.latest()
    #         print("[sensor] Fallback reader success")
    #         return sensor
    #     except Exception as ee:
    #         print(f"[sensor] Fallback failed: {ee}")

    #     print("[sensor] 시뮬레이션 모드로 전환합니다.")
    #     return None

class SimSensor:
    """실패 시 대체용 더미 센서: API 호환(latest/start/stop)."""
    def __init__(self, v1=0.0, v2=0.0):
        self._v = (float(v1), float(v2))
    def start(self):
        return self
    def latest(self):
        return self._v
    def stop(self):
        pass

def init_sensor_with_retry(max_retries=5, delay_sec=5.0):
    """실제 센서 초기화를 N회 재시도. 성공 시 (sensor, False), 모두 실패 시 (SimSensor(), True)"""
    for i in range(1, max_retries + 1):
        try:
            s = init_sensor_safe()  # 기존 함수 재사용
            if s is not None:
                return s, False
        except Exception as e:
            print(f"[sensor] init attempt {i}/{max_retries} failed: {e}")
        time.sleep(delay_sec)
    print("[sensor] all init attempts failed -> simulation mode")
    return SimSensor(), True


if __name__ == "__main__":
    print("Starting FFmpeg HLS streaming...")
    start_hls_streaming()

    print("Waiting for initial segments to be created...")
    time.sleep(5)

    print("Starting smart event monitoring...")
    
    # 상태 관리를 위한 변수
    event_states = {
        'meal': {'is_event_in_progress': False, 'event_start_time': None, 'last_change_time': None},
        'drink': {'is_event_in_progress': False, 'event_start_time': None, 'last_change_time': None}
    }
    
    DELTA_G = 2.0
    SENSOR_META = {
        'meal':  {'event_type': 'meal',  'bowl_where_cell': '5'},
        'drink': {'event_type': 'drink', 'bowl_where_cell': '5'},
    }

    # 센서 초기화 (안전한 방식)
    sensor, use_simulation = init_sensor_with_retry(max_retries=5, delay_sec=5.0)

    if use_simulation:
        print("[mode] 시뮬레이션 모드로 실행합니다.")
    else:
        print("[mode] 실제 센서 모드로 실행합니다.")

    try:
        s1_init, s2_init = sensor.latest()
        
        last_values = {'meal': s1_init, 'drink': s2_init}
        last_probe_ts = time.monotonic()
        PROBE_INTERVAL_SEC = 30.0 
        while True:
            try:
                s1_current, s2_current = sensor.latest()
            except Exception as e:
                print(f"[sensor] 센서 읽기 실패: {e} -> 재초기화")
                try:
                    sensor.stop()
                except Exception:
                    pass
                sensor, use_simulation = init_sensor_with_retry(max_retries=3, delay_sec=2.0)
                time.sleep(1.0)
                continue
            
            current_values = {'meal': s1_current, 'drink': s2_current}
            now = datetime.now(KST)

            # 각 센서에 대해 독립적으로 이벤트 처리
            for sen_key, current_value in current_values.items():
                state = event_states[sen_key]
                last_value = last_values[sen_key]
                changed = abs(current_value - last_value) >= DELTA_G
            
                if changed:
                    if not state['is_event_in_progress']:
                        state['is_event_in_progress'] = True
                        state['event_start_time'] = now
                        state['last_change_time'] = now
                        print(f"[{sen_key}] Event STARTED at {state['event_start_time'].isoformat()}. Value change: {last_value} -> {current_value}")
                    else:
                        state['last_change_time'] = now
                        print(f"[{sen_key}] -> Activity detected at {state['last_change_time'].isoformat()}. Timer reset. Value: {current_value}")
                else:
                    if state['is_event_in_progress']:
                        stable_duration = now - state['last_change_time']

                        if stable_duration.total_seconds() >= STABILITY_THRESHOLD_SECONDS:
                            event_end_time = state['last_change_time']
                            print(f"[{sen_key}] Event ENDED due to stability for {STABILITY_THRESHOLD_SECONDS} seconds.")

                            # ✨ POST 버퍼는 더하지 말고, 워커에서 기다리게 한다
                            clip_start = state['event_start_time'] - timedelta(seconds=PRE_EVENT_BUFFER_SECONDS)
                            clip_end   = event_end_time

                            # ✨ 비동기 작업 큐잉 → 즉시 반환(센서 계속 폴링)
                            start_clip_job(clip_start, clip_end, last_value, sen_key)

                            # 상태 리셋
                            state['is_event_in_progress'] = False
                            state['event_start_time'] = None
                            state['last_change_time'] = None
                            print(f"\n--- [{sen_key}] Waiting for next event ---\n")

                if state['is_event_in_progress']:
                    open_secs = (now - state['event_start_time']).total_seconds()
                    if open_secs >= MAX_EVENT_SECONDS:
                        print(f"[{sen_key}] Event FORCE-CLOSE (> {MAX_EVENT_SECONDS}s open)")
                        event_end_time = state['last_change_time'] or now

                        clip_start = state['event_start_time'] - timedelta(seconds=PRE_EVENT_BUFFER_SECONDS)
                        clip_end   = event_end_time  # ✨ 마찬가지로 워커가 기다림

                        # ✨ 동기 처리 제거 → 비동기 처리
                        start_clip_job(clip_start, clip_end, last_value, sen_key)

                        # 상태 리셋
                        state['is_event_in_progress'] = False
                        state['event_start_time'] = None
                        state['last_change_time'] = None
                        print(f"\n--- [{sen_key}] Forced close; waiting for next event ---\n")

            now_mon = time.monotonic()
            if use_simulation and (now_mon - last_probe_ts >= PROBE_INTERVAL_SEC):
                rec = try_recover_real_sensor()
                if rec:
                    # 기존 더미/고장 센서 정리
                    try:
                        sensor.stop()
                    except Exception:
                        pass
                    sensor = rec
                    use_simulation = False
                last_probe_ts = now_mon
            last_values = current_values.copy()
            time.sleep(1)

    except KeyboardInterrupt:
        print("Program terminated by user.")
    finally:
        if current_ffmpeg_process:
            current_ffmpeg_process.terminate()
            print("FFmpeg process terminated.")
        
        if sensor and not use_simulation:
            try:
                sensor.stop()
                print("Sensor stopped.")
            except Exception as e:
                print(f"Sensor stop error: {e}")