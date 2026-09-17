import type { MetadataRoute } from 'next'
import { getSite } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://getzogal.com'
  const site = await getSite()
  const paths = ['', '/pricing']
  if (site.about.title) paths.push('/about')
  if (site.faqs.length) paths.push('/faq')
  if (site.careers.title) paths.push('/careers')
  if (site.contact.title) paths.push('/contact')
  if (site.legal_privacy.title) paths.push('/privacy')
  if (site.legal_terms.title) paths.push('/terms')
  return paths.map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.6 }))
}
