import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, CheckCircle, Droplets, UtensilsCrossed } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from 'react-player'; 
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, Utensils } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Hls from 'hls.js';
import axios from 'axios';
import { VideoThumbnail } from './VideoThumbnail';


interface EventData {
  id: number;
  userId: string;
  eventTime: string;
  durationSeconds: number;
  weightInfo: string;
  originVideoUrl: string;
  bboxVideoUrl: string;
  eventType: string;
  catName: string;
}

// 고양이 활동 로그 생성
interface DashboardNoticesProps {
  streamKey: string | null | undefined;
  userEmail: string | null;
  date: string; // 'YYYY-MM-DD' 형식의 날짜 문자열
}

export function DashboardNotices({ streamKey, userEmail, date }: DashboardNoticesProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isOriginPlaying, setIsOriginPlaying] = useState<boolean>(false);
  const [isBboxPlaying, setIsBboxPlaying]     = useState<boolean>(false);
  const [modalOriginUrl, setModalOriginUrl] = useState<string | null>(''); // string으로 유지
  const [modalBboxUrl, setModalBboxUrl] = useState<string | null>('');
  const [activities, setActivities] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<EventData | null>(null);
  const [isModalVideoPlaying, setIsModalVideoPlaying] = useState(false);
  const today = new Date();
const videoRef = useRef<HTMLVideoElement>(null);
// const streamKey = sessionStorage.getItem('streamKey');
const streamUrl = `/hls/live/${streamKey}/index.m3u8`;
//'https://5c0f21d5c1bd.ngrok-free.app/live/12aed4be-ef30-4896-875e-5fa59685645f/index.m3u8';

useEffect(() => {
    let hls: Hls | null = null;
    const videoElement = videoRef.current;

    if (videoElement) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = streamUrl;
      }
    }

    // 컴포넌트가 사라질 때 HLS 인스턴스를 정리하여 메모리 누수를 방지합니다.
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamKey, streamUrl])

useEffect(() => {
    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    const fetchActivities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 백엔드 API 엔드포인트 주소입니다.
        const response = await fetch(`/api/events?userId=${userEmail}&date=${date}`);
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const data: EventData[] = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [userEmail, date]);

const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case '식사': return 'bg-orange-100 text-orange-800 border-orange-200';
      case '낮잠': return 'bg-blue-100 text-blue-800 border-blue-200';
      case '놀이': return 'bg-green-100 text-green-800 border-green-200';
      case '그루밍': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

const handleActivityClick = async (activity: EventData) => {
  setSelectedActivity(activity);
  setIsOriginPlaying(false);
  setIsBboxPlaying(false);
  setModalOriginUrl('');
  setModalBboxUrl('');

  try {
    const [originRes, bboxRes] = await Promise.all([
      axios.post('/api/events/video/sas', { videoUrl: activity.originVideoUrl }),
      axios.post('/api/events/video/sas', { videoUrl: activity.bboxVideoUrl  }),
    ]);
    setModalOriginUrl(originRes?.data?.videoUrl ?? '');
    setModalBboxUrl(bboxRes?.data?.videoUrl ?? '');
  } catch (e) {
    console.error(e);
    alert('비디오 URL을 불러오지 못했습니다.');
  }
};

  return (
    <Card className="h-full">
      <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>실시간 스트리밍</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-500">LIVE</span>
                </div>
              </CardTitle>
            </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
  {/* 실제 비디오: 기본 컨트롤(시간/진행바) 제거 */}
  <video
    ref={videoRef}
    autoPlay
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-contain"
  />

  {/* 커스텀 컨트롤: 시간/진행바 없음 */}
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
    <div className="flex items-center justify-between text-white">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            if (v.paused) { v.play().catch(() => {}); setIsPlaying(true); }
            else { v.pause(); setIsPlaying(false); }
          }}
          className="text-white hover:bg-white/20"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            v.muted = !v.muted;
            setIsMuted(v.muted);
          }}
          className="text-white hover:bg-white/20"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const v = videoRef.current;
          if (!v) return;
          if (v.requestFullscreen) v.requestFullscreen();
        }}
        className="text-white hover:bg-white/20"
      >
        <Maximize className="w-4 h-4" />
      </Button>
    </div>
  </div>
