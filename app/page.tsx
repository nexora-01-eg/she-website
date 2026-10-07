import { SUBSECTIONS, COLORS } from '@/data/schema';
import { piecesBySubsection, piecesByColor, totalPieces, modelsCount, variantsCount } from '@/lib/inventory';
import { SEED_META } from '@/data/seed';
import { Hero } from '@/components/Hero';

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
      {/* HERO — signature experience (Concept C + editorial rails). No fake storefront imagery. */}
      <Hero pieces={totalPieces()} models={modelsCount()} variants={variantsCount()} />
      <p style={{ opacity: 0.55, fontSize: 12 }}>seed {SEED_META.reportNo} — الأرقام محسوبة من البيانات.</p>

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
