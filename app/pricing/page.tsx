import type { Metadata } from 'next'
import { getSite, signupLink } from '@/lib/content'
import { Container } from '@/components/ui'
import { PageTop } from '@/components/PageTop'
import { PricingCards } from '@/components/sections/PricingCards'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  return { title: site.pricing_page.eyebrow || 'Pricing', description: site.pricing_page.subline || undefined }
}

export default async function PricingPage() {
  const site = await getSite()
  return (
    <>
      <PageTop eyebrow={site.pricing_page.eyebrow} title={site.pricing.intro || site.pricing_page.free_title || 'Pricing'} line={site.pricing_page.subline} />
      <section className="pb-16 sm:pb-24">
        <Container>
          <PricingCards pricing={site.pricing} page={site.pricing_page} signup={signupLink(site)} />
        </Container>
      </section>
    </>
  )
}
