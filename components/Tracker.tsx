'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * The site's own beacon. One call per page view, per click on anything
 * marked data-track, and when a page is left (with the time spent).
 * First-party, two kilobytes, nothing loaded from anyone else.
 *
 * Who: a visitor id in a first-party cookie for a year, and a session id
 * that rotates after thirty quiet minutes. What brought them: ?ref= and
 * utm_* from the first address they landed on, kept for the visit.
 * Where: worked out by the app from the request, not here.
 */
// A blank variable on the host counts as unset (|| not ??), or this would post to the site itself.
const APP = ((process.env.NEXT_PUBLIC_APP_URL ?? '').trim() || 'https://dashboard.zogal.app').replace(/\/$/, '')
const ENDPOINT = `${APP}/api/marketing/hit`

function uuid(): string {
  return crypto.randomUUID()
}

function cookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return m ? decodeURIComponent(m[1]) : null
}

function setCookie(name: string, value: string, days: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${days * 86400}; path=/; samesite=lax; secure`
}

/** The visitor id, made once and kept a year. */
export function visitorId(): string {
  let v = cookie('zv')
  if (!v || !/^[0-9a-f-]{36}$/.test(v)) {
    v = uuid()
    setCookie('zv', v, 365)
  }
  return v
}

function sessionId(): string {
  const now = Date.now()
  try {
    const raw = sessionStorage.getItem('zs')
    if (raw) {
      const [id, at] = raw.split('|')
      if (now - Number(at) < 30 * 60 * 1000) {
        sessionStorage.setItem('zs', `${id}|${now}`)
        return id
      }
    }
    const id = uuid()
    sessionStorage.setItem('zs', `${id}|${now}`)
    return id
  } catch {
    return uuid()
  }
}

type Attribution = { src?: string; utm?: Record<string, string> }

function attribution(): Attribution {
  try {
    const stored = sessionStorage.getItem('za')
    if (stored) return JSON.parse(stored) as Attribution
  } catch {}
  const q = new URLSearchParams(window.location.search)
  const out: Attribution = {}
  const ref = q.get('ref')
  if (ref) out.src = ref.slice(0, 60)
  const utm: Record<string, string> = {}
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const v = q.get(k)
    if (v) utm[k] = v.slice(0, 120)
  }
  if (Object.keys(utm).length) out.utm = utm
  if (!out.src && utm.utm_source) out.src = utm.utm_source
  try {
    sessionStorage.setItem('za', JSON.stringify(out))
  } catch {}
  return out
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload)
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }))
      return
    }
  } catch {}
  fetch(ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'content-type': 'text/plain' } }).catch(() => {})
}

function base() {
  const a = attribution()
  return { v: visitorId(), s: sessionId(), src: a.src, utm: a.utm, l: navigator.language, sc: `${window.screen.width}x${window.screen.height}` }
}

export function track(name: string) {
  send({ ...base(), k: 'click', p: window.location.pathname, n: name.slice(0, 120) })
}

export function Tracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Do not count ourselves working on the site.
    if (window.location.hostname === 'localhost') return
    const started = Date.now()
    send({ ...base(), k: 'view', p: pathname, r: document.referrer.slice(0, 500) })
    const leave = () => send({ ...base(), k: 'leave', p: pathname, d: Date.now() - started })
    window.addEventListener('pagehide', leave)
    return () => {
      window.removeEventListener('pagehide', leave)
      leave()
    }
  }, [pathname])

  useEffect(() => {
    if (window.location.hostname === 'localhost') return
    // Any link or button carrying data-track="name" is counted on click.
    const on = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]')
      if (el?.dataset.track) track(el.dataset.track)
    }
    document.addEventListener('click', on, true)
    return () => document.removeEventListener('click', on, true)
  }, [])

  useEffect(() => {
    // Links into the app carry the visitor id, so a sign-up is tied to the visit.
    if (window.location.hostname === 'localhost') return
    const v = visitorId()
    const fix = () => {
      document.querySelectorAll<HTMLAnchorElement>(`a[href^="${APP}"]`).forEach((a) => {
        try {
          const u = new URL(a.href)
          if (!u.searchParams.get('zv')) {
            u.searchParams.set('zv', v)
            a.href = u.toString()
          }
        } catch {}
      })
    }
    fix()
    const obs = new MutationObserver(fix)
    obs.observe(document.body, { childList: true, subtree: true })
    return () => obs.disconnect()
  }, [pathname])

  return null
}
