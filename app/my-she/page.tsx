'use client';
import { useEffect, useState } from 'react';
import { useMyShe } from '@/lib/atelier';
import { formatEGP } from '@/lib/shop';
import { waLink } from '@/lib/wa';
import { demoProductBySlug, COLLECTIONS } from '@/data/commercial';
import { ArtVisual } from '@/components/commercial';

const COLL_KEY = 'she-my-collections-v1';

/**
 * MY SHE — personal fashion space (§27), not a generic wishlist.
 * Saves products + collections. Structured for future VIP/drops/profile.
 */
export default function MyShePage() {
  const { picks, remove } = useMyShe();
  const [savedColls, setSavedColls] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(COLL_KEY);
      if (raw) setSavedColls(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(COLL_KEY, JSON.stringify(savedColls)); } catch { /* ignore */ }
  }, [savedColls, mounted]);

  const toggleColl = (slug: string) =>
    setSavedColls((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

  const msg = picks.length
    ? ['اختياراتي من SHE 🤍:', ...picks.map((p, i) => `${i + 1}) ${p.name} (${p.modelCode} / ${p.color}) — ${p.price} ج.م`)].join('\n')
    : 'هاي SHE 🤍';
  const wa = waLink(msg);

  return (
    <div className="wrap">
      <section className="section myshe-hero">
        <p className="latin-track section-kicker">MY SHE</p>
        <h1>مساحتك الخاصة</h1>
        <p style={{ opacity: 0.7 }}>
          دي مش wishlist عادية — ده مكانك في SHE. احفظي القطع والعوالم اللي شبهك.
          قريب: توصيات خاصة، إصدارات VIP، ومجموعاتك الشخصية.
        </p>
      </section>

      <section className="section" aria-label="Saved products">
        <h2>قطعك المحفوظة <span className="count digits">({picks.length})</span></h2>
        {picks.length === 0 ? (
          <p>لسه محفوظتيش حاجة — دوسي ♡ على أي قطعة تعجبك.</p>
        ) : (
          <>
            <div className="tiles">
              {picks.map((pk) => {
                const demo = demoProductBySlug(pk.slug);
                return (
                  <div key={pk.modelCode + pk.color} className="tile">
                    {demo && <ArtVisual art={demo.art} label={demo.name.en} kind={demo.kind} />}
                    <div style={{ marginTop: 8 }}>
                      <a href={`/product/${pk.slug}`}><strong>{pk.name}</strong></a>
                      <br /><small><span className="digits">{pk.modelCode}</span> · {pk.color} · <span className="price">{formatEGP(pk.price)}</span></small>
                      <br /><button onClick={() => remove(pk.modelCode, pk.color)} aria-label="حذف" style={{ background: 'none', border: 0, cursor: 'pointer', opacity: 0.6 }}>إزالة ×</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <a className="btn btn-primary" href={wa.href} target="_blank" rel="noreferrer" style={{ marginTop: 12 }}>
              ابعتي اختياراتي لـ SHE واتساب
            </a>
          </>
        )}
      </section>

      <section className="section" aria-label="Saved collections">
        <h2>عوالمك <span className="count digits">({savedColls.length})</span></h2>
        <p style={{ opacity: 0.7 }}>احفظي العوالم اللي حبيتيها — أول ناس تعرف عن الإصدارات الخاصة هيكونوا من هنا.</p>
        <div className="coll-grid">
          {COLLECTIONS.map((c) => {
            const saved = savedColls.includes(c.slug);
            return (
              <div key={c.slug} className="coll-card">
                <a href={`/collections/${c.slug}`} style={{ textDecoration: 'none' }}>
                  <ArtVisual art={c.art} label={c.name.en} />
                </a>
                <div className="coll-card-body">
                  <h3 style={{ margin: '4px 0' }}>{c.name.ar}</h3>
                  <button
                    onClick={() => toggleColl(c.slug)} aria-pressed={saved}
                    className={saved ? 'btn btn-primary' : 'btn btn-ghost'}
                    style={{ padding: '6px 14px', fontSize: 13 }}
                  >
                    {saved ? '♥ محفوظ' : '♡ احفظي العالم'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section" aria-label="Coming soon">
        <div className="tile" style={{ textAlign: 'center', padding: 32 }}>
          <p className="latin-track" style={{ color: 'var(--she-pink)' }}>SOON</p>
          <h2>VIP · إصدارات خاصة · توصيات ليكي</h2>
          <p style={{ opacity: 0.7 }}>مساحتك هتكبر قريب. <a href="/inner-circle">ادخلي الدايرة القريبة</a> عشان تكوني أول واحدة تعرف.</p>
        </div>
      </section>
    </div>
  );
}
