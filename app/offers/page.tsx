import { DEMO_OFFERS, demoProductBySlug, offerPrice } from '@/data/commercial';
import { ArtVisual } from '@/components/commercial';

export const dynamic = 'force-dynamic'; // 100 offers: SSR (prerender OOMs small build worker)

/**
 * Offers — ≥100 demo offer cards (§21, §48), each with unique mechanic.
 * Every offer explains: product, original, offer price, discount, conditions, CTA.
 * LIMITED only where configured (§21).
 */
export default function OffersPage() {
  return (
    <div className="wrap">
      <section className="section" style={{ paddingBottom: 0 }}>
        <p className="latin-track section-kicker">OFFERS</p>
        <h1>العروض — <span className="digits">{DEMO_OFFERS.length}</span></h1>
        <p style={{ opacity: 0.7 }}>كل عرض بميكانيكا مختلفة: نسبة · فئة · مجموعة · باندل · موسمي · كود · إصدار محدود.</p>
      </section>

      <section className="section" aria-label="All offers">
        <div className="tiles offers-grid">
          {DEMO_OFFERS.map((o) => {
            const p = demoProductBySlug(o.productSlug);
            if (!p) return null;
            const { price, compare } = offerPrice(p, o.discountPct);
            return (
              <article key={o.slug} className="tile offer-card">
                <ArtVisual art={p.art} label={p.name.en} kind={p.kind} />
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="offer-label">-{o.discountPct}%</span>
                  <small style={{ opacity: 0.65 }}>{o.mechanic.ar}</small>
                  {o.limited && <span className="limited-label">LIMITED</span>}
                </div>
                <h3 style={{ margin: '8px 0 2px', fontSize: '1rem' }}>
                  <a href={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>{p.name.ar}</a>
                </h3>
                <small style={{ opacity: 0.6 }}>{p.code} · <span lang="en">{o.mechanic.en}</span></small>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <strong className="price digits">{price.toLocaleString('en-US')} EGP</strong>
                  <s style={{ opacity: 0.5 }} className="digits">{compare.toLocaleString('en-US')}</s>
                </div>
                <p style={{ fontSize: 13, opacity: 0.75 }}>{o.conditions.ar}</p>
                {o.code && (
                  <p style={{ fontSize: 13 }}>
                    الكود: <code className="digits" style={{ background: 'color-mix(in srgb, var(--fg) 8%, transparent)', padding: '2px 8px', borderRadius: 6 }}>{o.code}</code>
                  </p>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <a className="btn btn-primary" style={{ flex: 1, padding: '8px 10px', fontSize: 13 }} href={`/product/${p.slug}`}>
                    تسوقي العرض
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
