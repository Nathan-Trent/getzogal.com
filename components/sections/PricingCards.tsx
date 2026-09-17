'use client'

import { useState } from 'react'
import { IconArrowRight, IconCheck } from '@tabler/icons-react'
import type { Pricing } from '@/lib/content'
import { LeafButton } from '@/components/ui'
import { TiltCard } from '@/components/motion'

/**
 * The plans, exactly as Finance published them and Marketing pushed them.
 * Nothing here is typed on the site. With no plans pushed yet, the one
 * true thing is shown: it is free to start.
 */
export function PricingCards({ pricing, signup, onDark = false }: { pricing: Pricing; signup: string; onDark?: boolean }) {
  const anyYearly = pricing.plans.some((p) => p.prices.some((x) => x.interval === 'year'))
  const [interval, setInterval] = useState<'month' | 'year'>('month')

  const card = onDark ? 'rounded-[24px] border border-white/12 bg-white/[0.06] p-7 backdrop-blur-[2px]' : 'surface p-7'
  const title = onDark ? 'text-white' : 'text-forest'
  const muted = onDark ? 'text-white/65' : 'text-muted'

  if (pricing.plans.length === 0) {
    return (
      <TiltCard strength={5} lift className={`${card} max-w-[520px]`}>
        <h3 className={`text-[26px] font-extrabold tracking-[-0.02em] ${title}`}>Free to start</h3>
        <p className={`mt-2 text-[16px] leading-relaxed ${muted}`}>Everything you need to see your money coming. Paid plans arrive when Zogal has earned them.</p>
        <div className="mt-6">
          <LeafButton href={signup} tone={onDark ? 'white' : 'green'}>
            Start free <IconArrowRight size={18} />
          </LeafButton>
        </div>
      </TiltCard>
    )
  }

  return (
    <div>
      {anyYearly ? (
        <div className={`mb-8 inline-flex rounded-full p-1 ${onDark ? 'bg-white/10' : 'bg-mint-soft'}`} role="tablist" aria-label="Billing period">
          {(['month', 'year'] as const).map((i) => (
            <button key={i} type="button" role="tab" aria-selected={interval === i} onClick={() => setInterval(i)} className={`h-10 rounded-full px-5 text-[14px] font-semibold transition-colors ${interval === i ? (onDark ? 'bg-white text-forest' : 'bg-white text-forest shadow-[var(--shadow-surface)]') : onDark ? 'text-white/70' : 'text-muted'}`}>
              {i === 'month' ? 'Monthly' : 'Yearly'}
            </button>
          ))}
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-3">
        {pricing.plans.map((p) => {
          const price = p.prices.find((x) => x.interval === interval) ?? p.prices[0] ?? null
          const free = !price || price.amount === 0
          return (
            <TiltCard key={p.key} strength={5} lift className={`${card} flex flex-col`}>
              <h3 className={`text-[22px] font-extrabold tracking-[-0.02em] ${title}`}>{p.name}</h3>
              {p.description ? <p className={`mt-1 text-[15px] leading-relaxed ${muted}`}>{p.description}</p> : null}
              <p className={`tabular mt-5 text-[34px] font-extrabold tracking-[-0.02em] ${title}`}>
                {free ? 'Free' : `${price.currency} ${price.amount.toLocaleString()}`}
                {!free && price ? <span className={`text-[14px] font-semibold ${muted}`}> / {price.interval}</span> : null}
              </p>
              {p.trialDays ? <p className={`mt-1 text-[13px] ${muted}`}>{p.trialDays}-day free trial</p> : null}
              {p.includes.length ? (
                <ul className={`mt-5 grid gap-2 text-[14px] ${onDark ? 'text-white/85' : 'text-ink'}`}>
                  {p.includes.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <IconCheck size={16} className={`mt-0.5 shrink-0 ${onDark ? 'text-signal' : 'text-action'}`} />
                      {s}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-auto pt-7">
                <LeafButton href={signup} tone={onDark ? 'white' : 'green'} className="w-full">
                  {free ? 'Start free' : `Get ${p.name}`}
                </LeafButton>
              </div>
            </TiltCard>
          )
        })}
      </div>
    </div>
  )
}
