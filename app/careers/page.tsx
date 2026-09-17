import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSite } from '@/lib/content'
import { Container, Eyebrow } from '@/components/ui'
import { Reveal } from '@/components/motion'
import Image from 'next/image'
import { PageTop } from '@/components/PageTop'
import { Prose } from '@/components/Prose'
import { Openings, type Filters } from '@/components/sections/Openings'

export async function generateMetadata(): Promise<Metadata> {
  const { careers } = await getSite()
  return { title: careers.title || 'Careers', description: careers.intro || undefined }
}

/**
 * Careers: the title; how we hire beside the tree; then every opening as
 * a row, filtered and paged. Apply goes to the role's own form; no CV
 * ever lands on Zogal.
 */
export default async function CareersPage({ searchParams }: { searchParams: Promise<Filters> }) {
  const [{ careers, openings }, filters] = await Promise.all([getSite(), searchParams])
  if (!careers.title) notFound()
  const roles = openings.filter((o) => o.title)
  return (
    <>
      <PageTop eyebrow={careers.eyebrow} title={careers.title} line={careers.intro} />

      {careers.how_title || careers.how_body ? (
        <section className="pb-14">
          <Container>
            <Reveal>
              <div className="surface leaf-card overflow-hidden">
                <div className="grid items-center gap-8 p-8 sm:p-12 md:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <Eyebrow>{careers.how_eyebrow || 'How we hire'}</Eyebrow>
                    {careers.how_title ? <h2 className="mt-3 text-[30px] font-extrabold leading-[1.08] tracking-[-0.02em] text-forest sm:text-[38px]">{careers.how_title}</h2> : null}
                    {careers.how_body ? <Prose text={careers.how_body} className="mt-5 text-[16px]" /> : null}
                    {careers.email ? (
                      <p className="mt-6 text-[15px] text-muted">
                        Nothing that fits? <a href={`mailto:${careers.email}`} className="font-semibold text-action">{careers.email}</a>
                      </p>
                    ) : null}
                  </div>
                  {/* One of the leaves from the app's own landing page, at rest. */}
                  <div className="leaf-float mx-auto w-full max-w-[320px]">
                    <Image src="/brand/leaf.webp" alt="" width={800} height={800} className="h-auto w-full" />
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      ) : null}

      <section className="pb-16 sm:pb-24">
        <Container>
          <Reveal>
            <Eyebrow>{careers.openings_eyebrow || 'Open roles'}</Eyebrow>
            <h2 className="mt-3 text-[30px] font-extrabold leading-[1.08] tracking-[-0.02em] text-forest sm:text-[38px]">{careers.openings_title || 'Where you could fit'}</h2>
          </Reveal>
          <div className="mt-8">
            <Openings roles={roles} filters={filters} none={{ title: careers.none_title || 'No openings right now', body: careers.none_body || '' }} />
          </div>
        </Container>
      </section>
    </>
  )
}
