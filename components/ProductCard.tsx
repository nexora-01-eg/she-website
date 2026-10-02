'use client';
import { useState } from 'react';
import { SHOP_INDEX, formatEGP, type ShopVariant } from '@/lib/shop';
import { useAtelier, useMyShe } from '@/lib/atelier';
import { waLink, inquiryMessage } from '@/lib/wa';

/** Availability signal: green = available, orange = last piece, grey = sold out. */
export function Availability({ status, qty }: { status: ShopVariant['status']; qty: number }) {
  if (status === 'low') return <span className="badge-low">آخر قطعة</span>;
  if (status === 'out') return <span style={{ color: '#888' }}>خلصت</span>;
  return <span className="badge-ok">متاح <span className="count digits">({qty})</span></span>;
}

function Monogram({ code }: { code: string }) {
  return (
    <div style={{ aspectRatio: '4/5', display: 'grid', placeItems: 'center', background: 'color-mix(in srgb, var(--fg) 6%, var(--bg))', borderRadius: 'var(--radius-m)' }} aria-label={`${code} — الصورة قريباً`}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', opacity: 0.5 }}>{code.slice(0, 3)}</span>
    </div>
  );
}

/**
 * Product card — one thing animates at a time (image crossfade on hover/drag only).
 * Sold-out colors: greyed + "اسألي عن التوفر" (WhatsApp). Never fake urgency:
 * "آخر قطعة" only when qty = 1 (derived from data).
 */
export function ProductCard({ v, lang = 'ar' }: { v: ShopVariant; lang?: 'ar' | 'en' }) {
  const { add } = useAtelier();
  const { has, toggle } = useMyShe();
  const [hover, setHover] = useState(false);
  const siblings = SHOP_INDEX.filter((x) => x.modelCode === v.modelCode);
  const saved = has(v.modelCode, v.color);
  const second = v.gallery[1]?.url;
  const inquiry = waLink(inquiryMessage(v.modelCode, v.color));

  return (
    <article className="tile" style={{ opacity: v.status === 'out' ? 0.75 : 1 }}>
      <a
        href={`/product/${v.slug}?color=${v.color}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ display: 'block', textDecoration: 'none' }}
        aria-label={lang === 'ar' ? v.name.ar : v.name.en}
      >
        {v.front ? (
          <img
            src={hover && second ? second : v.front.url}
            alt={lang === 'ar' ? v.name.ar : v.name.en}
            loading="lazy"
            style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: 'var(--radius-m)', background: '#eee' }}
          />
        ) : <Monogram code={v.modelCode} />}
      </a>
      {v.front?.illustrative && <small style={{ opacity: 0.55 }}>صورة توضيحية — صورة الموديل قريباً</small>}
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }} aria-label="colors">
        {siblings.map((s) => (
          <a key={s.color} href={`/product/${s.slug}?color=${s.color}`} title={s.colorName.ar} aria-label={s.colorName.ar}
            style={{ opacity: s.status === 'out' ? 0.35 : 1 }}>
            <span className="color-dot" style={{ background: s.colorHex, outline: s.color === v.color ? '2px solid var(--she-pink)' : 'none' }} />
          </a>
        ))}
      </div>
      <h3 style={{ margin: '8px 0 2px', fontSize: '1rem' }}>
        <a href={`/product/${v.slug}?color=${v.color}`} style={{ textDecoration: 'none' }}>{lang === 'ar' ? v.name.ar : v.name.en}</a>
      </h3>
      <small style={{ opacity: 0.6 }}>{v.subName.ar} · <span className="digits">{v.modelCode}</span></small>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <strong className="price">{formatEGP(v.price, lang)}</strong>
        <Availability status={v.status} qty={v.qty} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {v.status === 'out' || !v.sellableOnline ? (
          <a className="btn btn-ghost" style={{ flex: 1, padding: '8px 10px', fontSize: 13 }} href={inquiry.href} target="_blank" rel="noreferrer">
            اسألي عن التوفر
          </a>
        ) : (
          <button
            className="btn btn-primary"
            style={{ flex: 1, padding: '8px 10px', fontSize: 13 }}
            onClick={() => add({ modelCode: v.modelCode, name: v.name.ar, color: v.colorName.ar, price: v.price, imageUrl: v.front?.url })}
          >
            أضيفي للأتيليه
          </button>
        )}
        <button
          aria-label={saved ? 'إزالة من My SHE' : 'حفظ في My SHE'}
          aria-pressed={saved}
          onClick={() => toggle({ modelCode: v.modelCode, color: v.color, slug: v.slug, name: v.name.ar, price: v.price })}
          style={{ background: 'transparent', border: '1px solid color-mix(in srgb, var(--fg) 20%, transparent)', borderRadius: 999, width: 36, height: 36, cursor: 'pointer', color: saved ? 'var(--she-pink)' : 'inherit', fontSize: 17 }}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
    </article>
  );
}
