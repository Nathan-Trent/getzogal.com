# getzogal.com

The public site for Zogal. Static pages that read what the back office has
published and nothing else.

- Content: `GET {CONTENT_URL}/api/marketing/content` (published only), cached
  under the tag `content` for five minutes, refreshed on demand.
- Refresh: the back office POSTs `/api/revalidate` with header `x-zogal-key`
  after every publish. Set the same value here as `MARKETING_REVALIDATE_SECRET`.
- No database, no auth, no forms. The only server code is the revalidate route.

Copy `.env.example` to `.env.local`, then `npm install` and `npm run dev`.
