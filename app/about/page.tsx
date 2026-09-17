import type { Metadata } from 'next'
import Image from 'next/image'
import { getSite } from '@/lib/content'
import { Container, Eyebrow } from '@/components/ui'
import { Reveal } from '@/components/motion'
import { Prose } from '@/components/Prose'

export const metadata: Metadata = { title: 'About', description: 'Who makes Zogal, and why.' }

export default async function AboutPage() {
  const { about } = await getSite()
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-3 text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest sm:text-[56px]">{about.title}</h1>
            <Prose text={about.body} className="mt-8" />
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
  )
}
