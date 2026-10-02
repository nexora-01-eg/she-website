import { BRAND_STORY_BEATS, DEMO_BAGS } from '@/data/commercial';
import { ArtVisual, DemoProductCard } from '@/components/commercial';

/** Brand story — short visual beats, cinematic, temporary copy (§30). */
export default function StoryPage() {
  return (
    <div className="wrap">
      <section className="section">
        <p className="latin-track section-kicker">OUR STORY</p>
        <h1>حكاية SHE</h1>
        <p style={{ opacity: 0.7 }}>مش About Us طويلة — دي حكاية بصرية قصيرة.</p>
      </section>
      <section className="section story-beats" aria-label="Story beats">
        {BRAND_STORY_BEATS.map((b, i) => (
          <div key={i} className="story-beat">
            <ArtVisual art={b.art} label={b.en} ratio="16/9" large />
            <p><strong>{b.ar}</strong></p>
            <p lang="en" className="latin-track" style={{ opacity: 0.7, fontSize: 13 }}>{b.en}</p>
          </div>
        ))}
      </section>
      <section className="section" aria-label="Story statement">
        <h2>فضول ← اكتشاف ← رغبة ← اختيار ← تألق</h2>
        <p style={{ opacity: 0.75 }}>
          SHE هوية أزياء للست اللي عارفة هي مين. شنط وشوز مصممين عشان يعبروا عنك —
          من الشغل للسهرة، من الكاجوال للـ statement.
        </p>
      </section>
      <section className="section" aria-label="Story picks">
        <h2>قطع من الحكاية</h2>
        <div className="tiles">
          {DEMO_BAGS.slice(0, 4).map((p) => <DemoProductCard key={p.slug} p={p} />)}
        </div>
        <p style={{ marginTop: 12 }}><a className="btn btn-primary" href="/shop">تسوقي الحكاية</a></p>
      </section>
    </div>
  );
}
