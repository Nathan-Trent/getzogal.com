/**
 * What the site says, from the back office.
 *
 * One fetch of the app's /api/marketing/content, cached under the tag
 * 'content' until the back office publishes and calls /api/revalidate.
 * Only published content ever comes through that route; drafts do not
 * exist to this site.
 *
 * Not one line of copy lives in this repository. Every word is a field
 * in the back office; a blank field hides its line. The shapes below are
 * the contract with the back office's lib/marketing/content.ts.
 */

export type Text = Record<string, string>
export type Item = Record<string, string>

export interface Property {
  name: string
  line: string
  url: string
}

export interface PricingPlan {
  key: string
  name: string
  description: string | null
  trialDays: number
  prices: { currency: string; interval: 'month' | 'year'; amount: number }[]
  includes: string[]
}

export interface Pricing {
  intro: string
  plans: PricingPlan[]
  pushedAt: string | null
}

export interface Site {
  home: Text
  steps: Item[]
  pricing_page: Text
  about: Text
  faq: Text
  faqs: Item[]
  careers: Text
  openings: Item[]
  contact: Text
  coming_soon: Text
  legal_privacy: Text
  legal_terms: Text
  sitewide: Text
  properties: Property[]
  pricing: Pricing
}

// A variable left blank on the host counts as unset, not as an empty
// address -- otherwise "Get the app" would point at this site's own /signup.
const env = (name: string) => (process.env[name] ?? '').trim().replace(/\/$/, '')
export const APP_URL = env('NEXT_PUBLIC_APP_URL') || 'https://dashboard.zogal.app'
const CONTENT_URL = env('CONTENT_URL') || APP_URL

/** The bundled phone screens, used only when no picture is chosen. */
const PHONES = { hero: '/phones/home.webp', point_1: '/phones/scan.webp', point_2: '/phones/insight-runout.webp', point_3: '/phones/period.webp' }

function text(published: unknown): Text {
  const out: Text = {}
  if (published && typeof published === 'object') {
    for (const [k, v] of Object.entries(published as Record<string, unknown>)) if (typeof v === 'string') out[k] = v.trim()
  }
  return out
}

function list(published: unknown, key: string): Item[] {
  const v = published && typeof published === 'object' ? (published as Record<string, unknown>)[key] : null
  if (!Array.isArray(v)) return []
  return v.filter((it) => it && typeof it === 'object').map((it) => text(it))
}

export async function getSite(): Promise<Site> {
  let raw: Record<string, unknown> = {}
  try {
    const res = await fetch(`${CONTENT_URL}/api/marketing/content`, {
      // Five minutes on its own; at once when the back office calls /api/revalidate.
      next: { tags: ['content'], revalidate: 300 },
    })
    if (res.ok) raw = (await res.json()) as Record<string, unknown>
    else console.error('content fetch answered', res.status)
  } catch (err) {
    // The site must never be blank because the app is having a moment.
    console.error('content fetch failed:', err)
  }

  const home = text(raw.home)
  home.hero_image ||= PHONES.hero
  home.point_1_image ||= PHONES.point_1
  home.point_2_image ||= PHONES.point_2
  home.point_3_image ||= PHONES.point_3
  home.hero_button_link ||= `${APP_URL}/signup`

  const pricing = raw.pricing as Partial<Pricing> | undefined
  return {
    home,
    steps: list(raw.home, 'steps'),
    pricing_page: text(raw.pricing_page),
    about: text(raw.about),
    faq: text(raw.faq),
    faqs: list(raw.faq, 'items'),
    careers: text(raw.careers),
    openings: list(raw.careers, 'openings'),
    contact: text(raw.contact),
    coming_soon: text(raw.coming_soon),
    legal_privacy: text(raw.legal_privacy),
    legal_terms: text(raw.legal_terms),
    sitewide: text(raw.sitewide),
    properties: Array.isArray(raw.properties) ? (raw.properties as Property[]).filter((p) => p && p.name && p.url) : [],
    pricing: {
      intro: pricing?.intro?.trim() || '',
      plans: Array.isArray(pricing?.plans) ? pricing.plans : [],
      pushedAt: pricing?.pushedAt ?? null,
    },
  }
}

/** Where the header button goes: the set link, a store if set, else the app's sign-up. */
export function appLink(site: Site): string {
  const s = site.sitewide
  return s.header_button_link || s.play_store_link || s.app_store_link || `${APP_URL}/signup`
}

/** The page a link lands on when the thing behind it is not built yet. */
export const COMING_SOON = '/coming-soon'

/** A store badge's link: the store, or Coming soon until there is one. */
export function storeLink(url: string | undefined): string {
  return url || COMING_SOON
}

/** The sign-up: the hero button's link. */
export function signupLink(site: Site): string {
  return site.home.hero_button_link || `${APP_URL}/signup`
}

/** The pages that exist only when they have something on them. */
export function navFor(site: Site): { href: string; label: string }[] {
  const out = [{ href: '/pricing', label: site.pricing_page.eyebrow || 'Pricing' }]
  if (site.about.title) out.push({ href: '/about', label: site.about.eyebrow || 'About' })
  if (site.faqs.length) out.push({ href: '/faq', label: site.faq.eyebrow || 'FAQs' })
  if (site.careers.title) out.push({ href: '/careers', label: site.careers.eyebrow || 'Careers' })
  if (site.contact.title) out.push({ href: '/contact', label: site.contact.eyebrow || 'Contact' })
  return out
}
