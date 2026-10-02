'use client';
import { useState } from 'react';
import type { DemoProduct } from '@/data/commercial';
import { COLLECTIONS } from '@/data/commercial';
import { ArtVisual } from './commercial';
import { useAtelier, useMyShe } from '@/lib/atelier';

/**
 * Demo product detail — editorial first, commerce second (§26).
 * Gallery: 6 angles + interior (procedural variants now, real images later).
 * Color switch updates visual + state. Size guide for shoes.
 */
export function DemoProductDetail({ p }: { p: DemoProduct }) {
  const { add } = useAtelier();
  const { has, toggle } = useMyShe();
  const [colorIdx, setColorIdx] = useState(0);
  const [angle, setAngle] = useState<DemoProduct['angles'][number] | 'interior'>('front');
  const [size, setSize] = useState<string | undefined>(undefined);
  const color = p.colors[colorIdx] ?? p.colors[0];
  const saved = has(p.code, color.key);
  const coll = COLLECTIONS.find((c) => c.slug === p.collection);
  const discount = p.comparePrice ? Math.round((1 - p.price / p.comparePrice) * 100) : 0;

  const waText = encodeURIComponent(
    `هاي SHE 🤍 عايزة أطلب: ${p.name.ar} (${p.code}) — لون ${color.ar}${size ? ` — مقاس ${size}` : ''} — ${p.price} ج.م`
  );
  const waHref = `https://wa.me/?text=${waText}`;

  const galleryAngles: Array<DemoProduct['angles'][number] | 'interior'> = p.interior
    ? [...p.angles, 'interior']
    : [...p.angles];

  return (
    <div className="wrap">
      <p style={{ opacity: 0.6 }}><a href={p.kind === 'bag' ? '/bags' : '/shoes'}>{p.kind === 'bag' ? 'الشنط' : 'الشوز'}</a> / {p.name.ar}</p>
      <div className="product-grid">
        {/* Gallery */}
        <div>
          <div key={`${colorIdx}-${angle}`} className="pdetail-hero">
            <div style={{ filter: `hue-rotate(${colorIdx * 14}deg)` }}>
              <ArtVisual art={p.art} label={`${p.name.en} — ${angle}`} kind={p.kind} large />
            </div>
          </div>
          <small style={{ opacity: 0.6 }}>الزاوية: {angle}{p.interior && angle === 'interior' ? ' (البطانة من جوه)' : ''} — اللون: {color.ar}</small>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }} role="group" aria-label="Product angles">
            {galleryAngles.map((a) => (
              <button
                key={a} onClick={() => setAngle(a)} aria-pressed={angle === a}
                style={{
                  borderRadius: 999, border: 0, padding: '6px 12px', cursor: 'pointer', fontSize: 12,
                  background: angle === a ? 'var(--she-pink)' : 'color-mix(in srgb, var(--fg) 8%, transparent)',
                  color: angle === a ? '#fff' : 'inherit',
                }}
              >
                {a === 'interior' ? 'البطانة' : a}
              </button>
            ))}
          </div>
          {p.kind === 'shoe' && (
            <details style={{ marginTop: 12 }}>
              <summary>دليل المقاسات</summary>
              <p>EU <span className="digits">37 – 42</span>. لو بين مقاسين اختاري الأكبر.</p>
            </details>
          )}
        </div>

        {/* Commerce */}
        <div>
          <p style={{ color: 'var(--she-pink)', margin: 0 }}>{coll ? `${coll.name.ar} · ${coll.number}` : p.collection}</p>
          <h1 style={{ marginTop: 4 }}>{p.name.ar}</h1>
          <p style={{ opacity: 0.6 }}><span className="digits">{p.code}</span> · <span lang="en">{p.name.en}</span></p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <strong className="price digits" style={{ fontSize: '1.4rem' }}>{p.price.toLocaleString('en-US')} EGP</strong>
            {p.comparePrice && (
              <>
                <s style={{ opacity: 0.5 }} className="digits">{p.comparePrice.toLocaleString('en-US')}</s>
                <span className="offer-label">-{discount}%</span>
              </>
            )}
            {p.limited && <span className="limited-label">LIMITED</span>}
          </div>

          {/* Colors */}
          <div style={{ marginTop: 12 }}>
            <p style={{ margin: '0 0 6px' }}>اللون: <strong>{color.ar}</strong></p>
            <div style={{ display: 'flex', gap: 8 }}>
              {p.colors.map((c, i) => (
                <button
                  key={c.key} onClick={() => setColorIdx(i)} title={c.ar} aria-label={c.ar} aria-pressed={i === colorIdx}
                  style={{ background: 'none', border: 0, cursor: 'pointer', padding: 2 }}
                >
                  <span className="color-dot" style={{ background: c.hex, width: 28, height: 28, outline: i === colorIdx ? '2px solid var(--she-pink)' : 'none' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Sizes for shoes */}
          {p.kind === 'shoe' && (
            <div style={{ marginTop: 12 }}>
              <p style={{ margin: '0 0 6px' }}>المقاس (EU)</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['37', '38', '39', '40', '41', '42'].map((s) => (
                  <button
                    key={s} onClick={() => setSize(s)} aria-pressed={size === s}
                    style={{
                      borderRadius: 10, border: '1px solid color-mix(in srgb, var(--fg) 20%, transparent)',
                      padding: '8px 14px', cursor: 'pointer', fontSize: 14,
                      background: size === s ? 'var(--she-black)' : 'transparent',
                      color: size === s ? 'var(--she-cream)' : 'inherit',
                    }}
                  >
                    <span className="digits">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button
              className="btn btn-primary" style={{ flex: 1 }}
              onClick={() => add({ modelCode: p.code, name: p.name.ar, color: color.ar, size, price: p.price })}
            >
              أضيفي للأتيليه
            </button>
            <button
              aria-label={saved ? 'Remove from My SHE' : 'Save to My SHE'}
              aria-pressed={saved}
              onClick={() => toggle({ modelCode: p.code, color: color.key, slug: p.slug, name: p.name.ar, price: p.price })}
              style={{ background: 'transparent', border: '1px solid color-mix(in srgb, var(--fg) 20%, transparent)', borderRadius: 999, width: 48, height: 48, cursor: 'pointer', color: saved ? 'var(--she-pink)' : 'inherit', fontSize: 20 }}
            >
              {saved ? '♥' : '♡'}
            </button>
          </div>
          <a className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} href={waHref} target="_blank" rel="noreferrer">
            اطلبي على واتساب
          </a>
          <p style={{ opacity: 0.6, fontSize: 13 }}>متاح · التوصيل لحد باب البيت · الدفع كاش عند الاستلام</p>

          {/* Progressive info */}
          <div style={{ marginTop: 8 }}>
            <details open><summary>الحكاية</summary><p>{p.story.ar}</p></details>
            <details><summary>الخامة</summary><p>{p.materials.ar}</p></details>
            {p.dimensions && <details><summary>{p.kind === 'bag' ? 'الأبعاد' : 'المقاسات'}</summary><p>{p.dimensions.ar}</p></details>}
            <details><summary>العناية</summary><p>احفظيها في الكيس القماش بعيد عن الشمس المباشرة، ونضفيها بقماشة ناعمة جافة.</p></details>
            <details><summary>التوصيل والاسترجاع</summary><p>التوصيل لحد باب البيت — الدفع كاش عند الاستلام.</p></details>
          </div>
        </div>
      </div>
    </div>
  );
}
