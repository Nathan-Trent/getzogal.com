import type { Metadata } from 'next'
import { getSite } from '@/lib/content'
import { Container } from '@/components/ui'
import { Reveal } from '@/components/motion'
import { PageTop } from '@/components/PageTop'
import { Prose } from '@/components/Prose'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  return { title: site.legal_terms.title || 'Terms of service' }
}

export default async function TermsPage() {
  const site = await getSite()
  const page = site.legal_terms
  return (
    <>
      <PageTop title={page.title || 'Terms of service'} line={page.updated ? `Last updated ${page.updated}` : undefined} flourish={false} />
      <section className="pb-16 sm:pb-24">
        <Container>
          <Reveal>
            <div className="max-w-[720px]">
              <Prose text={page.body ?? ''} />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
