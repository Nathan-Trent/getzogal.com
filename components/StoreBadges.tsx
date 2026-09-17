import Link from 'next/link'
import { IconBrandApple, IconBrandGooglePlay } from '@tabler/icons-react'
import { storeLink } from '@/lib/content'

/**
 * The two store badges, drawn here rather than pasted: the same shape,
 * the platform's own mark, our type. Until a store link is set the badge
 * shows and lands on the Coming soon page -- the information is on the
 * site before the thing is.
 */
export function StoreBadges({ play, apple, tone = 'light' }: { play?: string; apple?: string; tone?: 'light' | 'dark' }) {
  const cls = tone === 'dark' ? 'border-white/20 bg-white/[0.06] text-white hover:bg-white/10' : 'border-forest/15 bg-forest text-white hover:bg-deep'
  const badge = `inline-flex h-12 items-center gap-2.5 rounded-xl border px-3.5 transition-colors ${cls}`
  const external = (href: string) => /^https?:\/\//.test(href)
  const items = [
    { href: storeLink(play), Icon: IconBrandGooglePlay, small: 'Get it on', big: 'Google Play' },
    { href: storeLink(apple), Icon: IconBrandApple, small: 'Download on the', big: 'App Store' },
  ]
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((b) => {
        const inner = (
          <>
            <b.Icon size={26} stroke={1.6} />
            <span className="grid leading-none">
              <span className="text-[10px] font-semibold uppercase tracking-[0.06em] opacity-80">{b.small}</span>
              <span className="mt-0.5 text-[16px] font-extrabold tracking-[-0.01em]">{b.big}</span>
            </span>
          </>
        )
        return external(b.href) ? (
          <a key={b.big} href={b.href} className={badge} target="_blank" rel="noreferrer" aria-label={`${b.small} ${b.big}`}>
            {inner}
          </a>
        ) : (
          <Link key={b.big} href={b.href} className={badge} aria-label={`${b.small} ${b.big}`}>
            {inner}
          </Link>
        )
      })}
    </div>
  )
}
