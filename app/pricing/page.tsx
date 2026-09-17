import type { Metadata } from 'next'
import { APP_URL, getSite } from '@/lib/content'
import { Container, Eyebrow } from '@/components/ui'
import { Reveal } from '@/components/motion'
import { PricingCards } from '@/components/sections/PricingCards'

export const metadata: Metadata = { title: 'Pricing', description: 'What Zogal costs. Free to start.' }

export default async function PricingPage() {
  const site = await getSite()
  const signup = site.home.hero_button_link || `${APP_URL}/signup`
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mt-3 max-w-[720px] text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest sm:text-[60px]">{site.pricing.intro}</h1>
          <p className="mt-4 max-w-[520px] text-[17px] leading-relaxed text-muted">Prices are shown in the currency the plan is priced in. Your card decides the rest.</p>
        </Reveal>
        <div className="mt-12">
          <PricingCards pricing={site.pricing} signup={signup} />
        </div>
      </Container>
    </section>
  )
}
