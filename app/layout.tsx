import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Splash } from '@/components/motion'
import { appLink, getSite } from '@/lib/content'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://getzogal.com'),
  title: { default: 'Zogal — See it coming', template: '%s · Zogal' },
  description: 'Zogal reads your receipts and bank alerts, works out what is safe to spend today, and tells you before the month runs short.',
  openGraph: { type: 'website', siteName: 'Zogal', images: ['/brand/zogal-512.png'] },
  twitter: { card: 'summary' },
}

export const viewport: Viewport = { themeColor: '#062C1A' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite()
  const app = appLink(site.footer)
  return (
    <html lang="en" className={manrope.variable}>
      <body className="font-sans">
        <Splash />
        <Header appHref={app} />
        <main>{children}</main>
        <Footer content={site.footer} properties={site.properties} appHref={app} />
      </body>
    </html>
  )
}
