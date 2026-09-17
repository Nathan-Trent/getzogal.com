import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { Leaf } from './Leaf'

/**
 * The kit. Pill buttons at Azul's sizes; the primary one carries the
 * leaf. Eyebrows carry the small leaf. Everything else is plain.
 */

const pill = 'inline-flex items-center justify-center rounded-[var(--radius-pill)] font-semibold tracking-[0.01em] select-none transition-[background-color,color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2'
const sizes = {
  md: 'h-[50px] px-6 text-[14px]',
  lg: 'h-[56px] px-8 text-[15px]',
}

type Tone = 'green' | 'white'

export function LeafButton({ href, children, size = 'md', tone = 'green', className = '' }: { href: string; children: ReactNode; size?: 'md' | 'lg'; tone?: Tone; className?: string }) {
  const colours = tone === 'green' ? 'bg-action text-white hover:bg-[#15963f] shadow-[0_8px_24px_rgba(22,163,74,0.28)]' : 'bg-white text-forest hover:bg-[#f2f7f4] shadow-[0_8px_24px_rgba(0,0,0,0.18)]'
  const external = /^https?:\/\//.test(href)
  const cls = `leaf-btn ${pill} ${sizes[size]} ${colours} ${className}`
  const inner = (
    <>
      <span className="leaf">
        <Leaf size={92} />
      </span>
      <span className="label">{children}</span>
    </>
  )
  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}

export function GhostButton({ href, children, size = 'md', tone = 'green', className = '' }: { href: string; children: ReactNode; size?: 'md' | 'lg'; tone?: Tone; className?: string }) {
  const colours = tone === 'green' ? 'text-forest border border-hair bg-white/60 hover:bg-white' : 'text-white border border-white/25 hover:bg-white/10'
  const external = /^https?:\/\//.test(href)
  // Every button carries the leaf; a secondary one takes it from the right.
  const cls = `leaf-btn from-right ${pill} ${sizes[size]} ${colours} ${className}`
  const inner = (
    <>
      <span className="leaf">
        <Leaf size={92} />
      </span>
      <span className="label">{children}</span>
    </>
  )
  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}

export function Eyebrow({ children, tone = 'green' }: { children: ReactNode; tone?: Tone }) {
  return (
    <p className={`inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] ${tone === 'green' ? 'text-action' : 'text-signal'}`}>
      <Leaf size={14} />
      {children}
    </p>
  )
}

export function ZogalMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return <Image src="/brand/zogal-512.png" alt="" width={size} height={size} className={className} priority />
}

export function Wordmark({ tone = 'green' }: { tone?: Tone }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-extrabold text-[20px] tracking-[-0.02em] ${tone === 'green' ? 'text-forest' : 'text-white'}`}>
      <ZogalMark size={30} />
      Zogal
    </span>
  )
}

/** A phone screen in a device frame, on the surface level. */
export function Phone({ src, alt, priority = false, className = '', tilt = 0 }: { src: string; alt: string; priority?: boolean; className?: string; tilt?: number }) {
  return (
    <div
      className={`relative aspect-[1284/2778] w-full overflow-hidden rounded-[44px] border-[6px] border-[#0b1a12] bg-[#0b1a12] shadow-[var(--shadow-phone)] ${className}`}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
    >
      <div className="absolute inset-0 sweep rounded-[38px]" />
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 70vw, 340px" className="relative rounded-[38px] object-cover" priority={priority} />
    </div>
  )
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1120px] px-5 sm:px-8 ${className}`}>{children}</div>
}
