import { Hero } from '@/components/Hero';
import { ArtVisual, DemoProductCard } from '@/components/commercial';
import {
  COLLECTIONS, BAG_CATEGORIES, SHOE_CATEGORIES,
  DEMO_BAGS, DEMO_SHOES, ALL_DEMO_PRODUCTS,
  DEMO_REVIEWS, DEMO_SOCIAL, BRAND_STORY_BEATS,
  productsByCollection,
} from '@/data/commercial';

/**
 * SHE home — full commercial flow (§44):
 * HERO → COLLECTIONS → BAGS → SHOES → FEATURED → STORY → REVIEWS → INNER CIRCLE → SOCIAL → FOOTER
 * All content from data/commercial.ts (swappable). Counts computed, never hardcoded.
 */
export default function Home() {
  const featured = ALL_DEMO_PRODUCTS.slice(0, 8);
  return (
    <div>
      <Hero />

      {/* COLLECTIONS — 7 medium editorial tiles */}
      <section className="wrap section" aria-label="Collections">
        <p className="latin-track section-kicker">THE WORLDS</p>
        <h2>٧ عوالم · كل عالم حكاية</h2>
        <p style={{ opacity: 0.7 }}>كل مجموعة عالم تجريبي صغير — ادخلي العالم اللي شبهك.</p>
        <div className="coll-grid">
          {COLLECTIONS.map((c) => {
            const n = productsByCollection(c.slug).length;
            return (
              <a key={c.slug} className="coll-card" href={`/collections/${c.slug}`}>
                <ArtVisual art={c.art} label={c.name.en} />
                <div className="coll-card-body">
                  <small className="latin-track" style={{ color: c.art.accent === '#111111' ? 'var(--she-pink)' : c.art.accent }}>
                    {c.number}
                  </small>
                  <h3>{c.name.ar} · <span lang="en">{c.name.en}</span></h3>
                  <small style={{ opacity: 0.7 }}>{c.theme.ar}</small>
                  <br /><small style={{ opacity: 0.6 }}><span className="digits">{n}</span> قطعة</small>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* BAGS — 8 categories + featured */}
      <section className="wrap section" aria-label="Bags">
        <p className="latin-track section-kicker">BAGS</p>
        <h2>الشنط — ٨ عوالم</h2>
        <div className="cat-row">
          {BAG_CATEGORIES.map((c) => (
            <a key={c.key} className="cat-card" href={`/bags#${c.key}`}>
              <ArtVisual art={c.art} label={c.name.en} kind="bag" />
              <strong>{c.name.ar}</strong>
              <br /><small lang="en">{c.name.en}</small>
              <br /><small style={{ opacity: 0.65 }}>{c.blurb.ar}</small>
            </a>
          ))}
        </div>
        <div className="tiles" style={{ marginTop: 20 }}>
          {DEMO_BAGS.slice(0, 4).map((p) => <DemoProductCard key={p.slug} p={p} />)}
        </div>
        <p style={{ marginTop: 12 }}><a className="btn btn-ghost" href="/bags">كل الشنط — <span className="digits">{DEMO_BAGS.length}</span> قطعة</a></p>
      </section>

      {/* SHOES — 8 categories + featured */}
      <section className="wrap section" aria-label="Shoes">
        <p className="latin-track section-kicker">SHOES</p>
        <h2>الشوز — ٨ عوالم</h2>
        <div className="cat-row">
          {SHOE_CATEGORIES.map((c) => (
            <a key={c.key} className="cat-card" href={`/shoes#${c.key}`}>
              <ArtVisual art={c.art} label={c.name.en} kind="shoe" />
              <strong>{c.name.ar}</strong>
              <br /><small lang="en">{c.name.en}</small>
              <br /><small style={{ opacity: 0.65 }}>{c.blurb.ar}</small>
            </a>
          ))}
        </div>
        <div className="tiles" style={{ marginTop: 20 }}>
          {DEMO_SHOES.slice(0, 4).map((p) => <DemoProductCard key={p.slug} p={p} />)}
        </div>
        <p style={{ marginTop: 12 }}><a className="btn btn-ghost" href="/shoes">كل الشوز — <span className="digits">{DEMO_SHOES.length}</span> قطعة</a></p>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="wrap section" aria-label="Featured products">
        <p className="latin-track section-kicker">FEATURED</p>
        <h2>مختارات SHE</h2>
        <div className="tiles">
          {featured.map((p) => <DemoProductCard key={p.slug} p={p} />)}
        </div>
      </section>

      {/* BRAND STORY — short visual beats */}
      <section className="wrap section" aria-label="Brand story">
        <p className="latin-track section-kicker">SHE WORLD</p>
        <h2>SHE مش مجرد ستور</h2>
        <div className="story-beats">
          {BRAND_STORY_BEATS.map((b, i) => (
            <div key={i} className="story-beat">
              <ArtVisual art={b.art} label={b.en} ratio="16/9" large />
              <p lang="ar"><strong>{b.ar}</strong></p>
              <p lang="en" className="latin-track" style={{ opacity: 0.7, fontSize: 13 }}>{b.en}</p>
            </div>
          ))}
        </div>
        <p><a className="btn btn-ghost" href="/story">الحكاية كاملة</a></p>
      </section>

      {/* REVIEWS — editorial, not grid cards */}
      <section className="wrap section" aria-label="Reviews">
        <p className="latin-track section-kicker">LOVE LETTERS</p>
        <h2>قالوا عن SHE</h2>
        <div className="reviews">
          {DEMO_REVIEWS.slice(0, 3).map((r) => (
            <figure key={r.name} className="review">
              <blockquote>“{r.quote.ar}”</blockquote>
              <figcaption>— {r.name} · {r.city} · <small>{r.piece}</small></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* INNER CIRCLE — invitation, not newsletter */}
      <section className="wrap section inner-circle" aria-label="Inner Circle">
        <p className="latin-track section-kicker">INNER CIRCLE</p>
        <h2>الدايرة القريبة</h2>
        <p>دخول مبكر · إصدارات خاصة · دعوات تجارب SHE. دي مش نشرة بريدية — دي دعوة.</p>
        <a className="btn btn-primary" href="/inner-circle">اطلبي دعوتك</a>
      </section>

      {/* SOCIAL WORLD */}
      <section className="wrap section" aria-label="Social world">
        <p className="latin-track section-kicker">SHE SOCIAL WORLD</p>
        <h2>عالم SHE الاجتماعي</h2>
        <div className="social-row">
          {DEMO_SOCIAL.slice(0, 6).map((s) => (
            <div key={s.id} className="social-tile">
              <ArtVisual art={s.art} label={s.caption.en} />
              <small>{s.caption.ar} · <em>{s.kind}</em></small>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12 }}><a className="btn btn-ghost" href="/social">كل اللحظات</a></p>
      </section>
    </div>
  );
}
