'use client'

import { useState } from 'react'
import { IconPlus } from '@tabler/icons-react'
import { Leaf } from '@/components/Leaf'

/** Questions that open one at a time. The leaf turns as the answer unfolds. */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="grid gap-3">
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={i} className={`surface leaf-card transition-shadow ${on ? 'shadow-[var(--shadow-surface-hover)]' : ''}`}>
            <span className={`leaf-rest ${on ? 'at-tr' : ''}`} style={{ opacity: on ? 0.2 : 0.1 }}>
              <Leaf size={128} />
            </span>
            <button type="button" className="relative flex w-full items-center gap-4 px-6 py-5 text-left" aria-expanded={on} onClick={() => setOpen(on ? null : i)}>
              <span className="flex-1 text-[17px] font-extrabold tracking-[-0.01em] text-forest">{it.q}</span>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint-soft text-action transition-transform duration-300 ${on ? 'rotate-45' : ''}`}>
                <IconPlus size={18} />
              </span>
            </button>
            <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: on ? '1fr' : '0fr' }}>
              <div className="overflow-hidden">
                <p className="relative px-6 pb-6 text-[16px] leading-relaxed text-muted">{it.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
