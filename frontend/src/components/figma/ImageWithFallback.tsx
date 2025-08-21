import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODg...iAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** 로딩 실패 시 표시할 대체 이미지 경로(옵션) */
  fallbackSrc?: string
}

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const toPublicUrl = (p?: string) => {
  if (!p) return "";
  // 이미 절대 URL이면 그대로
  if (/^https?:\/\//i.test(p)) return p;
  // '/app/public/... → /public/...'
  const path = p.startsWith("/app/") ? p.replace("/app", "") : p;
  // API_BASE가 비어있으면 그대로 '/public/..'로 반환 → Vite가 가로채므로 반드시 API_BASE 세팅 필요
  console.log("CatImagePath",`${API_BASE}${path}`)
  return `${API_BASE}${path}`;
};

export function ImageWithFallback(props: Props) {
  const [didError, setDidError] = useState(false)
  const { src, alt, style, className, fallbackSrc, ...rest } = props
  console.log("test:",src,alt,style,className,fallbackSrc)
  const handleError = () => setDidError(true)

  // src가 없거나 로딩 실패 -> fallbackSrc(있으면) 또는 기본 에러 SVG
  const actualSrc = (!didError && src) ? src : (toPublicUrl(src) ?? ERROR_IMG_SRC)

  return (
    <img
      src={actualSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      {...rest}
      data-original-url={src}
    />
  )
}
