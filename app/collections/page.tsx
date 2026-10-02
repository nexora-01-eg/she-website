import { COLLECTIONS, productsByCollection } from '@/data/commercial';
import { ArtVisual } from '@/components/commercial';

/** Collections index — 7 medium editorial tiles (§14, §45). */
export default function CollectionsPage() {
  return (
    <div className="wrap">
      <section className="section">
        <p className="latin-track section-kicker">THE WORLDS</p>
        <h1>المجموعات — ٧ عوالم</h1>
        <p style={{ opacity: 0.7 }}>كل مجموعة عالم تجريبي صغير بهوية بصرية خاصة. اختاري عالمك وادخليه.</p>
        <div className="coll-grid">
          {COLLECTIONS.map((c) => {
            const n = productsByCollection(c.slug).length;
            return (
              <a key={c.slug} className="coll-card" href={`/collections/${c.slug}`}>
                <ArtVisual art={c.art} label={c.name.en} large />
                <div className="coll-card-body">
                  <small className="latin-track">{c.number} · <span lang="en">{c.graphic}</span></small>
                  <h2 style={{ margin: '6px 0 2px' }}>{c.name.ar} · <span lang="en">{c.name.en}</span></h2>
                  <p style={{ opacity: 0.7, margin: '4px 0' }}>{c.tagline.ar}</p>
                  <small style={{ opacity: 0.6 }}>{c.theme.ar} · <span className="digits">{n}</span> قطعة</small>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
