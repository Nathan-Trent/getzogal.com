import { APP_URL, getSite } from '@/lib/content'
import { BusinessBand, Closing, Hero, HowItWorks, PricingBand, Reasons, Truths } from '@/components/sections/Home'

export default async function HomePage() {
  const site = await getSite()
  const signup = site.home.hero_button_link || `${APP_URL}/signup`
  return (
    <>
      <Hero home={site.home} />
      <Truths />
      <BusinessBand properties={site.properties} />
      <Reasons home={site.home} />
      <HowItWorks />
      <PricingBand pricing={site.pricing} signup={signup} />
      <Closing home={site.home} signup={signup} />
    </>
  )
}
