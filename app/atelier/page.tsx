'use client';
import { useAtelier } from '@/lib/atelier';
import { formatEGP } from '@/lib/shop';

/** /atelier route — full-page view of the same cart (drawer is the primary UI). */
export default function AtelierPage() {
  const { items, subtotal, setQty, remove, setOpen } = useAtelier();
  return (
    <div className="wrap">
      <section className="section">
        <h1>الأتيليه <span className="count digits">({items.length})</span></h1>
        {items.length === 0 ? (
          <p>أتيليهك فاضي — <a href="/shop">اختاري حاجة حلوة</a>.</p>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
              {items.map((i) => (
                <li key={i.key} className="tile" style={{ display: 'flex', gap: 10 }}>
                  {i.imageUrl && <img src={i.imageUrl} alt="" style={{ width: 56, height: 70, objectFit: 'cover', borderRadius: 8 }} />}
                  <div style={{ flex: 1 }}>
                    <strong>{i.name}</strong>
                    <br /><small>{i.color}{i.size ? ` · مقاس ${i.size}` : ''} · <span className="digits">{i.modelCode}</span></small>
                    <br /><span className="price">{formatEGP(i.price)}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                      <button onClick={() => setQty(i.key, i.qty - 1)} aria-label="تقليل">−</button>
                      <span className="digits">{i.qty}</span>
                      <button onClick={() => setQty(i.key, i.qty + 1)} aria-label="زيادة">+</button>
                      <button onClick={() => remove(i.key)} aria-label="حذف" style={{ marginInlineStart: 'auto' }}>🗑</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p>المجموع الفرعي: <strong className="price">{formatEGP(subtotal)}</strong></p>
            <p style={{ opacity: 0.7 }}>التوصيل حسب الزون + الشحن المجاني: <strong>يُحدد (TODO)</strong></p>
            <div style={{ display: 'flex', gap: 8 }}>
              <a className="btn btn-primary" href="/checkout">إتمام الطلب</a>
              <button className="btn btn-ghost" onClick={() => setOpen(true)}>فتح السلايد-أوفر</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
