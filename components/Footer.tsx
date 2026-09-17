import Link from 'next/link'
import { IconBrandInstagram, IconBrandLinkedin, IconBrandX, IconMail } from '@tabler/icons-react'
import type { Footer as FooterContent, Property } from '@/lib/content'
import { Container, Wordmark } from './ui'
import { Leaf } from './Leaf'
import { LeafField } from './motion'

export function Footer({ content, properties, appHref }: { content: FooterContent; properties: Property[]; appHref: string }) {
  const socials = [
    { href: content.x_link, label: 'X', Icon: IconBrandX },
    { href: content.instagram_link, label: 'Instagram', Icon: IconBrandInstagram },
    { href: content.linkedin_link, label: 'LinkedIn', Icon: IconBrandLinkedin },
  ].filter((s) => s.href)

  return (
    <footer className="band mt-24">
      <LeafField>
        <Leaf size={520} tone="white" />
      </LeafField>
      <Container className="relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark tone="white" />
            <p className="mt-4 max-w-[360px] text-[16px] leading-relaxed text-white/75">{content.tagline}</p>
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
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-signal">Zogal</p>
            <ul className="mt-4 grid gap-2.5 text-[15px] text-white/80">
              <li><a href={appHref} className="hover:text-white">Get the app</a></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              {properties.map((p) => (
                <li key={p.url}>
                  <a href={p.url} className="hover:text-white" target="_blank" rel="noreferrer">
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-signal">The fine print</p>
            <ul className="mt-4 grid gap-2.5 text-[15px] text-white/80">
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              {content.contact_email ? (
                <li>
                  <a href={`mailto:${content.contact_email}`} className="inline-flex items-center gap-1.5 hover:text-white">
                    <IconMail size={16} /> {content.contact_email}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-white/50">
          <span>© {new Date().getFullYear()} Zogal. Made in Nigeria.</span>
          <span>Naira first. Dollars too.</span>
        </div>
      </Container>
    </footer>
  )
}
