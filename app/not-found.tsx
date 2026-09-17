import { getSite } from '@/lib/content'
import { Container, LeafButton } from '@/components/ui'

export default async function NotFound() {
  const { sitewide } = await getSite()
  return (
    <section className="py-32">
      <Container className="text-center">
        <h1 className="text-[40px] font-extrabold tracking-[-0.03em] text-forest">{sitewide.notfound_title || 'Nothing here.'}</h1>
        {sitewide.notfound_body ? <p className="mt-3 text-muted">{sitewide.notfound_body}</p> : null}
        <div className="mt-8 flex justify-center">
          <LeafButton href="/">{sitewide.notfound_button || 'Home'}</LeafButton>
        </div>
      </Container>
    </section>
  )
}