</div>
        {/* 스트리밍 정보 (해상도 등) */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-muted-foreground">해상도</div>
            <div className="font-medium">1080p</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">FPS</div>
            <div className="font-medium">30</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">연결 상태</div>
            <div className="font-medium text-green-600">안정</div>
          </div>
        </div>
        {/* Right - Activity Feed */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>오늘의 활동</CardTitle>
              <p className="text-sm text-muted-foreground">
                {activities.length}개의 활동이 기록되었습니다
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {/* === 로딩 및 데이터 상태에 따른 조건부 렌더링 === */}
              {isLoading && <p>활동 기록을 불러오는 중...</p>}
              {error && <p className="text-red-500">오류: {error}</p>}
              {!isLoading && !error && activities.length === 0 && <p>기록된 활동이 없습니다.</p>}
              
              {activities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="border border-border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail: origin_video_url을 사용하거나 별도 썸네일 필드가 필요합니다. */}
                    {/* <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <VideoThumbnail 
                        videoUrl={modalOriginUrl} // 원본 비디오 URL 전달
                        altText={`${activity.catName}의 ${activity.eventType} 썸네일`}
                      />
                    </div> */}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium truncate">{activity.catName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(activity.eventTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={`text-xs ${getActivityColor(activity.eventType)}`}>
                          {activity.eventType}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{activity.durationSeconds}초</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Utensils className="w-3 h-3" />
                        <span>무게: {activity.weightInfo}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
              {/* Load More */}
              <div className="text-center pt-2">
                <Button variant="ghost" className="text-primary text-sm">
                  더 많은 활동 보기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl">{/* 너비를 키워 2열 배치가 보이게 */}
            <CardHeader>
              <CardTitle>
                {selectedActivity.catName}의 {selectedActivity.eventType}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ▶ 두 개 영상 2열 배치 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 원본 */}
                <div className="aspect-video bg-black rounded overflow-hidden relative flex items-center justify-center">
                  {isOriginPlaying && modalOriginUrl ? (
                    <ReactPlayer
                      src={modalOriginUrl}      // v3는 src
                      playing={isOriginPlaying} // ✅ 이 플레이어만 제어
                      controls
                      width="100%"
                      height="100%"
                      onPlay={() => setIsOriginPlaying(true)}
                      onPause={() => setIsOriginPlaying(false)}
                      // crossOrigin="anonymous" // 필요 시
                    />
                  ) : (
                    <>
                      <ImageWithFallback
                        alt={`${selectedActivity?.catName ?? ''} 원본`}
                        className="w-full h-full object-cover opacity-50"
                      />
                      {modalOriginUrl ? (
                        <Button
                          onClick={() => setIsOriginPlaying(true)}
                          variant="ghost"
                          size="icon"
                          className="absolute text-white w-16 h-16"
                        >
                          <Play className="w-12 h-12" />
                        </Button>
                      ) : (
                        <p className="absolute text-white">원본 로딩 중...</p>
                      )}
                    </>
                  )}
                  <span className="absolute left-2 top-2 text-xs text-white/90 bg-black/50 px-2 py-1 rounded">Original</span>
                </div>

                {/* BBox */}
                <div className="aspect-video bg-black rounded overflow-hidden relative flex items-center justify-center">
                  {isBboxPlaying && modalBboxUrl ? (
                    <ReactPlayer
                      src={modalBboxUrl}
                      playing={isBboxPlaying} // ✅ 이 플레이어만 제어
                      controls
                      width="100%"
                      height="100%"
                      onPlay={() => setIsBboxPlaying(true)}
                      onPause={() => setIsBboxPlaying(false)}
                    />
                  ) : (
                    <>
                      <ImageWithFallback
                        alt={`${selectedActivity?.catName ?? ''} BBox`}
                        className="w-full h-full object-cover opacity-50"
                      />
                      {modalBboxUrl ? (
                        <Button
                          onClick={() => setIsBboxPlaying(true)}
                          variant="ghost"
                          size="icon"
                          className="absolute text-white w-16 h-16"
                        >
                          <Play className="w-12 h-12" />
                        </Button>
                      ) : (
                        <p className="absolute text-white">BBox 로딩 중...</p>
                      )}
                    </>
                  )}
                  <span className="absolute left-2 top-2 text-xs text-white/90 bg-black/50 px-2 py-1 rounded">BBox</span>
                </div>
              </div>


              {/* 메타 정보 + 닫기 */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">시간:</span>
                  <span>{formatTime(selectedActivity.eventTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">지속시간:</span>
                  <span>{selectedActivity.durationSeconds}초</span>
                </div>
                {selectedActivity.weightInfo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">식사량:</span>
                    <span>{selectedActivity.weightInfo}g</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => {
                  setSelectedActivity(null);
                  setModalOriginUrl('');
                  setModalBboxUrl('');
                  setIsModalVideoPlaying(false);
                }}
                className="w-full"
              >
                닫기
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      </CardContent>
    </Card>
  );
}