'use client'

import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
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

/**
 * The hero phone: rests at a slight lean and follows the pointer -- tilting
 * toward it and lifting -- then settles back. Same idea as the cards, more
 * of it, because this one is the product.
 */
export function HeroPhone({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ x: 0, y: 0, on: false })
  const rest = { rx: 0, ry: 0, rz: -4 }
  return (
    <div
      ref={ref}
      style={{
        transform: t.on
          ? `perspective(1100px) rotateX(${t.y}deg) rotateY(${t.x}deg) rotateZ(-2deg) translateY(-6px) scale(1.02)`
          : `perspective(1100px) rotateX(${rest.rx}deg) rotateY(${rest.ry}deg) rotateZ(${rest.rz}deg)`,
        transition: t.on ? 'transform 120ms ease-out' : 'transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        willChange: 'transform',
      }}
      onPointerMove={(e) => {
        if (reduced || !ref.current || e.pointerType !== 'mouse') return
        const r = ref.current.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        setT({ x: x * 16, y: -y * 12, on: true })
      }}
      onPointerLeave={() => setT({ x: 0, y: 0, on: false })}
    >
      {children}
    </div>
  )
}

/** A card that tilts a few degrees toward the pointer. */
export function TiltCard({ children, className = '', strength = 6, lift = false, baseRotate = 0 }: { children: ReactNode; className?: string; strength?: number; lift?: boolean; baseRotate?: number }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ x: 0, y: 0 })
  const on = t.x !== 0 || t.y !== 0
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `perspective(900px) rotateX(${t.y}deg) rotateY(${t.x}deg) rotateZ(${baseRotate}deg)${lift && on ? ' translateY(-6px) scale(1.03)' : ''}`,
        transition: on ? 'transform 150ms ease-out' : 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        zIndex: lift && on ? 2 : undefined,
      }}
      onPointerMove={(e) => {
        if (reduced || !ref.current || e.pointerType !== 'mouse') return
        const r = ref.current.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        setT({ x: x * strength, y: -y * strength })
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

/**
 * The branch behind the three truths. A gentle curve across the row on a
 * wide screen, a straight stem down it when the cards stack; drawn once as
 * it scrolls into view, still afterwards. Sits behind the cards, so most
 * of it is hidden by them and only the joins show -- which is the point.
 */
export function Branch({ direction = 'across' }: { direction?: 'across' | 'down' }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const draw = reduced || inView
  if (direction === 'down') {
    // Weaves left-right down a stack of cards, one bend per card.
    return (
      <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden>
        <svg className="h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="none" fill="none">
          <motion.path
            d="M 120 -10 C 200 200, 800 250, 860 400 S 200 650, 140 800 S 700 950, 880 1010"
            stroke="#16A34A"
            strokeOpacity="0.45"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: draw ? 1 : 0 }}
            transition={{ duration: 2.2, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </svg>
      </div>
    )
  }
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden>
      <svg className="hidden h-full w-full sm:block" viewBox="0 0 1000 200" preserveAspectRatio="none" fill="none">
        <motion.path
          d="M -20 150 C 150 60, 300 60, 500 110 S 850 170, 1020 60"
          stroke="#16A34A"
          strokeOpacity="0.45"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: draw ? 1 : 0 }}
          transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </svg>
      <svg className="h-full w-full sm:hidden" viewBox="0 0 100 1000" preserveAspectRatio="none" fill="none">
        <motion.path
          d="M 50 -10 C 30 250, 70 500, 50 750 S 40 950, 50 1010"
          stroke="#16A34A"
          strokeOpacity="0.45"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: draw ? 1 : 0 }}
          transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </svg>
    </div>
  )
}

/**
 * Leaves drifting across a forest band: four, large and faint, each on its
 * own slow loop. Life in the background, never in the way of the words.
 */
const DRIFTS = [
  { left: '-8%', top: '-20%', size: 520, t: '38s', d: '0s', dx: '40px', dy: '30px', r0: '-20deg', r1: '-8deg' },
  { left: '62%', top: '30%', size: 420, t: '46s', d: '-12s', dx: '-50px', dy: '20px', r0: '150deg', r1: '164deg' },
  { left: '30%', top: '60%', size: 300, t: '52s', d: '-25s', dx: '30px', dy: '-40px', r0: '70deg', r1: '58deg' },
  { left: '82%', top: '-15%', size: 260, t: '41s', d: '-6s', dx: '-30px', dy: '30px', r0: '-100deg', r1: '-112deg' },
]

export function LeafField({ children }: { children?: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {DRIFTS.map((l, i) => (
        <span
          key={i}
          className="drift"
          style={{ left: l.left, top: l.top, width: l.size, height: l.size, '--t': l.t, '--d': l.d, '--dx': l.dx, '--dy': l.dy, '--r0': l.r0, '--r1': l.r1 } as React.CSSProperties}
        >
          {children}
        </span>
      ))}
    </div>
  )
}

/**
 * The closing flourish: a short stem draws in under the headline and a
 * leaf opens at its end. Once, when it comes into view.
 */
export function Flourish() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const go = reduced || inView
  return (
    <div ref={ref} className="mx-auto mt-6 flex h-10 w-[220px] items-center justify-center" aria-hidden>
      <svg viewBox="0 0 220 40" width="220" height="40" fill="none">
        <motion.path
          d="M 4 30 C 60 8, 120 8, 176 22"
          stroke="#16A34A"
          strokeOpacity="0.7"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: go ? 1 : 0 }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
        />
        <motion.g
          style={{ originX: '176px', originY: '22px' }}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: go ? 1 : 0, rotate: go ? 0 : -30 }}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <g transform="translate(172 2) scale(0.34)">
            <defs>
              <linearGradient id="flourish-leaf" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#0F5E52" />
                <stop offset="0.45" stopColor="#16A34A" />
                <stop offset="1" stopColor="#C6F542" />
              </linearGradient>
            </defs>
            <path d="M8 92 C 12 50, 40 18, 92 8 C 90 40, 74 76, 36 90 C 26 93, 16 94, 8 92 Z" fill="url(#flourish-leaf)" />
            <path d="M8 92 C 30 72, 56 46, 92 8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </motion.g>
      </svg>
    </div>
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
