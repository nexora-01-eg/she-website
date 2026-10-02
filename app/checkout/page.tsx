'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtelier } from '@/lib/atelier';
import { formatEGP } from '@/lib/shop';
import { waLink, orderMessage } from '@/lib/wa';
import { DELIVERY_ZONES } from '@/data/schema';

const MOBILE_RE = /^01[0125]\d{8}$/;

/**
 * Checkout — guest, one screen, mobile-first. COD default; payment-provider
 * hook left disabled until configured. Submit saves order (+UTM) → confirmation
 * with order code → opens WhatsApp with prefilled structured message.
 */
export default function CheckoutPage() {
  const { items, subtotal, clear } = useAtelier();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState<string>(DELIVERY_ZONES[0].key);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const express = waLink(orderMessage(items.map((i) => ({
    name: i.name, modelCode: i.modelCode, color: i.color, size: i.size, qty: i.qty, price: i.price,
  })), { total: subtotal }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (items.length === 0) { setErr('أتيليهك فاضي — اختاري موديل الأول.'); return; }
    if (name.trim().length < 2) { setErr('اكتبي الاسم.'); return; }
    if (!MOBILE_RE.test(phone.trim())) { setErr('رقم الموبايل لازم يبدأ بـ 01 ويكون 11 رقم (مثال 01001234567).'); return; }
    if (address.trim().length < 5) { setErr('اكتبي العنوان بالتفصيل.'); return; }
    setSending(true);
    try {
      const utm = new URLSearchParams(window.location.search).get('utm_source') ?? undefined;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ modelCode: i.modelCode, color: i.color, size: i.size, qty: i.qty, price: i.price })),
          name: name.trim(), phone: phone.trim(), zone, address: address.trim(), notes: notes.trim(), utm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'حصلت مشكلة');
      clear();
      router.push(`/order/${data.code}?wa=${encodeURIComponent(data.waHref)}`);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'حصلت مشكلة — حاولي تاني.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="wrap">
      <section className="section">
        <h1>إتمام الطلب</h1>
        <p style={{ opacity: 0.7 }}>الدفع كاش عند الاستلام. التوصيل حسب الزون: <strong>يُحدد (TODO)</strong></p>
        <div style={{ display: 'grid', gap: 24 }} className="co-grid">
          <style>{`@media(min-width:900px){.co-grid{grid-template-columns:1fr 1fr !important}}`}</style>
          <form onSubmit={submit} noValidate>
            <label>الاسم<br />
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required
                style={{ width: '100%', padding: 10, borderRadius: 10 }} />
            </label>
            <br /><br />
            <label>الموبايل (مصري)<br />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" autoComplete="tel"
                placeholder="01xxxxxxxxx" required dir="ltr" style={{ width: '100%', padding: 10, borderRadius: 10 }} />
            </label>
            {!MOBILE_RE.test(phone.trim()) && phone.length > 0 && (
              <p role="alert" style={{ color: 'var(--she-orange)' }}>الصيغة: 01 ثم 9 أرقام (011/012/010/015).</p>
            )}
            <br />
            <label>زون التوصيل<br />
              <select value={zone} onChange={(e) => setZone(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 10 }}>
                {DELIVERY_ZONES.map((z) => (
                  <option key={z.key} value={z.key}>{z.name.ar} — {z.fee === 'TODO' ? 'يُحدد' : `${z.fee} ج.م`}</option>
                ))}
              </select>
            </label>
            <br /><br />
            <label>العنوان<br />
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" required rows={3}
                style={{ width: '100%', padding: 10, borderRadius: 10 }} />
            </label>
            <br /><br />
            <label>ملاحظات (اختياري)<br />
              <input value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 10 }} />
            </label>
            {err && <p role="alert" style={{ color: 'var(--she-orange)' }}>{err}</p>}
            <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary" type="submit" disabled={sending}>
                {sending ? 'بيتبعت…' : 'تأكيد الطلب (كاش عند الاستلام)'}
              </button>
              <a className="btn btn-ghost" href={express.href} target="_blank" rel="noreferrer">اطلبي بسرعة — واتساب فقط من غير فورم</a>
            </div>
          </form>
          <div>
            <h2>ملخص الطلب</h2>
            {items.length === 0 ? <p>فاضي — <a href="/shop">ارجعي للشوب</a>.</p> : (
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
                {items.map((i) => (
                  <li key={i.key}>{i.name} · {i.color}{i.size ? ` · ${i.size}` : ''} × <span className="digits">{i.qty}</span> = <span className="price">{formatEGP(i.qty * i.price)}</span></li>
                ))}
              </ul>
            )}
            <p>الإجمالي: <strong className="price">{formatEGP(subtotal)}</strong> + التوصيل (يُحدد)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
