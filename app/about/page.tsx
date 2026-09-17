import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getSite } from '@/lib/content'
import { Container } from '@/components/ui'
import { Reveal } from '@/components/motion'
import { PageTop } from '@/components/PageTop'
import { Prose } from '@/components/Prose'

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getSite()
  return { title: about.title || 'About' }
}

export default async function AboutPage() {
  const { about } = await getSite()
  if (!about.title) notFound()
  return (
    <>
      <PageTop eyebrow={about.eyebrow} title={about.title} />
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <Prose text={about.body ?? ''} />
            </Reveal>
            {about.image ? (
              <Reveal delay={0.15}>
                <div className="surface overflow-hidden">
                  <Image src={about.image} alt="" width={800} height={1000} className="h-auto w-full object-cover" />
                </div>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </section>
    </>
  )
}
