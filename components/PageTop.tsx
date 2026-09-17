import { Container, Eyebrow } from './ui'
import { Reveal, Flourish } from './motion'
import { Leaf } from './Leaf'

/**
 * The top of every inner page: eyebrow, title, a line, the flourish, and
 * a leaf at rest off the corner. The same life as the home page, one
 * breath of it, then the page.
 */
export function PageTop({ eyebrow, title, line, children, flourish = true }: { eyebrow?: string; title: string; line?: string; children?: React.ReactNode; flourish?: boolean }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-10 sm:pt-20 sm:pb-14">
      <Leaf size={420} className="pointer-events-none absolute -right-28 -top-24 opacity-[0.07]" />
      <Container className="relative">
        <Reveal>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="mt-3 max-w-[820px] text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest sm:text-[60px]">{title}</h1>
          {flourish ? (
            <div className="-ml-2 mt-1 w-[220px] [&>div]:mx-0 [&>div]:mt-2 [&>div]:justify-start">
              <Flourish />
            </div>
          ) : null}
          {line ? <p className="mt-3 max-w-[560px] text-[17px] leading-relaxed text-muted sm:text-[19px]">{line}</p> : null}
          {children}
        </Reveal>
      </Container>
    </section>
  )
}
