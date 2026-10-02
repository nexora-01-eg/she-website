import { SUBSECTIONS, COLORS } from '@/data/schema';
import { piecesBySubsection, piecesByColor, totalPieces, modelsCount, variantsCount } from '@/lib/inventory';
import { SEED_META } from '@/data/seed';

/**
 * Phase A home — intentional with few items (26 models).
 * Signature C (butterfly) is the progress indicator; shop-by-color is functional.
 * Hero media slot ready for real branch video (hero.media config) — typographic fallback until then.
 */
export default function Home() {
  const bySub = piecesBySubsection();
  const byColor = piecesByColor();
  return (
    <div className="wrap">
      {/* HERO — typographic + butterfly fallback. No fake storefront imagery. */}
      <section className="section" aria-label="SHE hero">
        <p className="latin-track" style={{ color: 'var(--she-pink)' }}>BE YOU .. ALWAYS</p>
        <h1>BE YOU.<br />ALWAYS.</h1>
        <p>شنط وشوز بستايلك انتي — اختاري لونك ومقاسك واطلبي على واتساب في دقيقة.</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <a className="btn btn-primary" href="/shop">تسوقي الآن / SHOP NOW</a>
          <a className="btn btn-ghost" href="/collections">EXPLORE THE COLLECTION</a>
        </div>
        <p style={{ opacity: 0.65, fontSize: 13, marginTop: 12 }}>
          <span className="digits">{totalPieces()}</span> قطعة · <span className="digits">{modelsCount()}</span> موديل · <span className="digits">{variantsCount()}</span> لون — كل الأرقام محسوبة من البيانات (seed {SEED_META.reportNo}).
        </p>
      </section>

      {/* SHOP BY WORLD — 7 sub-sections as editorial tiles with real counts */}
      <section className="section" aria-label="Shop by world">
        <h2>تسوقي حسب العالم</h2>
        <div className="tiles">
          {SUBSECTIONS.map((s) => (
            <a className="tile" key={s.key} href={`/world/${s.key}`}>
              <strong>{s.name.ar}</strong>
              <br /><small>{s.name.en}</small>
              <br /><span className="count digits">{bySub[s.key]}</span> <small>قطعة</small>
              {!s.sellableOnline && <><br /><small>واتساب فقط</small></>}
            </a>
          ))}
        </div>
      </section>

      {/* SHOP BY COLOR — real colors with real counts, filters shop */}
      <section className="section" aria-label="Shop by color">
        <h2>تسوقي بلونك</h2>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {COLORS.map((c) => (
            <a key={c.key} href={`/shop?color=${c.key}`} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <span className="color-dot" style={{ background: c.hex }} aria-hidden="true" />
              <span>{c.name.ar} <span className="count digits">({byColor[c.key] ?? 0})</span></span>
            </a>
          ))}
        </div>
        <p style={{ opacity: 0.6, fontSize: 13 }}>اختيار اللون بيفلتر الشوب — من غير ما يلون الصفحة كلها (B وظيفية هادية).</p>
      </section>
    </div>
  );
}
