import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODg...iAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** 로딩 실패 시 표시할 대체 이미지 경로(옵션) */
  fallbackSrc?: string
}

export function ImageWithFallback(props: Props) {
  const [didError, setDidError] = useState(false)
  const { src, alt, style, className, fallbackSrc, ...rest } = props

  const handleError = () => setDidError(true)

  // src가 없거나 로딩 실패 -> fallbackSrc(있으면) 또는 기본 에러 SVG
  const actualSrc = (!didError && src) ? src : (fallbackSrc ?? ERROR_IMG_SRC)

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
