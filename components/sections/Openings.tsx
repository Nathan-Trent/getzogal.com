import Link from 'next/link'
import { IconArrowRight, IconChevronLeft, IconChevronRight, IconMapPin, IconUsers } from '@tabler/icons-react'
import type { Item } from '@/lib/content'
import { slugOf } from '@/lib/content'
import { Leaf } from '@/components/Leaf'
import { Reveal } from '@/components/motion'

const PER_PAGE = 10

export type Filters = { team?: string; location?: string; type?: string; page?: string }

function href(base: string, f: Filters, patch: Partial<Filters>): string {
  const q = new URLSearchParams()
  const next = { ...f, ...patch }
  for (const k of ['team', 'location', 'type', 'page'] as const) if (next[k] && !(k === 'page' && next[k] === '1')) q.set(k, next[k]!)
  const s = q.toString()
  return s ? `${base}?${s}` : base
}

/**
 * The openings, as rows: filters first (their values from the data, so a
 * new team appears on its own), then a page of roles, then the pager. The
 * filters and page live in the address, so a link to "Engineering, page
 * 2" is a link.
 */
export function Openings({ roles, filters, none }: { roles: Item[]; filters: Filters; none: { title: string; body: string } }) {
  const base = '/careers'
  const values = (k: string) => [...new Set(roles.map((r) => r[k]).filter(Boolean))].sort()
  const matching = roles.filter((r) => (!filters.team || r.team === filters.team) && (!filters.location || r.location === filters.location) && (!filters.type || r.type === filters.type))
  const pages = Math.max(1, Math.ceil(matching.length / PER_PAGE))
  const page = Math.min(pages, Math.max(1, Number(filters.page) || 1))
  const shown = matching.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const any = filters.team || filters.location || filters.type

  const chip = (on: boolean) => `inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${on ? 'border-action bg-action text-white' : 'border-hair bg-white/70 text-forest hover:bg-white'}`

  return (
    <div>
      {roles.length > 0 ? (
        <div className="grid gap-3">
          {(['team', 'location', 'type'] as const).map((k) => {
            const vs = values(k)
            if (vs.length < 2) return null
            return (
              <div key={k} className="flex flex-wrap items-center gap-2">
                <span className="mr-1 w-16 text-[12px] font-bold uppercase tracking-[0.12em] text-muted">{k}</span>
                <Link href={href(base, filters, { [k]: undefined, page: '1' })} className={chip(!filters[k])}>
                  All
                </Link>
                {vs.map((v) => (
                  <Link key={v} href={href(base, filters, { [k]: v, page: '1' })} className={chip(filters[k] === v)}>
                    {v}
                  </Link>
                ))}
              </div>
            )
          })}
        </div>
      ) : null}

      <p className="mt-6 text-[14px] text-muted">
        {matching.length === 0 ? 'No roles match.' : `${matching.length} open ${matching.length === 1 ? 'role' : 'roles'}${any ? ' matching' : ''}.`}
      </p>

      {roles.length === 0 ? (
        <Reveal>
          <div className="surface leaf-card mt-4 max-w-[640px] p-7">
            <span className="leaf-rest">
              <Leaf size={128} />
            </span>
            <h3 className="relative text-[20px] font-extrabold tracking-[-0.01em] text-forest">{none.title}</h3>
            {none.body ? <p className="relative mt-2 text-[15px] leading-relaxed text-muted">{none.body}</p> : null}
          </div>
        </Reveal>
      ) : (
        <ol className="mt-4 grid gap-3">
          {shown.map((o, i) => {
            const open = o.open !== 'no' && Boolean(o.apply_link)
            const slug = slugOf(o.title)
            return (
              <li key={slug + i}>
                <Reveal delay={Math.min(i, 5) * 0.04}>
                  <article className="surface surface-hover leaf-card">
                    <span className={`leaf-rest ${i % 2 ? 'at-tr' : ''}`} style={{ opacity: 0.1 }}>
                      <Leaf size={128} />
                    </span>
                    <div className="relative grid items-center gap-4 px-6 py-5 md:grid-cols-[1fr_auto]">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <Link href={`/careers/${slug}`} className="text-[19px] font-extrabold tracking-[-0.01em] text-forest hover:text-action">
                            {o.title}
                          </Link>
                          {o.team ? <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-action">{o.team}</span> : null}
                        </div>
                        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
                          {o.location ? (
                            <span className="inline-flex items-center gap-1"><IconMapPin size={14} /> {o.location}</span>
                          ) : null}
                          {o.type ? (
                            <span className="inline-flex items-center gap-1"><IconUsers size={14} /> {o.type}</span>
                          ) : null}
                        </p>
                        {o.summary ? <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-muted">{o.summary}</p> : null}
                      </div>
                      <div className="flex items-center gap-2 md:justify-end">
                        <Link href={`/careers/${slug}`} className="inline-flex h-10 items-center gap-1 rounded-full border border-hair bg-white/60 px-4 text-[13px] font-semibold text-forest hover:bg-white">
                          Details <IconArrowRight size={16} />
                        </Link>
                        {open ? (
                          <a href={o.apply_link} className="inline-flex h-10 items-center rounded-full bg-action px-4 text-[13px] font-semibold text-white hover:bg-[#15963f]" target={/^https?:/.test(o.apply_link) ? '_blank' : undefined} rel="noreferrer">
                            Apply
                          </a>
                        ) : (
                          <span className="inline-flex h-10 items-center rounded-full bg-mint-soft px-4 text-[13px] font-semibold text-muted" title="Applications are not open yet">
                            Not open yet
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            )
          })}
        </ol>
      )}

      {pages > 1 ? (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pages">
          <Link href={href(base, filters, { page: String(Math.max(1, page - 1)) })} aria-disabled={page === 1} className={`grid h-10 w-10 place-items-center rounded-full border border-hair ${page === 1 ? 'pointer-events-none opacity-40' : 'hover:bg-white'}`}>
            <IconChevronLeft size={18} />
          </Link>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={href(base, filters, { page: String(p) })} aria-current={p === page ? 'page' : undefined} className={`grid h-10 min-w-10 place-items-center rounded-full px-3 text-[14px] font-semibold ${p === page ? 'bg-action text-white' : 'text-forest hover:bg-white'}`}>
              {p}
            </Link>
          ))}
          <Link href={href(base, filters, { page: String(Math.min(pages, page + 1)) })} aria-disabled={page === pages} className={`grid h-10 w-10 place-items-center rounded-full border border-hair ${page === pages ? 'pointer-events-none opacity-40' : 'hover:bg-white'}`}>
            <IconChevronRight size={18} />
          </Link>
        </nav>
      ) : null}
    </div>
  )
}
