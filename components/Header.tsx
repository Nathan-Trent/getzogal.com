'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { LeafButton, Wordmark } from './ui'

const NAV = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
]

export function Header({ appHref }: { appHref: string }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${scrolled ? 'bg-ground/85 backdrop-blur-md border-b border-hair shadow-[0_1px_0_rgba(6,44,26,0.03)]' : 'bg-transparent border-b border-transparent'}`}>
      <div className="mx-auto flex h-[72px] w-full max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Zogal home" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-[15px] font-semibold text-forest/80 transition-colors hover:text-forest">
              {n.label}
            </Link>
          ))}
          <LeafButton href={appHref}>Get the app</LeafButton>
        </nav>
        <button type="button" className="grid h-11 w-11 place-items-center rounded-full text-forest md:hidden" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
          {open ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-hair bg-ground px-5 pb-6 pt-3 md:hidden">
          <nav className="grid gap-1" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-[17px] font-semibold text-forest">
                {n.label}
              </Link>
            ))}
            <div className="mt-3">
              <LeafButton href={appHref} className="w-full">
                Get the app
              </LeafButton>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
