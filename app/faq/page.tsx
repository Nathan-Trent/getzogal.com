import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSite } from '@/lib/content'
import { Container } from '@/components/ui'
import { Reveal } from '@/components/motion'
import { PageTop } from '@/components/PageTop'
import { Accordion } from '@/components/sections/Accordion'

export async function generateMetadata(): Promise<Metadata> {
  const { faq } = await getSite()
  return { title: faq.title || 'FAQs', description: faq.intro || undefined }
}

export default async function FaqPage() {
  const { faq, faqs } = await getSite()
  const items = faqs.filter((f) => f.q && f.a)
  if (items.length === 0) notFound()
  return (
    <>
      <PageTop eyebrow={faq.eyebrow} title={faq.title || 'Questions'} line={faq.intro} />
      <section className="pb-16 sm:pb-24">
        <Container>
          <Reveal>
            <div className="max-w-[760px]">
              <Accordion items={items.map((f) => ({ q: f.q, a: f.a }))} />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
