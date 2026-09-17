import { getSite, signupLink } from '@/lib/content'
import { BusinessBand, Closing, Faqs, Hero, HowItWorks, PricingBand, Reasons, Truths } from '@/components/sections/Home'

export default async function HomePage() {
  const site = await getSite()
  const signup = signupLink(site)
  return (
    <>
      <Hero home={site.home} />
      <Truths home={site.home} />
      <BusinessBand properties={site.properties} sitewide={site.sitewide} />
      <Reasons home={site.home} />
      <HowItWorks home={site.home} steps={site.steps} />
      <PricingBand pricing={site.pricing} page={site.pricing_page} eyebrow={site.home.pricing_eyebrow} signup={signup} />
      <Faqs faq={site.faq} faqs={site.faqs} />
      <Closing home={site.home} signup={signup} />
    </>
  )
}
