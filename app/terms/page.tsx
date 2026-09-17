import type { Metadata } from 'next'
import { getSite } from '@/lib/content'
import { Container } from '@/components/ui'
import { Prose } from '@/components/Prose'

export const metadata: Metadata = { title: 'Terms of service' }

export default async function TermsPage() {
  const site = await getSite()
  const page = site.legal_terms
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest sm:text-[48px]">{page.title}</h1>
          {page.updated ? <p className="mt-3 text-[14px] text-muted">Last updated {page.updated}</p> : null}
          <Prose text={page.body} className="mt-10" />
        </div>
      </Container>
    </section>
  )
}
