'use client';
import { useAtelier } from '@/lib/atelier';
import { formatEGP } from '@/lib/shop';
import { waLink, orderMessage } from '@/lib/wa';

/**
 * Atelier — slide-over, not a page. Delivery estimate + free-delivery bar are
 * TODO-driven: fees/threshold come from config; until provided we show "يُحدد"
 * instead of inventing numbers.
 */
export function AtelierDrawer() {
  const { items, open, setOpen, remove, setQty, subtotal } = useAtelier();
  if (!open) return null;
  const wa = waLink(orderMessage(items.map((i) => ({
    name: i.name, modelCode: i.modelCode, color: i.color, size: i.size, qty: i.qty, price: i.price,
  })), { total: subtotal }));

  return (
    <div role="dialog" aria-modal="true" aria-label="الأتيليه"
      style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,.4)' }} onClick={() => setOpen(false)}>
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', insetInlineEnd: 0, top: 0, bottom: 0, width: 'min(420px, 94vw)',
          background: 'var(--bg)', padding: 20, overflowY: 'auto', borderStartStartRadius: 18, borderEndStartRadius: 18,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>الأتيليه <span className="count digits">({items.length})</span></h2>
          <button onClick={() => setOpen(false)} aria-label="إقفال" style={{ background: 'none', border: 0, fontSize: 22, cursor: 'pointer', color: 'var(--fg)' }}>×</button>
        </div>
        {items.length === 0 ? (
          <p>أتيليهك فاضي — <a href="/shop">اختاري حاجة حلوة</a>.</p>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
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
            <hr />
            <p>المجموع الفرعي: <strong className="price">{formatEGP(subtotal)}</strong></p>
            <p style={{ opacity: 0.7 }}>التوصيل حسب الزون: <strong>يُحدد (TODO)</strong> — الشحن المجاني فوق حد معين: <strong>يُحدد (TODO)</strong></p>
            <p>الإجمالي الواضح: <strong className="price">{formatEGP(subtotal)}</strong> + التوصيل</p>
            <div style={{ display: 'grid', gap: 8 }}>
              <a className="btn btn-primary" href="/checkout">إتمام الطلب</a>
              <a className="btn btn-ghost" href={wa.href} target="_blank" rel="noreferrer">اطلبي على واتساب مباشرة</a>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
