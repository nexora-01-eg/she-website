'use client';
import { useMyShe } from '@/lib/atelier';
import { formatEGP } from '@/lib/shop';
import { waLink } from '@/lib/wa';

/** My SHE — saved models/colors + "Send my picks to SHE on WhatsApp". Local now. */
export default function MyShePage() {
  const { picks, remove } = useMyShe();
  const msg = picks.length
    ? ['اختياراتي من SHE 🤍:', ...picks.map((p, i) => `${i + 1}) ${p.name} (${p.modelCode} / ${p.color}) — ${p.price} ج.م`)].join('\n')
    : 'هاي SHE 🤍';
  const wa = waLink(msg);
  return (
    <div className="wrap">
      <section className="section">
        <h1>My SHE <span className="count digits">({picks.length})</span></h1>
        {picks.length === 0 ? (
          <p>لسه محفوظتيش حاجة — دوسي ♡ على أي موديل يعجبك في <a href="/shop">الشوب</a>.</p>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
              {picks.map((p) => (
                <li key={p.modelCode + p.color} className="tile" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <a href={`/product/${p.slug}?color=${p.color}`}><strong>{p.name}</strong></a>
                    <br /><small><span className="digits">{p.modelCode}</span> · {p.color} · <span className="price">{formatEGP(p.price)}</span></small>
                  </div>
                  <button onClick={() => remove(p.modelCode, p.color)} aria-label="حذف">×</button>
                </li>
              ))}
            </ul>
            <a className="btn btn-primary" href={wa.href} target="_blank" rel="noreferrer" style={{ marginTop: 12 }}>
              ابعتي اختياراتي لـ SHE واتساب
            </a>
          </>
        )}
      </section>
    </div>
  );
}
