import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { IconArrowUpRight, IconMapPin, IconUsers } from '@tabler/icons-react'
import { getSite } from '@/lib/content'
import { Container, Eyebrow, LeafButton } from '@/components/ui'
import { Reveal } from '@/components/motion'
import { Leaf } from '@/components/Leaf'
import { PageTop } from '@/components/PageTop'
import { Prose } from '@/components/Prose'

export async function generateMetadata(): Promise<Metadata> {
  const { careers } = await getSite()
  return { title: careers.title || 'Careers', description: careers.intro || undefined }
}

/**
 * Openings, each with an Apply button that goes to its own form. No CV
 * ever lands on Zogal: the form belongs to a service built for that.
 */
export default async function CareersPage() {
  const { careers, openings } = await getSite()
  if (!careers.title) notFound()
  const roles = openings.filter((o) => o.title)
  return (
    <>
      <PageTop eyebrow={careers.eyebrow} title={careers.title} line={careers.intro} />
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              {careers.how_title ? <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-forest">{careers.how_title}</h2> : null}
              {careers.how_body ? <Prose text={careers.how_body} className="mt-4 text-[16px]" /> : null}
              {careers.email ? (
                <p className="mt-6 text-[15px] text-muted">
                  Nothing that fits? <a href={`mailto:${careers.email}`} className="font-semibold text-action">{careers.email}</a>
                </p>
              ) : null}
            </Reveal>
            <div className="grid gap-4">
              {roles.length === 0 ? (
                <Reveal>
                  <div className="surface leaf-card p-7">
                    <span className="leaf-rest">
                      <Leaf size={128} />
                    </span>
                    <h3 className="relative text-[20px] font-extrabold tracking-[-0.01em] text-forest">{careers.none_title || 'No openings right now'}</h3>
                    {careers.none_body ? <p className="relative mt-2 text-[15px] leading-relaxed text-muted">{careers.none_body}</p> : null}
                  </div>
                </Reveal>
              ) : (
                roles.map((o, i) => (
                  <Reveal key={o.title + i} delay={i * 0.06}>
                    <article className="surface surface-hover leaf-card p-7">
                      <span className={`leaf-rest ${i % 2 ? 'at-tr' : ''}`}>
                        <Leaf size={128} />
                      </span>
                      <div className="relative">
                        {o.team ? <Eyebrow>{o.team}</Eyebrow> : null}
                        <h3 className="mt-2 text-[22px] font-extrabold tracking-[-0.02em] text-forest">{o.title}</h3>
                        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-muted">
                          {o.location ? (
                            <span className="inline-flex items-center gap-1"><IconMapPin size={15} /> {o.location}</span>
                          ) : null}
                          {o.type ? (
                            <span className="inline-flex items-center gap-1"><IconUsers size={15} /> {o.type}</span>
                          ) : null}
                        </p>
                        {o.description ? <Prose text={o.description} className="mt-4 text-[15px]" /> : null}
                        {o.apply_link ? (
                          <div className="mt-6">
                            <LeafButton href={o.apply_link}>
                              Apply <IconArrowUpRight size={18} />
                            </LeafButton>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </Reveal>
                ))
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
