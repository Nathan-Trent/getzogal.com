import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

/**
 * The back office calls this after a publish, with the shared key in the
 * x-zogal-key header. Every page reads content under one tag, so one call
 * refreshes the whole site. Without the key set on this side, nothing can
 * refresh on demand; the hourly revalidate still runs.
 */
export async function POST(request: Request) {
  const expected = process.env.MARKETING_REVALIDATE_SECRET
  if (!expected) return NextResponse.json({ error: 'not configured' }, { status: 503 })
  const given = request.headers.get('x-zogal-key') ?? ''
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 })
  }
  revalidateTag('content', 'max')
  return NextResponse.json({ ok: true, at: new Date().toISOString() })
}

function timingSafeEqual(a: string, b: string): boolean {
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}
