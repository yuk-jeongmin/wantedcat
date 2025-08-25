import React, { useMemo, useState } from 'react'

const ERROR_IMG_SRC =
  "data:image/svg+xml;utf8," +
  "<svg xmlns='http://www.w3.org/2000/svg' width='96' height='64' viewBox='0 0 96 64'>" +
  "<rect width='96' height='64' fill='%23eee'/>" +
  "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%23999'>no image</text>" +
  "</svg>"

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc?: string }

const PUBLIC_BASE = (import.meta.env.VITE_PUBLIC_BASE_URL || '').replace(/\/$/, '')
const INTERNAL_HOSTS = new Set(['backspringboot','collectionservice','localhost'])

function toPublicUrl(input?: string): string {
  if (!input) return ''
  if (/^(data|blob):/i.test(input)) return input

  if (/^https?:\/\//i.test(input)) {
    try {
      const u = new URL(input)
      let path = u.pathname.replace(/^\/app\//, '/')
      if (!path.startsWith('/')) path = `/${path}`
      if (INTERNAL_HOSTS.has(u.hostname)) {
        return PUBLIC_BASE ? `${PUBLIC_BASE}${path}${u.search}${u.hash}` : `${path}${u.search}${u.hash}`
      }
      return `${u.origin}${path}${u.search}${u.hash}`
    } catch { /* ignore and fall through */ }
  }

  let path = input.replace(/^\/app\//, '/')
  if (!path.startsWith('/')) path = `/${path}`
  return PUBLIC_BASE ? `${PUBLIC_BASE}${path}` : path
}

export function ImageWithFallback(props: Props) {
  const { src, alt = '', className = '', style, fallbackSrc, ...rest } = props
  const [didError, setDidError] = useState(false)
  const [usedFallback, setUsedFallback] = useState(false)

  const normalizedSrc = useMemo(() => toPublicUrl(src), [src])
  const normalizedFallback = useMemo(
    () => (fallbackSrc ? toPublicUrl(fallbackSrc) : ERROR_IMG_SRC),
    [fallbackSrc]
  )

  const actualSrc = didError
    ? (usedFallback ? ERROR_IMG_SRC : normalizedFallback)
    : (normalizedSrc || normalizedFallback)

  const handleError = () => {
    if (!didError) setDidError(true)
    else if (!usedFallback) setUsedFallback(true)
  }

  return (
    <img
      src={actualSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      loading="lazy"
      data-original-url={src}
      data-normalized-url={normalizedSrc}
      {...rest}
    />
  )
}
