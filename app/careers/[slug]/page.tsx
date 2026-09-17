import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IconArrowLeft, IconMapPin, IconUsers } from '@tabler/icons-react'
import { getSite, slugOf } from '@/lib/content'
import { Container, Eyebrow, LeafButton } from '@/components/ui'
import { Reveal } from '@/components/motion'
import { Leaf } from '@/components/Leaf'
import { PageTop } from '@/components/PageTop'
import { Prose } from '@/components/Prose'

async function role(slug: string) {
  const { careers, openings } = await getSite()
  return { careers, role: openings.find((o) => o.title && slugOf(o.title) === slug) ?? null }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { role: r } = await role(slug)
  return { title: r ? `${r.title} · Careers` : 'Careers', description: r?.summary || undefined }
}

/** One role, on its own page: shareable, indexable, and where Apply lives. */
export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { careers, role: r } = await role(slug)
  if (!r) notFound()
  const open = r.open !== 'no' && Boolean(r.apply_link)
  return (
    <>
      <PageTop eyebrow={r.team || careers.eyebrow} title={r.title} line={r.summary} flourish={false}>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-muted">
          {r.location ? (
            <span className="inline-flex items-center gap-1"><IconMapPin size={15} /> {r.location}</span>
          ) : null}
          {r.type ? (
            <span className="inline-flex items-center gap-1"><IconUsers size={15} /> {r.type}</span>
          ) : null}
        </p>
      </PageTop>
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <Prose text={r.description ?? ''} />
              <div className="mt-8">
                <Link href="/careers" className="inline-flex items-center gap-1 text-[14px] font-semibold text-action">
                  <IconArrowLeft size={16} /> All roles
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="surface leaf-card sticky top-24 p-7">
                <span className="leaf-rest at-tr">
                  <Leaf size={128} />
                </span>
                <div className="relative">
                  <Eyebrow>{open ? 'Applications open' : 'Not open yet'}</Eyebrow>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    {open ? careers.how_body?.split('\n')[0] || 'Apply through the form; every application is read by a person.' : 'This role is listed ahead of applications opening. Check back, or write to us.'}
                  </p>
                  <div className="mt-5">
                    {open ? (
                      <LeafButton href={r.apply_link} className="w-full" track={`apply:${slug}`}>
                        Apply for this role
                      </LeafButton>
                    ) : (
                      <span className="inline-flex h-[50px] w-full items-center justify-center rounded-full bg-mint-soft text-[14px] font-semibold text-muted">Not open yet</span>
                    )}
                  </div>
                  {careers.email ? (
                    <p className="mt-4 text-[13px] text-muted">
                      Questions? <a href={`mailto:${careers.email}`} className="font-semibold text-action">{careers.email}</a>
                    </p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
