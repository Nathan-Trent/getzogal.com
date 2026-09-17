import { Container, LeafButton } from '@/components/ui'

export default function NotFound() {
  return (
    <section className="py-32">
      <Container className="text-center">
        <h1 className="text-[40px] font-extrabold tracking-[-0.03em] text-forest">Nothing here.</h1>
        <p className="mt-3 text-muted">That page does not exist, or has moved.</p>
        <div className="mt-8 flex justify-center">
          <LeafButton href="/">Back to the start</LeafButton>
        </div>
      </Container>
    </section>
  )
}
