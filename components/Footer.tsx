import Link from 'next/link'
import { IconBrandInstagram, IconBrandLinkedin, IconBrandX, IconMail } from '@tabler/icons-react'
import type { Site } from '@/lib/content'
import { Container, Wordmark } from './ui'
import { Leaf } from './Leaf'
import { LeafField } from './motion'

export function Footer({ site, appHref, nav }: { site: Site; appHref: string; nav: { href: string; label: string }[] }) {
  const s = site.sitewide
  const socials = [
    { href: s.x_link, label: 'X', Icon: IconBrandX },
    { href: s.instagram_link, label: 'Instagram', Icon: IconBrandInstagram },
    { href: s.linkedin_link, label: 'LinkedIn', Icon: IconBrandLinkedin },
  ].filter((x) => x.href)
  const legal = [
    site.legal_privacy.title ? { href: '/privacy', label: site.legal_privacy.title } : null,
    site.legal_terms.title ? { href: '/terms', label: site.legal_terms.title } : null,
  ].filter((x): x is { href: string; label: string } => Boolean(x))

  return (
    <footer className="band mt-24">
      <LeafField>
        <Leaf size={520} tone="white" />
      </LeafField>
      <Container className="relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark tone="white" />
            {s.tagline ? <p className="mt-4 max-w-[360px] text-[16px] leading-relaxed text-white/75">{s.tagline}</p> : null}
            {socials.length ? (
              <div className="mt-6 flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            {s.column_1_title ? <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-signal">{s.column_1_title}</p> : null}
            <ul className="mt-4 grid gap-2.5 text-[15px] text-white/80">
              {s.header_button ? (
                <li>
                  <a href={appHref} className="hover:text-white">{s.header_button}</a>
                </li>
              ) : null}
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-white">{n.label}</Link>
                </li>
              ))}
              {site.properties.map((p) => (
                <li key={p.url}>
                  <a href={p.url} className="hover:text-white" target="_blank" rel="noreferrer">{p.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {s.column_2_title ? <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-signal">{s.column_2_title}</p> : null}
            <ul className="mt-4 grid gap-2.5 text-[15px] text-white/80">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
              {s.contact_email ? (
                <li>
                  <a href={`mailto:${s.contact_email}`} className="inline-flex items-center gap-1.5 hover:text-white">
                    <IconMail size={16} /> {s.contact_email}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-white/50">
          <span>© {new Date().getFullYear()} {s.bottom_left}</span>
          {s.bottom_right ? <span>{s.bottom_right}</span> : null}
        </div>
      </Container>
    </footer>
  )
}
