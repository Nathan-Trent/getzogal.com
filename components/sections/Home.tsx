import { IconArrowRight, IconBolt, IconEye, IconReceipt } from '@tabler/icons-react'
import type { Item, Pricing, Property, Text } from '@/lib/content'
import { Leaf } from '@/components/Leaf'
import { Container, Eyebrow, GhostButton, LeafButton, Phone } from '@/components/ui'
import { Branch, Flourish, HeroPhone, LeafField, Reveal, Stem, TiltCard, WordPullUp } from '@/components/motion'
import { PricingCards } from './PricingCards'
import { Accordion } from './Accordion'

// ---------------------------------------------------------------------------
// Hero: one big line, a sub-line, the button, the phone.
// ---------------------------------------------------------------------------
export function Hero({ home }: { home: Text }) {
  if (!home.hero_title) return null
  return (
    <section className="relative overflow-hidden pt-6 pb-20 sm:pt-10 sm:pb-28">
      <Container>
        {/* The ask -- headline, line, Start free -- shows without scrolling;
            the phone is half in view and the reason to scroll. */}
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div className="md:-mt-10">
            {home.eyebrow ? (
              <Reveal>
                <Eyebrow>{home.eyebrow}</Eyebrow>
              </Reveal>
            ) : null}
            <WordPullUp text={home.hero_title} className="mt-4 text-[44px] font-extrabold leading-[1.02] tracking-[-0.03em] text-forest sm:text-[64px] lg:text-[76px]" />
            {home.hero_line ? (
              <Reveal delay={0.35}>
                <p className="mt-6 max-w-[520px] text-[18px] leading-relaxed text-muted sm:text-[20px]">{home.hero_line}</p>
              </Reveal>
            ) : null}
            <Reveal delay={0.5}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {home.hero_button ? (
                  <LeafButton href={home.hero_button_link} size="lg">
                    {home.hero_button} <IconArrowRight size={18} />
                  </LeafButton>
                ) : null}
                {home.hero_secondary ? (
                  <GhostButton href={home.hero_secondary_link || '/pricing'} size="lg">
                    {home.hero_secondary}
                  </GhostButton>
                ) : null}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.25} className="mx-auto w-[min(72vw,320px)] md:w-[340px]">
            <HeroPhone>
              <Phone src={home.hero_image} alt={home.hero_title} priority />
            </HeroPhone>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Truths: three cards on one branch.
// ---------------------------------------------------------------------------
const TRUTH_ICONS = [IconReceipt, IconEye, IconBolt]

export function Truths({ home }: { home: Text }) {
  const truths = [1, 2, 3].map((n) => ({ title: home[`truth_${n}_title`], body: home[`truth_${n}_body`] })).filter((t) => t.title)
  if (truths.length === 0) return null
  return (
    <section className="pb-8">
      <Container>
        {/* Three leaves on one branch: a stem draws itself behind the row
            once, as it comes into view; each card carries a leaf at rest. */}
        <div className="relative">
          <Branch />
          <div className="relative grid gap-4 sm:grid-cols-3">
            {truths.map((t, i) => {
              const Icon = TRUTH_ICONS[i % TRUTH_ICONS.length]
              return (
                <Reveal key={t.title} delay={i * 0.08}>
                  <div className="surface surface-hover leaf-card h-full p-6">
                    <span className={`leaf-rest ${i === 1 ? 'at-tr' : ''}`}>
                      <Leaf size={128} />
                    </span>
                    <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-mint-soft text-action">
                      <Icon size={22} />
                    </span>
                    <h3 className="relative mt-4 text-[17px] font-extrabold tracking-[-0.01em] text-forest">{t.title}</h3>
                    {t.body ? <p className="relative mt-1.5 text-[15px] leading-relaxed text-muted">{t.body}</p> : null}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Zogal Business: a sibling, early. White ground, mint field, no screenshot.
// ---------------------------------------------------------------------------
export function BusinessBand({ properties, sitewide }: { properties: Property[]; sitewide: Text }) {
  if (properties.length === 0) return null
  const [first, ...rest] = properties
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="surface leaf-card relative overflow-hidden p-8 sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_100%_0%,rgba(198,229,213,0.55),transparent_60%)]" />
            <span className="leaf-rest lg">
              <Leaf size={220} />
            </span>
            <div className="relative grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                {sitewide.business_eyebrow ? <Eyebrow>{sitewide.business_eyebrow}</Eyebrow> : null}
                <h2 className="mt-3 text-[36px] font-extrabold leading-[1.05] tracking-[-0.025em] text-forest sm:text-[48px]">{first.name}</h2>
                {first.line ? <p className="mt-4 max-w-[480px] text-[18px] leading-relaxed text-muted">{first.line}</p> : null}
                <div className="mt-7 flex flex-wrap gap-3">
                  <LeafButton href={first.url}>
                    {sitewide.business_button ? `${sitewide.business_button} ${first.name}` : first.name} <IconArrowRight size={18} />
                  </LeafButton>
                  {rest.map((p) => (
                    <GhostButton key={p.url} href={p.url}>
                      {p.name}
                    </GhostButton>
                  ))}
                </div>
              </div>
              <BusinessComposition t={sitewide} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/** Three solid tiles, stacked and tilted: "there is a whole system here". Every word from the back office. */
function BusinessComposition({ t }: { t: Text }) {
  const rows = [t.tile_2_row_1, t.tile_2_row_2, t.tile_2_row_3].filter(Boolean).map((r) => {
    const [item, amount] = r.split('·').map((x) => x.trim())
    return { item, amount: amount ?? '' }
  })
  return (
    <div className="relative mx-auto h-[280px] w-full max-w-[380px] select-none" aria-hidden>
      <TiltCard strength={10} lift baseRotate={-6} className="absolute left-2 top-10 w-[62%] rounded-2xl bg-white p-5 shadow-[var(--shadow-surface-hover)] ring-1 ring-hair">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{t.tile_1_label}</p>
        <p className="tabular mt-2 text-[28px] font-extrabold text-forest">{t.tile_1_value}</p>
        <div className="mt-3 h-2 w-full rounded bg-mint-soft">
          <div className="h-2 w-[68%] rounded bg-action" />
        </div>
      </TiltCard>
      <TiltCard strength={10} lift baseRotate={5} className="absolute right-0 top-0 w-[58%] rounded-2xl bg-forest p-5 text-white shadow-[var(--shadow-surface-hover)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-signal">{t.tile_2_label}</p>
        <ul className="mt-2 grid gap-1.5 text-[13px]">
          {rows.map((r, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span>{r.item}</span>
              <span className={`tabular ${i === rows.length - 1 ? 'text-signal' : 'text-white/70'}`}>{r.amount}</span>
            </li>
          ))}
        </ul>
      </TiltCard>
      <TiltCard strength={10} lift baseRotate={-2} className="absolute bottom-0 right-8 w-[60%] rounded-2xl bg-white p-5 shadow-[var(--shadow-surface-hover)] ring-1 ring-hair">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{t.tile_3_label}</p>
        <p className="tabular mt-2 text-[22px] font-extrabold text-forest">{t.tile_3_value}</p>
        {t.tile_3_note ? <p className="mt-1 text-[12px] text-muted">{t.tile_3_note}</p> : null}
      </TiltCard>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Three reasons: alternating phone and words.
// ---------------------------------------------------------------------------
export function Reasons({ home }: { home: Text }) {
  const points = [1, 2, 3]
    .map((n) => ({ title: home[`point_${n}_title`], body: home[`point_${n}_body`], image: home[`point_${n}_image`], focus: home[`point_${n}_focus`] || (n === 2 ? 'top' : 'bottom') }))
    .filter((p) => p.title)
  if (points.length === 0) return null
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Reveal>
          {home.reasons_eyebrow ? <Eyebrow>{home.reasons_eyebrow}</Eyebrow> : null}
          {home.reasons_title ? <h2 className="mt-3 max-w-[640px] text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] text-forest sm:text-[46px]">{home.reasons_title}</h2> : null}
        </Reveal>
        {/* One stem weaves down through the three cards; each carries a leaf
            on the side away from its phone, so the eye zigzags with the stem. */}
        <div className="relative mt-12 sm:mt-16">
          <Branch direction="down" />
          <div className="relative grid gap-8">
            {points.map((p, i) => (
              <Reveal key={p.title}>
                <TiltCard className="surface surface-hover leaf-card overflow-hidden">
                  <span className={`leaf-rest ${i % 2 ? 'at-tr' : 'at-tl'}`}>
                    <Leaf size={128} />
                  </span>
                  <div className={`grid items-center gap-8 px-7 py-7 sm:px-10 sm:py-10 md:grid-cols-2 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-action">0{i + 1}</p>
                      <h3 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-forest sm:text-[34px]">{p.title}</h3>
                      {p.body ? <p className="mt-4 max-w-[440px] text-[17px] leading-relaxed text-muted">{p.body}</p> : null}
                    </div>
                    {/* A window onto the phone, showing the end that matters. */}
                    <div className="relative mx-auto h-[380px] w-[min(60vw,260px)] overflow-hidden md:h-[420px] md:w-[280px]">
                      <div className={`absolute inset-x-0 ${p.focus === 'bottom' ? 'bottom-0' : 'top-0'}`}>
                        <Phone src={p.image} alt={p.title} />
                      </div>
                      <div className={`pointer-events-none absolute inset-x-0 h-16 ${p.focus === 'bottom' ? 'top-0 bg-gradient-to-b' : 'bottom-0 bg-gradient-to-t'} from-white/95 to-transparent`} />
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// How it works: the stem.
// ---------------------------------------------------------------------------
export function HowItWorks({ home, steps }: { home: Text; steps: Item[] }) {
  const list = steps.filter((s) => s.title).map((s) => ({ title: s.title, body: s.body ?? '' }))
  if (list.length === 0) return null
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            {home.how_eyebrow ? <Eyebrow>{home.how_eyebrow}</Eyebrow> : null}
            {home.how_title ? <h2 className="mt-3 text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] text-forest sm:text-[46px]">{home.how_title}</h2> : null}
            {home.how_body ? <p className="mt-4 max-w-[380px] text-[17px] leading-relaxed text-muted">{home.how_body}</p> : null}
          </Reveal>
          <Stem steps={list} />
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Pricing band, FAQs, closing band.
// ---------------------------------------------------------------------------
export function PricingBand({ pricing, page, eyebrow, signup }: { pricing: Pricing; page: Text; eyebrow: string; signup: string }) {
  return (
    <section className="band py-20 sm:py-28">
      <LeafField>
        <Leaf size={520} tone="white" />
      </LeafField>
      <Container className="relative">
        <Reveal>
          {eyebrow ? <Eyebrow tone="white">{eyebrow}</Eyebrow> : null}
          {pricing.intro ? <h2 className="mt-3 max-w-[640px] text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[46px]">{pricing.intro}</h2> : null}
        </Reveal>
        <div className="mt-12">
          <PricingCards pricing={pricing} page={page} signup={signup} onDark />
        </div>
      </Container>
    </section>
  )
}

export function Faqs({ faq, faqs }: { faq: Text; faqs: Item[] }) {
  const count = Number(faq.home_count ?? '0') || 0
  const shown = faqs.filter((f) => f.q && f.a).slice(0, count)
  if (shown.length === 0) return null
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            {faq.eyebrow ? <Eyebrow>{faq.eyebrow}</Eyebrow> : null}
            {faq.title ? <h2 className="mt-3 text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] text-forest sm:text-[46px]">{faq.title}</h2> : null}
            {faq.intro ? <p className="mt-4 max-w-[380px] text-[17px] leading-relaxed text-muted">{faq.intro}</p> : null}
            {faqs.length > shown.length ? (
              <div className="mt-6">
                <GhostButton href="/faq">More questions</GhostButton>
              </div>
            ) : null}
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion items={shown.map((f) => ({ q: f.q, a: f.a }))} />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

export function Closing({ home, signup }: { home: Text; signup: string }) {
  if (!home.closing_title) return null
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-[760px] text-[40px] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest sm:text-[60px]">{home.closing_title}</h2>
          <Flourish />
          {home.closing_body ? <p className="mx-auto mt-2 max-w-[520px] text-[18px] leading-relaxed text-muted">{home.closing_body}</p> : null}
          {home.hero_button ? (
            <div className="mt-8 flex justify-center">
              <LeafButton href={signup} size="lg">
                {home.hero_button} <IconArrowRight size={18} />
              </LeafButton>
            </div>
          ) : null}
        </Reveal>
      </Container>
    </section>
  )
}
