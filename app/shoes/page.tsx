import { SHOE_CATEGORIES, DEMO_SHOES, productsByCollection, COLLECTIONS } from '@/data/commercial';
import { ArtVisual, DemoProductCard } from '@/components/commercial';

export const dynamic = 'force-dynamic'; // 40+ products: SSR (prerender OOMs small build worker)

/** Shoes — 8 categories + ≥40 demo products (§20, §47). */
export default function ShoesPage() {
  return (
    <div className="wrap">
      <section className="section" style={{ paddingBottom: 0 }}>
        <p className="latin-track section-kicker">SHOES</p>
        <h1>الشوز</h1>
        <p style={{ opacity: 0.7 }}>٨ فئات · <span className="digits">{DEMO_SHOES.length}</span> قطعة — من الهيلز للسنيكرز.</p>
      </section>

      <section className="section" aria-label="Shoe categories" style={{ paddingTop: 20 }}>
        <div className="cat-row">
          {SHOE_CATEGORIES.map((c) => {
            const n = DEMO_SHOES.filter((p) => p.category === c.key).length;
            return (
              <div key={c.key} id={c.key} className="cat-card">
                <ArtVisual art={c.art} label={c.name.en} kind="shoe" />
                <strong>{c.name.ar}</strong>
                <br /><small lang="en">{c.name.en}</small>
                <br /><small style={{ opacity: 0.65 }}>{c.blurb.ar}</small>
                <br /><small style={{ opacity: 0.6 }}><span className="digits">{n}</span> قطعة</small>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section" aria-label="All shoes" style={{ paddingTop: 0 }}>
        <h2>كل الشوز — <span className="digits">{DEMO_SHOES.length}</span></h2>
        <div className="tiles">
          {DEMO_SHOES.map((p) => <DemoProductCard key={p.slug} p={p} />)}
        </div>
      </section>

      <section className="section" aria-label="Shop by collection">
        <h2>تسوقي الشوز حسب العالم</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {COLLECTIONS.map((c) => (
            <a key={c.slug} className="btn btn-ghost" href={`/collections/${c.slug}`}>
              {c.name.ar} <span className="digits">({productsByCollection(c.slug).filter((p) => p.kind === 'shoe').length})</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
