/**
 * The leaf. One shape, drawn once, in the same lime-to-teal ribbon as the
 * Z mark so it reads as having grown off it. Four homes: the primary
 * button, the eyebrow, the stem, the band texture. Nowhere else.
 */
import { useId } from 'react'

export function Leaf({ size = 24, className, tone = 'ribbon' }: { size?: number; className?: string; tone?: 'ribbon' | 'white' | 'ink' }) {
  const id = useId()
  const fill = tone === 'ribbon' ? `url(#${id})` : tone === 'white' ? '#F8FAF9' : '#104E2F'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className={className}>
      {tone === 'ribbon' ? (
        <defs>
          <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#0F5E52" />
            <stop offset="0.45" stopColor="#16A34A" />
            <stop offset="1" stopColor="#C6F542" />
          </linearGradient>
        </defs>
      ) : null}
      {/* The blade: a single curve from the stem to the tip, with a fold
          along the midrib so it catches light the way the Z does. */}
      <path d="M8 92 C 12 50, 40 18, 92 8 C 90 40, 74 76, 36 90 C 26 93, 16 94, 8 92 Z" fill={fill} />
      <path d="M8 92 C 30 72, 56 46, 92 8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M36 90 C 44 70, 62 44, 92 8 C 78 30, 60 62, 36 90 Z" fill="rgba(6,44,26,0.18)" />
    </svg>
  )
}
