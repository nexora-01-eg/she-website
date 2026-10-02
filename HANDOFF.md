# SHE Website — Handoff Report for Claude

**Date:** 2026-10-02 · **Repo:** `she-website/` (Next.js 15 App Router + React 19 + TypeScript, no Tailwind — CSS variables)
**Scope completed:** Phase A (foundation) + Phase B (shop core on seed data). Phases C–F not started.
**Live state:** production build passes (`npm run build`), served with `npm start` on http://localhost:3000. `tsc --noEmit` clean.

---

## 1. What was built

### Phase A — Foundation
- Design tokens in `app/globals.css` (exact palette: pink `#F7008A`, green `#A8C833`, yellow `#FFC107`, orange `#FF5A00`, black scale, cream `#FFF8F2`; all via CSS vars; light/dark via `data-theme`).
- Fonts via `next/font/google`: Fraunces (Latin display serif) + IBM Plex Sans Arabic (Arabic + digits). Arabic rules enforced in CSS (no letter-spacing, no italic, line-height 1.9).
- Logo set `components/Logo.tsx`: butterfly + wordmark SVG (color/black/cream variants), used in header, preloader, footer, favicon.
- Signature concept C ("Butterfly Unfolds") picked: `components/Butterfly.tsx` scroll-progress butterfly. Shop-by-color kept functional only. Boutique Walk postponed until real branch video (`SHE_CONFIG.hero.media` slot ready).
- Layout shell: marquee (config-driven, active-only), sticky hide-on-scroll header, footer, ≤2s preloader (session-skipped), skip link.
- Data contract `data/schema.ts`: Section→Subsection→Model→Variant→SKU, 7 subsections (incl. `in-she-only` with `sellableOnline:false` = WhatsApp-inquiry only), 8 colors, stock rule 0=out/1=low/≥2=available, 5 delivery zones (cairo-giza, alex, delta-canal, upper, remote) replacing 27 governorates.
- Seed `data/seed.ts` (source:`'seed'`): exactly 934 pcs / 26 models / 64 variants, sub-totals and color-totals match report-004 screenshot (verified by `npm run verify-seed`). One price per model; no comparePrice from inventory; `trackSizes:false`.
- `/admin/import` (placeholder UI) + `middleware.ts` server-side Basic auth (`SHE_ADMIN_USER`/`SHE_ADMIN_PASS`, fail-closed 503 when unconfigured).
- Production guard `scripts/guard.mjs`: dev warns on seed/TODO; `build:strict` (`SHE_PRODUCTION_GUARD=strict`) fails the deploy. Verified failing correctly.

### Phase B — Shop core (all on seed data)
- `lib/shop.ts`: `SHOP_INDEX` (64 model×color variants), Arabic-normalized search (أ/إ/آ→ا، ى→ي، ة→ه، strips tashkeel), filters (section/sub/color+counts/price/in-stock/occasion), sorts (available/newest/price), `formatEGP` (Western digits + ج.م).
- `components/ShopView.tsx`: sticky filter bar, ⌘/Ctrl-K search, URL-synced filters (shareable). Used by `/shop`, `/bags`, `/shoes`, `/world/[sub]` (7 SSG paths).
- `components/ProductCard.tsx`: hover 2nd-angle, real color dots (sold-out greyed), price + availability (green متاح / orange آخر قطعة only when qty=1 / grey خلصت), My SHE ♥, add-to-Atelier or WhatsApp-inquiry for out/non-online items. No fake urgency anywhere.
- `/product/[slug]` (dynamic SSR): gallery renders ONLY existing angles (scroll-snap, never empty slots), color switch via `?color=` (updates images/availability/URL/order state), `BuyBox` with size chips (trackSizes=false: no per-size stock, chosen size injected into order/WA message), shoe size guide, progressive `<details>` info, "Complete the look" (same color / bag↔shoes / same occasion, real data only), mobile sticky buy bar, live Product JSON-LD.
- My SHE (`/my-she`, localStorage + send-picks-to-WhatsApp), Atelier drawer + `/atelier` page (localStorage cart, TODO delivery/fees shown as يُحدد, two exits), `/checkout` (guest one-screen, Egyptian mobile regex `01[0125]\d{8}`, zone select with TODO fees, COD default, express WhatsApp-only option), `POST /api/orders` (validates items against seed prices, 1–9 qty, stores `data/orders/SHE-YYYYMMDD-XXXXX.json` with UTM, returns order code + prefilled wa.me href), `/order/[code]` confirmation.
- `lib/wa.ts`: all WhatsApp links from `SHE_CONFIG.brand.whatsapp` (currently TODO → `wa.me/?text=`, UI badges "قريباً"). Floating WA button included.
- `/admin/images`: missing-images report page (protected).

