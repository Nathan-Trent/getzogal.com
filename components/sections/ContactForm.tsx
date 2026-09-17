'use client'

import { useEffect, useRef, useState } from 'react'
import { IconArrowRight, IconCheck } from '@tabler/icons-react'
import type { Text } from '@/lib/content'
import { Leaf } from '@/components/Leaf'

// A blank variable on the host counts as unset (|| not ??), or this would post to the site itself.
const APP = ((process.env.NEXT_PUBLIC_APP_URL ?? '').trim() || 'https://dashboard.zogal.app').replace(/\/$/, '')
const SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '').trim()

declare global {
  interface Window {
    grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> }
  }
}

/**
 * The one form on the site. It posts to the app, which checks reCAPTCHA,
 * keeps the message in the Inbox and tells whoever asked to be told. No
 * database here, no secrets here: the site key is public by design.
 */
export function ContactForm({ copy }: { copy: Text }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')
  const form = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!SITE_KEY || document.getElementById('recaptcha')) return
    const s = document.createElement('script')
    s.id = 'recaptcha'
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    s.async = true
    document.head.appendChild(s)
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'sending') return
    setState('sending')
    setError('')
    const data = new FormData(e.currentTarget)
    try {
      const token = await new Promise<string>((resolve, reject) => {
        if (!window.grecaptcha || !SITE_KEY) return reject(new Error('The form is not ready yet. Give it a second and try again.'))
        window.grecaptcha.ready(() => window.grecaptcha!.execute(SITE_KEY, { action: 'contact' }).then(resolve, reject))
      })
      const res = await fetch(`${APP}/api/marketing/contact`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
          token,
          page: window.location.pathname,
        }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(json.error || 'Could not send. Try again in a minute.')
      setState('sent')
      form.current?.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send. Try again in a minute.')
      setState('error')
    }
  }

  const field = 'w-full rounded-xl border border-hair bg-white px-4 py-3 text-[15px] text-ink outline-none transition-shadow focus:ring-2 focus:ring-action/40'

  if (state === 'sent') {
    return (
      <div className="surface leaf-card p-8">
        <span className="leaf-rest at-tr">
          <Leaf size={128} />
        </span>
        <span className="relative grid h-11 w-11 place-items-center rounded-full bg-mint-soft text-action">
          <IconCheck size={22} />
        </span>
        <p className="relative mt-4 text-[17px] leading-relaxed text-forest">{copy.form_thanks || 'Thank you. We have it.'}</p>
      </div>
    )
  }

  return (
    <form ref={form} onSubmit={submit} className="surface leaf-card p-7 sm:p-8">
      <span className="leaf-rest">
        <Leaf size={128} />
      </span>
      <div className="relative grid gap-4">
        {copy.form_title ? <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-forest">{copy.form_title}</h2> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-[13px] font-semibold text-forest">
            Your name
            <input name="name" required maxLength={120} autoComplete="name" className={field} />
          </label>
          <label className="grid gap-1.5 text-[13px] font-semibold text-forest">
            Your email
            <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
          </label>
        </div>
        <label className="grid gap-1.5 text-[13px] font-semibold text-forest">
          What it is about
          <input name="subject" maxLength={200} className={field} />
        </label>
        <label className="grid gap-1.5 text-[13px] font-semibold text-forest">
          Your message
          <textarea name="message" required minLength={5} maxLength={5000} rows={6} className={`${field} resize-y`} />
        </label>
        {error ? <p className="text-[14px] font-semibold text-[#B42318]">{error}</p> : null}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" data-track="contact:send" disabled={state === 'sending'} className="leaf-btn inline-flex h-[50px] items-center justify-center rounded-[var(--radius-pill)] bg-action px-6 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(22,163,74,0.28)] transition-colors hover:bg-[#15963f] disabled:opacity-60">
            <span className="leaf">
              <Leaf size={92} />
            </span>
            <span className="label">
              {state === 'sending' ? 'Sending…' : copy.form_button || 'Send'} <IconArrowRight size={18} />
            </span>
          </button>
          {copy.form_note ? <span className="text-[13px] text-muted">{copy.form_note}</span> : null}
        </div>
        <p className="text-[12px] text-muted">Protected by reCAPTCHA. Google&apos;s <a href="https://policies.google.com/privacy" className="underline">privacy policy</a> and <a href="https://policies.google.com/terms" className="underline">terms</a> apply.</p>
      </div>
    </form>
  )
}
