import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { IconClock, IconMail, IconMapPin, IconPhone } from '@tabler/icons-react'
import { getSite } from '@/lib/content'
import { Container } from '@/components/ui'
import { Reveal } from '@/components/motion'
import { PageTop } from '@/components/PageTop'
import { ContactForm } from '@/components/sections/ContactForm'

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getSite()
  return { title: contact.title || 'Contact', description: contact.intro || undefined }
}

export default async function ContactPage() {
  const { contact } = await getSite()
  if (!contact.title) notFound()
  const ways = [
    contact.email ? { Icon: IconMail, text: contact.email, href: `mailto:${contact.email}` } : null,
    contact.phone ? { Icon: IconPhone, text: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, '')}` } : null,
    contact.address ? { Icon: IconMapPin, text: contact.address, href: '' } : null,
    contact.hours ? { Icon: IconClock, text: contact.hours, href: '' } : null,
  ].filter((w): w is { Icon: typeof IconMail; text: string; href: string } => Boolean(w))
  return (
    <>
      <PageTop eyebrow={contact.eyebrow} title={contact.title} line={contact.intro} />
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <ul className="grid gap-4 text-[16px] text-ink">
                {ways.map((w) => (
                  <li key={w.text} className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-mint-soft text-action">
                      <w.Icon size={20} />
                    </span>
                    {w.href ? (
                      <a href={w.href} className="pt-2 font-semibold text-forest hover:text-action">{w.text}</a>
                    ) : (
                      <span className="whitespace-pre-line pt-2">{w.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <ContactForm copy={contact} />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