## 2. Image pipeline (important)
- `D:\BAGS SBS\WEB` has 32 campaign/post files (no product shots, no spec naming) → `data/image-mapping.csv` (33 lines incl. header: filename,suggestedModelCode,color,angle,confidence,ownerConfirmed,notes) for the owner to confirm. Nothing renamed.
- `BAGS SBS.zip` (492MB) extracted → **132 real product files across exactly 26 real model codes**: SBJ×9 (bags), SBS×9 (evening bags, black/gold/silver), SE/SX/SSS×6 (shoes), SE-500/501 (sets, 5/4 colors). Mojibake Arabic parent dirs renamed to `bags-SBJ/`, `evening-SBS/`, `sets-SE/` (inner files untouched); zip inner `BAGS SBS/` → `she/` for clean URLs.
- `scripts/catalog-zip.mjs` (`npm run catalog`) regenerates `data/zip-catalog.json` (coverage + per-file url/realCode/color/kind), the CSV, and `data/missing-images.json`.
- `lib/images.ts` resolver: seed codes ≠ real codes, so matching is family+color with `illustrative:true` badge ("صورة توضيحية"); 17 sub×color cells (all denim, gold/silver shoes) fall back to generic fronts; zero confirmed fronts until owner CSV + inventory export arrive.
- **491MB originals live OUTSIDE git** (`D:\BAGS SBS\products-staging`), served via Windows junction `public/products` (recreate with `npm run link-images`; gitignored). Phase E must move these to a CDN with AVIF/WebP + responsive sizes (current heroes ~5MB each).

## 3. Environment workarounds (revert on good hardware/CI)
- Build machine: 8GB RAM, ~1GB free → static worker OOMs. (a) `/product/[slug]` is `force-dynamic` (SSR + metadata intact; re-enable `generateStaticParams` in Phase E). (b) `next.config.mjs` has `typescript.ignoreBuildErrors:true` with comment; types verified via `npm run lint` (clean). (c) Dev server (`next dev`) is unstable here (OOM on compile); use `npm run build` + `npm start` for demos.
- Build: First Load JS 103–124KB (budget ~170KB OK). Strict guard fails correctly on seed/TODO.

## 4. ⚠️ External overwrite discovered 2026-10-02 ~23:35
`app/page|bags|shoes|product/[slug]|collections|offers|my-she|story|social`, `components/Hero|Footer|Header|Marquee|commercial|DemoProductDetail`, `data/commercial.ts` were overwritten with a **demo commercial layer (invented products, comparePrice discounts, LIMITED labels)** — violates the hard NOs and bypasses seed counts. One-line type fix applied (`DemoProductDetail.tsx:17` angle state + `'interior'`) so it builds. **Decision needed: keep demo layer or revert to seed-driven Phase B.** (Phase B files `lib/shop|images|atelier|wa`, `ShopView|ProductCard|BuyBox|AtelierDrawer`, `/checkout`, `/api/orders`, `/order/[code]`, `/world/[sub]`, `/admin/*` are intact.)

## 5. Still TODO (all guard-blocked, shown as يُحدد in UI)
WhatsApp number · 5-zone fees · free-delivery threshold · delivery times/returns/branches/hours · Meta/TikTok/GA4 IDs · real inventory export (locks contract; verify 934/26/64 + size column + price-per-model) · owner-confirmed `image-mapping.csv` · branch video (Phase C hero) · Supabase for orders/Inner Circle (currently JSON files) · offers/reviews/collections/social content (Phase D) · Experience Lab, adaptive tiers, analytics (Phase E).

## 6. Commands
`npm run dev` (unstable here) · `npm run build` → `npm start` (use this) · `npm run lint` · `npm run verify-seed` · `npm run catalog` · `npm run link-images` · `SHE_ADMIN_USER/PASS` for /admin.
