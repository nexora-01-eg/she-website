'use client';
import { useState } from 'react';
import { useAtelier, useMyShe } from '@/lib/atelier';
import { formatEGP } from '@/lib/shop';
import { waLink, inquiryMessage, orderMessage } from '@/lib/wa';
import { SHE_CONFIG } from '@/data/config';
import { Availability } from './ProductCard';

interface BuyBoxProps {
  modelCode: string;
  slug: string;
  name: string;
  price: number;
  section: 'bags' | 'shoes';
  colors: Array<{ key: string; ar: string; hex: string; qty: number; status: string }>;
  selectedColor: string;
  selectedQty: number;
  sellableOnline: boolean;
  frontUrl?: string;
}

/**
 * Commerce box — price, color, size and order button visible without hunting.
 * trackSizes=false: size chips carry no per-size stock; chosen size goes into
 * the order/WhatsApp message.
 */
export function BuyBox(p: BuyBoxProps) {
  const { add } = useAtelier();
  const { has, toggle } = useMyShe();
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const sizes = p.section === 'shoes' ? SHE_CONFIG.shop.shoeSizes : ['One Size'];
  const saved = has(p.modelCode, p.selectedColor);
  const sel = p.colors.find((c) => c.key === p.selectedColor);
  const canBuy = p.sellableOnline && p.selectedQty > 0;
  const waBuy = waLink(orderMessage([{
    name: p.name, modelCode: p.modelCode, color: sel?.ar ?? p.selectedColor,
    size: size ?? undefined, qty, price: p.price,
  }], { total: p.price * qty }));
  const waAsk = waLink(inquiryMessage(p.modelCode, sel?.ar ?? p.selectedColor, size ?? undefined));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <strong className="price" style={{ fontSize: '1.5rem' }}>{formatEGP(p.price)}</strong>
        <Availability status={p.selectedQty <= 0 ? 'out' : p.selectedQty === 1 ? 'low' : 'available'} qty={p.selectedQty} />
      </div>

      <h3 style={{ fontSize: '.95rem', marginBottom: 6 }}>اللون — يتحدث الصور والتوفر والرابط فوراً</h3>
      <div style={{ display: 'flex', gap: 10 }}>
        {p.colors.map((c) => (
          <a key={c.key} href={`/product/${p.slug}?color=${c.key}`} aria-label={c.ar}
            style={{ opacity: c.qty <= 0 ? 0.4 : 1, textDecoration: 'none', textAlign: 'center' }}>
            <span className="color-dot" style={{
              background: c.hex, width: 28, height: 28,
              outline: c.key === p.selectedColor ? '2px solid var(--she-pink)' : 'none',
            }} />
            <br /><small style={{ fontSize: 11 }}>{c.qty <= 0 ? 'خلصت' : c.qty === 1 ? 'آخر قطعة' : ''}</small>
          </a>
        ))}
      </div>

      <h3 style={{ fontSize: '.95rem', marginBottom: 6 }}>
        المقاس {p.section === 'shoes' && <a href="#size-guide" style={{ fontSize: 12 }}>(دليل المقاسات)</a>}
      </h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} role="radiogroup" aria-label="مقاس">
        {sizes.map((s) => (
          <button key={s}
            role="radio" aria-checked={size === s}
            onClick={() => setSize(s)}
            style={{
              minWidth: 44, padding: '8px 12px', borderRadius: 12, cursor: 'pointer',
              border: size === s ? '2px solid var(--she-pink)' : '1px solid color-mix(in srgb, var(--fg) 25%, transparent)',
              background: 'var(--bg)', color: 'var(--fg)',
            }}>
            <span className="digits">{s}</span>
          </button>
        ))}
      </div>
      {!SHE_CONFIG.shop.trackSizes && p.section === 'shoes' && (
        <small style={{ opacity: 0.6 }}>المقاسات اختيارية — مقاسك هيتكتب في الطلب والتوفر العام موضح فوق.</small>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <label>الكمية <span className="digits">{qty}</span>
          <input type="number" min={1} max={Math.max(p.selectedQty, 1)} value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} style={{ width: 56 }} aria-label="الكمية" />
        </label>
        <button
          aria-label="حفظ في My SHE" aria-pressed={saved}
          onClick={() => toggle({ modelCode: p.modelCode, color: p.selectedColor, slug: p.slug, name: p.name, price: p.price })}
          style={{ borderRadius: 999, width: 44, height: 44, border: '1px solid color-mix(in srgb, var(--fg) 20%, transparent)', background: 'transparent', color: saved ? 'var(--she-pink)' : 'var(--fg)', fontSize: 19, cursor: 'pointer' }}
        >{saved ? '♥' : '♡'}</button>
      </div>

      <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        {canBuy ? (
          <>
            <button className="btn btn-primary" onClick={() => add(
              { modelCode: p.modelCode, name: p.name, color: sel?.ar ?? p.selectedColor, size: size ?? undefined, price: p.price, imageUrl: p.frontUrl }, qty,
            )}>
              أضيفي للأتيليه
            </button>
            <a className="btn btn-ghost" href={waBuy.href} target="_blank" rel="noreferrer">اطلبي على واتساب</a>
          </>
        ) : (
          <a className="btn btn-ghost" href={waAsk.href} target="_blank" rel="noreferrer">اسألي عن التوفر واتساب</a>
        )}
      </div>
      {!p.sellableOnline && <p style={{ opacity: 0.7 }}>القطعة دي من IN SHE ONLY — استفسار واتساب فقط حالياً.</p>}

      {/* Mobile sticky bar */}
      <div style={{
        position: 'sticky', bottom: 0, zIndex: 30, background: 'var(--bg)',
        borderTop: '1px solid color-mix(in srgb, var(--fg) 12%, transparent)',
        padding: '10px 0', display: 'flex', gap: 8, alignItems: 'center', marginTop: 16,
      }} className="buy-sticky">
        <strong className="price">{formatEGP(p.price)}</strong>
        <small className="digits">{size ?? 'اختاري مقاسك'}</small>
        {canBuy ? (
          <>
            <a className="btn btn-primary" style={{ flex: 1, padding: '10px' }} href={waBuy.href} target="_blank" rel="noreferrer">اطلبي واتساب</a>
            <button className="btn btn-ghost" style={{ padding: '10px' }} onClick={() => add(
              { modelCode: p.modelCode, name: p.name, color: sel?.ar ?? p.selectedColor, size: size ?? undefined, price: p.price, imageUrl: p.frontUrl }, qty,
            )}>+ أتيليه</button>
          </>
        ) : (
          <a className="btn btn-ghost" style={{ flex: 1 }} href={waAsk.href} target="_blank" rel="noreferrer">اسألي واتساب</a>
        )}
      </div>
      <style>{`@media(min-width:820px){.buy-sticky{display:none !important}}`}</style>
    </div>
  );
}
