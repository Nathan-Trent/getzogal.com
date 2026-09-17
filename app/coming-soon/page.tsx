import type { Metadata } from 'next'
import { APP_URL, getSite } from '@/lib/content'
import { Container, Eyebrow, GhostButton, LeafButton } from '@/components/ui'
import { Reveal, Flourish } from '@/components/motion'
import { Leaf } from '@/components/Leaf'

export async function generateMetadata(): Promise<Metadata> {
  const { coming_soon } = await getSite()
  return { title: coming_soon.title || 'Coming soon', robots: { index: false } }
}

/** Where a link lands when the thing behind it is not built yet. */
export default async function ComingSoonPage() {
  const { coming_soon: c } = await getSite()
  return (
    <section className="relative overflow-hidden py-24 sm:py-36">
      <Leaf size={520} className="pointer-events-none absolute -left-40 -bottom-40 opacity-[0.07]" />
      <Leaf size={360} className="pointer-events-none absolute -right-24 -top-16 rotate-[150deg] opacity-[0.07]" />
      <Container className="relative text-center">
        <Reveal>
          {c.eyebrow ? (
            <div className="flex justify-center">
              <Eyebrow>{c.eyebrow}</Eyebrow>
            </div>
          ) : null}
          <h1 className="mx-auto mt-3 max-w-[760px] text-[44px] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest sm:text-[64px]">{c.title || 'Coming soon'}</h1>
          <Flourish />
          {c.line ? <p className="mx-auto mt-2 max-w-[520px] text-[18px] leading-relaxed text-muted">{c.line}</p> : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {c.button ? (
              <LeafButton href={c.button_link || `${APP_URL}/signup`} size="lg">
                {c.button}
              </LeafButton>
            ) : null}
            {c.secondary ? (
              <GhostButton href={c.secondary_link || '/'} size="lg">
                {c.secondary}
              </GhostButton>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
