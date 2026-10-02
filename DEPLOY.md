# SHE — Deploy to Vercel preview (builds on Vercel, not the 8GB box)

## One-time setup
1. Push this repo to GitHub (root = `she-website/`).
2. Vercel → Add New Project → Import the repo. Framework: Next.js (auto).
3. Environment Variables (Project → Settings → Environment Variables):
   - `SHE_ADMIN_USER`, `SHE_ADMIN_PASS` (long random; required — `/admin/*` returns 503 without them)
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (from Supabase → Settings → API; run `supabase/schema.sql` once first)
   - Do NOT set `SHE_PRODUCTION_GUARD=strict` on Preview (seed/TODO still present → build would fail by design). Set it on Production only, after the real export + config land.
   - Optional later: Meta/TikTok/GA4 IDs go in `data/config.ts`, not env.
4. Deploy → you get a Preview URL like `https://she-website-xyz.vercel.app`. Every push gets a fresh preview.

## Notes
- Images: optimized AVIF/WebP in `public/p/` are committed and served by the preview. Originals (491MB) never deploy — Phase E moves serving to a CDN.
- Products use ISR (`revalidate = 3600`); `/world/*` prerendered; `/order/*` + checkout dynamic.
- Orders without Supabase keys on Vercel: API returns 503 with a WhatsApp fallback message (never silently dropped). Local dev falls back to `data/orders/*.json`.

## Instagram in-app browser checklist (run on the Preview URL from an IG DM link)
- [ ] Home loads < 3s on 4G, hero readable in first two screens, SHOP NOW reachable
- [ ] No 100vh gaps (we use `dvh`), safe-area respected, no blocked popups
- [ ] Product → color/size → WhatsApp order completes; message prefilled correctly
- [ ] Checkout validates Egyptian mobile, order code page shows, wa.me opens in external browser
- [ ] Marquee/header/footer render RTL correctly; no console errors (Safari remote debug if possible)
