import { useId } from 'react'

/**
 * The tree: the brand's ribbon, drawn as a trunk with branches, and leaves
 * growing from them. Used once, on the careers page, beside "How we
 * hire". Each leaf sways on its own slow loop; still for reduced motion.
 */
const LEAF = 'M8 92 C 12 50, 40 18, 92 8 C 90 40, 74 76, 36 90 C 26 93, 16 94, 8 92 Z'
const LEAVES = [
  { x: 262, y: 118, s: 0.62, r: -20, d: '0s' },
  { x: 318, y: 176, s: 0.5, r: 30, d: '-2s' },
  { x: 118, y: 158, s: 0.58, r: -150, d: '-1s' },
  { x: 160, y: 232, s: 0.46, r: -110, d: '-3s' },
  { x: 206, y: 84, s: 0.52, r: -60, d: '-4s' },
  { x: 280, y: 250, s: 0.42, r: 60, d: '-5s' },
  { x: 92, y: 236, s: 0.4, r: 170, d: '-6s' },
]

export function Tree({ className = '' }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 400 420" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-leaf`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0F5E52" />
          <stop offset="0.45" stopColor="#16A34A" />
          <stop offset="1" stopColor="#C6F542" />
        </linearGradient>
        <linearGradient id={`${id}-trunk`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#062C1A" />
          <stop offset="1" stopColor="#104E2F" />
        </linearGradient>
      </defs>
      {/* ground */}
      <ellipse cx="200" cy="396" rx="150" ry="14" fill="#C6E5D5" opacity="0.6" />
      {/* trunk and branches: one ribbon, the way the Z is */}
      <path d="M 196 392 C 198 330, 190 270, 204 214 C 214 176, 236 150, 262 128 M 204 214 C 180 190, 150 178, 122 166 M 210 260 C 250 236, 286 232, 318 182 M 200 300 C 176 276, 156 262, 152 238 M 212 176 C 216 150, 212 116, 206 92" fill="none" stroke={`url(#${id}-trunk)`} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 196 392 C 198 330, 190 270, 204 214 C 214 176, 236 150, 262 128" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round" />
      {LEAVES.map((l, i) => (
        <g key={i} className="tree-leaf" style={{ transformOrigin: `${l.x}px ${l.y}px`, animationDelay: l.d }}>
          <g transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s}) translate(-8 -92)`}>
            <path d={LEAF} fill={`url(#${id}-leaf)`} />
            <path d="M8 92 C 30 72, 56 46, 92 8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M36 90 C 44 70, 62 44, 92 8 C 78 30, 60 62, 36 90 Z" fill="rgba(6,44,26,0.18)" />
          </g>
        </g>
      ))}
    </svg>
  )
}
