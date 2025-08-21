import { useState, useEffect } from 'react'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface VideoThumbnailProps {
  /** 원본(서명 전) 비디오 URL */
  videoUrl: string
  altText: string
}

/**
 * 목록 썸네일용 컴포넌트
 * - 먼저 /api/events/video/sas 로 서명 URL을 발급받고
 * - 비디오 메타데이터 로드 → 시킹 → canvas에 그려 dataURL 생성
 * - 실패 시 fallback 이미지를 표시
 */
export function VideoThumbnail({ videoUrl, altText }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (!videoUrl) {
      setThumbnail(null)
      return
    }

    ;(async () => {
      // 1) SAS URL 발급 시도 (실패하면 원본 URL로 진행)
      let signedUrl = videoUrl
      try {
        const res = await fetch('/api/events/video/sas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ videoUrl }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data?.videoUrl) signedUrl = data.videoUrl
        }
      } catch {
        /* ignore - fallback to original url */
      }

      // 2) 비디오 로드/시킹 후 프레임 캡처
      try {
        const video = document.createElement('video')
        video.crossOrigin = 'anonymous'
        video.preload = 'metadata'
        // iOS 등 환경에서의 캔버스 캡처 안정화용
        ;(video as any).playsInline = true
        video.muted = true
        video.src = signedUrl

        await new Promise<void>((resolve, reject) => {
          const onLoaded = () => {
            try {
              // duration이 짧거나 알 수 없을 때를 대비하여 0.1~1초 범위
              const d = isFinite(video.duration) && video.duration > 0 ? video.duration : 2
              const t = Math.min(1, Math.max(0.1, d * 0.5))
              video.currentTime = t
            } catch (e) {
              reject(e)
            }
          }
          const onSeeked = () => resolve()
          const onError = () => reject(new Error('VIDEO_LOAD_ERROR'))
          const timer = setTimeout(() => reject(new Error('VIDEO_LOAD_TIMEOUT')), 5000)

          video.addEventListener('loadedmetadata', onLoaded, { once: true })
          video.addEventListener('seeked', onSeeked, { once: true })
          video.addEventListener('error', onError, { once: true })

          // 정리 함수
          const cleanup = () => {
            clearTimeout(timer)
            video.removeEventListener('loadedmetadata', onLoaded)
            video.removeEventListener('seeked', onSeeked)
            video.removeEventListener('error', onError)
          }

          // Promise 종료 시 정리
          const done = (ok: boolean) => {
            cleanup()
            ok ? resolve() : reject(new Error('VIDEO_PROMISE_CANCELLED'))
          }

          // onSeeked에서 resolve되면 cleanup이 실행됨
        })

        if (cancelled) return

        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 320
        canvas.height = video.videoHeight || 180
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const url = canvas.toDataURL('image/jpeg')
          if (!cancelled) setThumbnail(url)
        } else {
          if (!cancelled) setThumbnail(null)
        }
      } catch {
        if (!cancelled) setThumbnail(null)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [videoUrl])

  return (
    <ImageWithFallback
      src={thumbnail ?? undefined}
      fallbackSrc="/placeholder-image.png"   // public/ 아래에 배치
      alt={altText}
      className="w-full h-full object-cover"
    />
  )
}
