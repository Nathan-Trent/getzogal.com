/**
 * Plain text from the back office, set as a page. A blank line separates
 * paragraphs; a line starting with # is a heading; one starting with - is
 * a list item. No HTML is ever interpreted, so nothing typed there can
 * become script here.
 */
export function Prose({ text, className = '' }: { text: string; className?: string }) {
  const blocks = text.replace(/\r/g, '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  return (
    <div className={`grid gap-5 text-[17px] leading-relaxed text-ink ${className}`}>
      {blocks.map((b, i) => {
        if (b.startsWith('## ')) return <h3 key={i} className="mt-4 text-[20px] font-extrabold tracking-[-0.01em] text-forest">{b.slice(3)}</h3>
        if (b.startsWith('# ')) return <h2 key={i} className="mt-6 text-[26px] font-extrabold tracking-[-0.02em] text-forest">{b.slice(2)}</h2>
        const lines = b.split('\n')
        if (lines.every((l) => /^[-*] /.test(l))) {
          return (
            <ul key={i} className="grid list-disc gap-1.5 pl-6">
              {lines.map((l, j) => <li key={j}>{l.slice(2)}</li>)}
            </ul>
          )
        }
        return <p key={i}>{lines.join(' ')}</p>
      })}
    </div>
  )
}
