'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Motion, with restraint: one moving thing per band, once, and nothing
 * for anyone who asked their device for less.
 */

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28, filter: 'blur(6px)' }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** The hero headline: each word rises into place, once. */
export function WordPullUp({ text, className = '' }: { text: string; className?: string }) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  return (
    <h1 className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduced ? false : { y: '110%', opacity: 0 }}
            animate={reduced ? undefined : { y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

/** A card that tilts a few degrees toward the pointer. */
export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ x: 0, y: 0 })
  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `perspective(900px) rotateX(${t.y}deg) rotateY(${t.x}deg)`, transition: 'transform 250ms ease' }}
      onPointerMove={(e) => {
        if (reduced || !ref.current || e.pointerType !== 'mouse') return
        const r = ref.current.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        setT({ x: x * 6, y: -y * 6 })
      }}
      onPointerLeave={() => setT({ x: 0, y: 0 })}
    >
      {children}
    </div>
  )
}

/**
 * The stem: a line that draws down a band as it scrolls into view, with
 * a leaf budding beside each step as the line reaches it.
 */
export function Stem({ steps }: { steps: { title: string; body: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[15px] top-2 bottom-2 w-[2px] rounded bg-mint" />
      <motion.div className="absolute left-[15px] top-2 w-[2px] rounded bg-action origin-top" style={{ height: reduced ? '100%' : height }} />
      <ol className="relative grid gap-10">
        {steps.map((s, i) => (
          <StemStep key={s.title} index={i} title={s.title} body={s.body} progress={scrollYProgress} count={steps.length} />
        ))}
      </ol>
    </div>
  )
}

function StemStep({ index, title, body, progress, count }: { index: number; title: string; body: string; progress: ReturnType<typeof useScroll>['scrollYProgress']; count: number }) {
  const reduced = useReducedMotion()
  const at = (index + 0.5) / count
  const scale = useTransform(progress, [at - 0.12, at], [0, 1])
  const rotate = useTransform(progress, [at - 0.12, at], [-40, 0])
  return (
    <li className="relative pl-14">
      <motion.span className="absolute left-0 top-0 grid h-8 w-8 place-items-center" style={reduced ? undefined : { scale, rotate }}>
        <LeafDot />
      </motion.span>
      <h3 className="text-[20px] font-extrabold tracking-[-0.01em] text-forest">{title}</h3>
      <p className="mt-1.5 max-w-[520px] text-[16px] leading-relaxed text-muted">{body}</p>
    </li>
  )
}

function LeafDot() {
  return (
    <svg width="32" height="32" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="stem-leaf" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0F5E52" />
          <stop offset="0.45" stopColor="#16A34A" />
          <stop offset="1" stopColor="#C6F542" />
        </linearGradient>
      </defs>
      <path d="M8 92 C 12 50, 40 18, 92 8 C 90 40, 74 76, 36 90 C 26 93, 16 94, 8 92 Z" fill="url(#stem-leaf)" />
      <path d="M8 92 C 30 72, 56 46, 92 8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/** First visit only: the mark breathes in, then the page. */
export function Splash() {
  // Decided once, on the client, from a sessionStorage flag: shown on the
  // first page of a visit and never again that session. Undefined until
  // the client has looked, so the server renders nothing.
  const [show, setShow] = useState<boolean | undefined>(undefined)
  const reduced = useReducedMotion()
  useEffect(() => {
    let seen = true
    try {
      seen = !!sessionStorage.getItem('zogal-splash')
      if (!seen) sessionStorage.setItem('zogal-splash', '1')
    } catch {}
    const first = !seen && !reduced
    const id = requestAnimationFrame(() => setShow(first))
    const t = first ? setTimeout(() => setShow(false), 1100) : undefined
    return () => {
      cancelAnimationFrame(id)
      if (t) clearTimeout(t)
    }
  }, [reduced])
  if (!show) return null
  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-ground"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.75, duration: 0.35 }}
      aria-hidden
    >
      <motion.img
        src="/brand/zogal-512.png"
        alt=""
        width={72}
        height={72}
        initial={{ scale: 0.6, opacity: 0, filter: 'blur(8px)' }}
        animate={{ scale: [0.6, 1.04, 1], opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      />
    </motion.div>
  )
}
