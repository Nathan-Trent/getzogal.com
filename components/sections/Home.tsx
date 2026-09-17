import { IconArrowRight, IconBolt, IconEye, IconReceipt } from '@tabler/icons-react'
import type { Home, Pricing, Property } from '@/lib/content'
import { Leaf } from '@/components/Leaf'
import { Container, Eyebrow, GhostButton, LeafButton, Phone } from '@/components/ui'
import { Branch, Flourish, HeroPhone, LeafField, Reveal, Stem, TiltCard, WordPullUp } from '@/components/motion'
import { PricingCards } from './PricingCards'

// ---------------------------------------------------------------------------
// Hero: one big line, a sub-line, the button, the phone.
// ---------------------------------------------------------------------------
export function Hero({ home }: { home: Home }) {
  return (
    <section className="relative overflow-hidden pt-6 pb-20 sm:pt-10 sm:pb-28">
      <Container>
        {/* The ask -- headline, line, Start free -- shows without scrolling;
            the phone is half in view and the reason to scroll. */}
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div className="md:-mt-10">
            <Reveal>
              <Eyebrow>Money, seen coming</Eyebrow>
            </Reveal>
            <WordPullUp text={home.hero_title} className="mt-4 text-[44px] font-extrabold leading-[1.02] tracking-[-0.03em] text-forest sm:text-[64px] lg:text-[76px]" />
            <Reveal delay={0.35}>
              <p className="mt-6 max-w-[520px] text-[18px] leading-relaxed text-muted sm:text-[20px]">{home.hero_line}</p>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <LeafButton href={home.hero_button_link} size="lg">
                  {home.hero_button} <IconArrowRight size={18} />
                </LeafButton>
                <GhostButton href="/pricing" size="lg">
                  See pricing
                </GhostButton>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.25} className="mx-auto w-[min(72vw,320px)] md:w-[340px]">
            <HeroPhone>
              <Phone src={home.hero_image} alt="The Zogal home screen: safe to spend today" priority />
            </HeroPhone>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Truths: three things the product does, no invented numbers.
// ---------------------------------------------------------------------------
const TRUTHS = [
  { Icon: IconReceipt, title: 'Reads receipts and bank alerts', body: 'A photo, a forwarded email, a tap. Zogal takes the numbers off them.' },
  { Icon: IconEye, title: 'Safe to spend, every morning', body: 'One figure that already knows about rent, bills and payday.' },
  { Icon: IconBolt, title: 'Warns before it happens', body: 'When the pace will not hold, it says so — days early, in plain words.' },
]

export function Truths() {
  return (
    <section className="pb-8">
      <Container>
        {/* Three leaves on one branch: a stem draws itself behind the row
            once, as it comes into view; each card carries a leaf at rest. */}
        <div className="relative">
          <Branch />
          <div className="relative grid gap-4 sm:grid-cols-3">
            {TRUTHS.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08}>
                <div className="surface surface-hover leaf-card h-full p-6">
                  <span className={`leaf-rest ${i === 1 ? 'at-tr' : ''}`}>
                    <Leaf size={128} />
                  </span>
                  <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-mint-soft text-action">
                    <t.Icon size={22} />
                  </span>
                  <h3 className="relative mt-4 text-[17px] font-extrabold tracking-[-0.01em] text-forest">{t.title}</h3>
                  <p className="relative mt-1.5 text-[15px] leading-relaxed text-muted">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Zogal Business: a sibling, early. White ground, mint field, no screenshot.
// ---------------------------------------------------------------------------
export function BusinessBand({ properties }: { properties: Property[] }) {
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
                <Eyebrow>Also from Zogal</Eyebrow>
                <h2 className="mt-3 text-[36px] font-extrabold leading-[1.05] tracking-[-0.025em] text-forest sm:text-[48px]">{first.name}</h2>
                <p className="mt-4 max-w-[480px] text-[18px] leading-relaxed text-muted">{first.line || 'Sales, stock, tax and staff — one system for a business.'}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <LeafButton href={first.url}>
                    Visit {first.name} <IconArrowRight size={18} />
                  </LeafButton>
                  {rest.map((p) => (
                    <GhostButton key={p.url} href={p.url}>
                      {p.name}
                    </GhostButton>
                  ))}
                </div>
              </div>
              <BusinessComposition />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/** Three solid tiles, stacked and tilted: "there is a whole system here". */
function BusinessComposition() {
  return (
    <div className="relative mx-auto h-[280px] w-full max-w-[380px] select-none" aria-hidden>
      <TiltCard strength={10} lift baseRotate={-6} className="absolute left-2 top-10 w-[62%] rounded-2xl bg-white p-5 shadow-[var(--shadow-surface-hover)] ring-1 ring-hair">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Today&apos;s sales</p>
        <p className="tabular mt-2 text-[28px] font-extrabold text-forest">₦412,900</p>
        <div className="mt-3 h-2 w-full rounded bg-mint-soft">
          <div className="h-2 w-[68%] rounded bg-action" />
        </div>
      </TiltCard>
      <TiltCard strength={10} lift baseRotate={5} className="absolute right-0 top-0 w-[58%] rounded-2xl bg-forest p-5 text-white shadow-[var(--shadow-surface-hover)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-signal">Stock</p>
        <ul className="mt-2 grid gap-1.5 text-[13px]">
          <li className="flex justify-between"><span>Rice, 50kg</span><span className="tabular text-white/70">18</span></li>
          <li className="flex justify-between"><span>Oil, 25L</span><span className="tabular text-white/70">6</span></li>
          <li className="flex justify-between"><span>Sugar, 1kg</span><span className="tabular text-signal">low</span></li>
        </ul>
      </TiltCard>
      <TiltCard strength={10} lift baseRotate={-2} className="absolute bottom-0 right-8 w-[60%] rounded-2xl bg-white p-5 shadow-[var(--shadow-surface-hover)] ring-1 ring-hair">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">VAT this month</p>
        <p className="tabular mt-2 text-[22px] font-extrabold text-forest">₦31,020</p>
        <p className="mt-1 text-[12px] text-muted">Worked out as you sell. Filed in one tap.</p>
      </TiltCard>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Three reasons: alternating phone and words.
// ---------------------------------------------------------------------------
export function Reasons({ home }: { home: Home }) {
  const points = [
    { title: home.point_1_title, body: home.point_1_body, image: home.point_1_image, focus: home.point_1_focus },
    { title: home.point_2_title, body: home.point_2_body, image: home.point_2_image, focus: home.point_2_focus },
    { title: home.point_3_title, body: home.point_3_body, image: home.point_3_image, focus: home.point_3_focus },
  ]
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Reveal>
          <Eyebrow>Why Zogal</Eyebrow>
          <h2 className="mt-3 max-w-[640px] text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] text-forest sm:text-[46px]">Built for money that arrives, then has to last.</h2>
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
                <div className={`grid items-center gap-8 p-7 sm:p-10 md:grid-cols-2 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-action">0{i + 1}</p>
                    <h3 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-forest sm:text-[34px]">{p.title}</h3>
                    <p className="mt-4 max-w-[440px] text-[17px] leading-relaxed text-muted">{p.body}</p>
                  </div>
                  {/* A window onto the phone, showing the end that matters: the
                      top for a screen whose point is up there, the bottom for a
                      sheet. Chosen per reason in the back office. */}
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
const STEPS = [
  { title: 'Tell it what came in', body: 'Your pay, or whatever arrived. Once. Zogal works out the period it has to cover.' },
  { title: 'Log what goes out — or let it read', body: 'Snap the receipt, forward the bank alert, or tap the amount. Sorted into categories for you.' },
  { title: 'Read one number every morning', body: 'Safe to spend today. It already knows about rent, bills and the days left.' },
  { title: 'Get told before it goes wrong', body: 'When the pace will not hold, Zogal says how short — and what is growing.' },
]

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] text-forest sm:text-[46px]">Four things. Then it runs itself.</h2>
            <p className="mt-4 max-w-[380px] text-[17px] leading-relaxed text-muted">No categories to set up, no budget to design. Zogal starts from what actually happened.</p>
          </Reveal>
          <Stem steps={STEPS} />
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Pricing band, closing band.
// ---------------------------------------------------------------------------
export function PricingBand({ pricing, signup }: { pricing: Pricing; signup: string }) {
  return (
    <section className="band py-20 sm:py-28">
      <LeafField>
        <Leaf size={520} tone="white" />
      </LeafField>
      <Container className="relative">
        <Reveal>
          <Eyebrow tone="white">Pricing</Eyebrow>
          <h2 className="mt-3 max-w-[640px] text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[46px]">{pricing.intro}</h2>
        </Reveal>
        <div className="mt-12">
          <PricingCards pricing={pricing} signup={signup} onDark />
        </div>
      </Container>
    </section>
  )
}

export function Closing({ home, signup }: { home: Home; signup: string }) {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-[760px] text-[40px] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest sm:text-[60px]">{home.closing_title}</h2>
          <Flourish />
          <p className="mx-auto mt-2 max-w-[520px] text-[18px] leading-relaxed text-muted">{home.closing_body}</p>
          <div className="mt-8 flex justify-center">
            <LeafButton href={signup} size="lg">
              {home.hero_button} <IconArrowRight size={18} />
            </LeafButton>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
