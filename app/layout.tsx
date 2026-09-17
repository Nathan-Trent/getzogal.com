import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Splash } from '@/components/motion'
import { appLink, getSite, navFor } from '@/lib/content'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const title = site.home.hero_title ? `Zogal — ${site.home.hero_title.replace(/\.$/, '')}` : 'Zogal'
  return {
    metadataBase: new URL('https://getzogal.com'),
    title: { default: title, template: '%s · Zogal' },
    description: site.home.hero_line || undefined,
    openGraph: { type: 'website', siteName: 'Zogal', images: ['/brand/zogal-512.png'] },
    twitter: { card: 'summary' },
  }
}

export const viewport: Viewport = { themeColor: '#062C1A' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite()
  return (
    <html lang="en" className={manrope.variable}>
      <body className="font-sans">
        <Splash />
        <Header appHref={appLink(site)} button={site.sitewide.header_button} nav={navFor(site)} />
        <main>{children}</main>
        <Footer site={site} appHref={appLink(site)} nav={navFor(site)} />
      </body>
    </html>
  )
}
