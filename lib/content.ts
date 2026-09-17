/**
 * What the site says, from the back office.
 *
 * One fetch of the app's /api/marketing/content, cached under the tag
 * 'content' until the back office publishes and calls /api/revalidate.
 * Only published content ever comes through that route; drafts do not
 * exist to this site.
 *
 * Every field has a fallback, so a blank field in the back office never
 * makes a hole on the page -- and the site reads as finished before a
 * single word has been typed.
 */

export interface Home {
  hero_title: string
  hero_line: string
  hero_button: string
  hero_button_link: string
  hero_image: string
  point_1_title: string
  point_1_body: string
  point_1_image: string
  /** Which end of the screen the card shows: 'top' or 'bottom'. */
  point_1_focus: string
  point_2_title: string
  point_2_body: string
  point_2_image: string
  point_2_focus: string
  point_3_title: string
  point_3_body: string
  point_3_image: string
  point_3_focus: string
  closing_title: string
  closing_body: string
}

export interface About {
  title: string
  body: string
  image: string
}

export interface Footer {
  tagline: string
  contact_email: string
  x_link: string
  instagram_link: string
  linkedin_link: string
  play_store_link: string
  app_store_link: string
}

export interface Legal {
  title: string
  updated: string
  body: string
}

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
  home: Home
  about: About
  footer: Footer
  legal_privacy: Legal
  legal_terms: Legal
  properties: Property[]
  pricing: Pricing
}

// A variable left blank on the host counts as unset, not as an empty
// address -- otherwise "Get the app" would point at this site's own /signup.
const env = (name: string) => (process.env[name] ?? '').trim().replace(/\/$/, '')
export const APP_URL = env('NEXT_PUBLIC_APP_URL') || 'https://dashboard.zogal.app'
const CONTENT_URL = env('CONTENT_URL') || APP_URL

export const DEFAULTS: Site = {
  home: {
    hero_title: 'See it coming.',
    hero_line: 'Zogal reads your receipts and bank alerts, works out what is safe to spend today, and tells you before the month runs short.',
    hero_button: 'Start free',
    hero_button_link: `${APP_URL}/signup`,
    hero_image: '/phones/home.webp',
    point_1_title: 'Log it in seconds',
    point_1_body: 'Snap a receipt, forward a bank alert, or tap it in. Zogal reads the numbers and sorts them for you.',
    point_1_image: '/phones/scan.webp',
    point_1_focus: 'bottom',
    point_2_title: 'Know before it happens',
    point_2_body: 'Every day Zogal works out what you can spend and still make it to payday — and says so plainly when the pace will not hold.',
    point_2_image: '/phones/insight-runout.webp',
    point_2_focus: 'top',
    point_3_title: 'Every naira, at once',
    point_3_body: 'Where the money went this period, by category, with the ones that grew called out. No spreadsheet, no guessing.',
    point_3_image: '/phones/period.webp',
    point_3_focus: 'bottom',
    closing_title: 'Money you can see coming.',
    closing_body: 'Free to start. Naira first, dollars too. Nothing to set up but you.',
  },
  about: {
    title: 'About Zogal',
    body: 'Zogal is built in Nigeria for people who get paid and then have to make it last.\n\nMost money apps were made for people with steady salaries and tidy bank feeds. Zogal starts from the other end: what came in, what has to go out, and what that leaves for today.',
    image: '',
  },
  footer: {
    tagline: 'Money you can see coming.',
    contact_email: 'hello@zogal.app',
    x_link: '',
    instagram_link: '',
    linkedin_link: '',
    play_store_link: '',
    app_store_link: '',
  },
  legal_privacy: { title: 'Privacy policy', updated: '', body: 'This page has not been published yet.' },
  legal_terms: { title: 'Terms of service', updated: '', body: 'This page has not been published yet.' },
  properties: [],
  pricing: { intro: 'Start free. Upgrade when Zogal has earned it.', plans: [], pushedAt: null },
}

/** A published piece over its defaults: blank fields fall back, field by field. */
function merge<T extends object>(fallback: T, published: unknown): T {
  const out: Record<string, unknown> = { ...(fallback as Record<string, unknown>) }
  if (published && typeof published === 'object') {
    for (const [k, v] of Object.entries(published as Record<string, unknown>)) {
      if (k in out && typeof v === 'string' && v.trim() !== '') out[k] = v
    }
  }
  return out as T
}

export async function getSite(): Promise<Site> {
  let raw: Partial<Record<keyof Site, unknown>> = {}
  try {
    const res = await fetch(`${CONTENT_URL}/api/marketing/content`, {
      // Five minutes on its own; at once when the back office calls /api/revalidate.
      next: { tags: ['content'], revalidate: 300 },
    })
    if (res.ok) raw = (await res.json()) as typeof raw
    else console.error('content fetch answered', res.status)
  } catch (err) {
    // The site must never be blank because the app is having a moment.
    console.error('content fetch failed:', err)
  }

  const pricing = raw.pricing as Partial<Pricing> | undefined
  return {
    home: merge(DEFAULTS.home, raw.home),
    about: merge(DEFAULTS.about, raw.about),
    footer: merge(DEFAULTS.footer, raw.footer),
    legal_privacy: merge(DEFAULTS.legal_privacy, raw.legal_privacy),
    legal_terms: merge(DEFAULTS.legal_terms, raw.legal_terms),
    properties: Array.isArray(raw.properties) ? (raw.properties as Property[]).filter((p) => p && p.name && p.url) : [],
    pricing: {
      intro: pricing?.intro?.trim() || DEFAULTS.pricing.intro,
      plans: Array.isArray(pricing?.plans) ? pricing.plans : [],
      pushedAt: pricing?.pushedAt ?? null,
    },
  }
}

/** The "Get the app" destination: a store if one is set, else the app's sign-up. */
export function appLink(footer: Footer): string {
  return footer.play_store_link || footer.app_store_link || `${APP_URL}/signup`
}
