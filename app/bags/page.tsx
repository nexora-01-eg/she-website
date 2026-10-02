import { BAG_CATEGORIES, DEMO_BAGS, productsByCollection, COLLECTIONS } from '@/data/commercial';
import { ArtVisual, DemoProductCard } from '@/components/commercial';

export const dynamic = 'force-dynamic'; // 40+ products: SSR (prerender OOMs small build worker)

/** Bags — 8 categories + ≥40 demo products (§19, §46). */
export default function BagsPage() {
  return (
    <div className="wrap">
      <section className="section" style={{ paddingBottom: 0 }}>
        <p className="latin-track section-kicker">BAGS</p>
        <h1>الشنط</h1>
        <p style={{ opacity: 0.7 }}>٨ فئات · <span className="digits">{DEMO_BAGS.length}</span> قطعة — اختاري فئتك أو ادخلي أي عالم.</p>
      </section>

      <section className="section" aria-label="Bag categories" style={{ paddingTop: 20 }}>
        <div className="cat-row">
          {BAG_CATEGORIES.map((c) => {
            const n = DEMO_BAGS.filter((p) => p.category === c.key).length;
            return (
              <div key={c.key} id={c.key} className="cat-card">
                <ArtVisual art={c.art} label={c.name.en} kind="bag" />
                <strong>{c.name.ar}</strong>
                <br /><small lang="en">{c.name.en}</small>
                <br /><small style={{ opacity: 0.65 }}>{c.blurb.ar}</small>
                <br /><small style={{ opacity: 0.6 }}><span className="digits">{n}</span> قطعة</small>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section" aria-label="All bags" style={{ paddingTop: 0 }}>
        <h2>كل الشنط — <span className="digits">{DEMO_BAGS.length}</span></h2>
        <div className="tiles">
          {DEMO_BAGS.map((p) => <DemoProductCard key={p.slug} p={p} />)}
        </div>
      </section>

      <section className="section" aria-label="Shop by collection">
        <h2>تسوقي الشنط حسب العالم</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {COLLECTIONS.map((c) => (
            <a key={c.slug} className="btn btn-ghost" href={`/collections/${c.slug}`}>
              {c.name.ar} <span className="digits">({productsByCollection(c.slug).filter((p) => p.kind === 'bag').length})</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
