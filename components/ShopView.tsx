'use client';
import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { applyFilters, modelsIndex, PRICE_BOUNDS, type Filters } from '@/lib/shop';
import { COLORS, SUBSECTIONS } from '@/data/schema';
import { piecesByColor } from '@/lib/inventory';
import { ProductCard } from './ProductCard';

/**
 * Shop listing — client-side filtering over prebuilt index; URL reflects filters.
 * Search normalizes Arabic (أ/إ/آ→ا ى→ي ة→ه, no tashkeel). ⌘/Ctrl-K focuses search on desktop.
 */
export function ShopView({ preset = {} }: { preset?: Filters }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') ?? '');
  const [color, setColor] = useState(sp.get('color') ?? preset.color ?? '');
  const [sub, setSub] = useState(sp.get('sub') ?? preset.sub ?? '');
  const [maxPrice, setMaxPrice] = useState(sp.get('max') ?? '');
  const [inStock, setInStock] = useState(sp.get('stock') === '1');
  const [sort, setSort] = useState(sp.get('sort') ?? 'available');
  const colorCounts = piecesByColor();

  // Shareable URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (color) p.set('color', color);
    if (sub && !preset.sub) p.set('sub', sub);
    if (maxPrice) p.set('max', maxPrice);
    if (inStock) p.set('stock', '1');
    if (sort !== 'available') p.set('sort', sort);
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, color, sub, maxPrice, inStock, sort]);

  // ⌘/Ctrl-K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('shop-search')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(
    () => applyFilters(modelsIndex(), {
      ...preset,
      sub: (sub || preset.sub || undefined) as Filters['sub'],
      color: (color || undefined) as Filters['color'],
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStockOnly: inStock || undefined,
      q: q || undefined,
      sort: sort as Filters['sort'],
    }),
    [preset, sub, color, maxPrice, inStock, q, sort],
  );

  return (
    <div>
      <div style={{ position: 'sticky', top: 57, zIndex: 20, background: 'var(--bg)', paddingBlock: 10, borderBottom: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)' }}>
        <input
          id="shop-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="دوّري بالاسم أو الكود أو اللون… (⌘K)"
          role="searchbox"
          aria-label="بحث"
          style={{ width: '100%', padding: '10px 14px', borderRadius: 999, border: '1px solid color-mix(in srgb, var(--fg) 20%, transparent)', background: 'var(--bg)', color: 'var(--fg)' }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={color} onChange={(e) => setColor(e.target.value)} aria-label="لون">
            <option value="">كل الألوان</option>
            {COLORS.map((c) => (
              <option key={c.key} value={c.key}>{c.name.ar} ({colorCounts[c.key] ?? 0})</option>
            ))}
          </select>
          {!preset.sub && (
            <select value={sub} onChange={(e) => setSub(e.target.value)} aria-label="عالم">
              <option value="">كل العوالم</option>
              {SUBSECTIONS.map((s) => (
                <option key={s.key} value={s.key}>{s.name.ar}</option>
              ))}
            </select>
          )}
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="ترتيب">
            <option value="available">المتاح الأول</option>
            <option value="newest">الأحدث</option>
            <option value="price-asc">السعر: الأقل</option>
            <option value="price-desc">السعر: الأعلى</option>
          </select>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> المتاح فقط
          </label>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
            حتى <span className="price digits">{PRICE_BOUNDS.max}</span>
            <input type="range" min={PRICE_BOUNDS.min} max={PRICE_BOUNDS.max} step={50} value={maxPrice || PRICE_BOUNDS.max}
              onChange={(e) => setMaxPrice(e.target.value === String(PRICE_BOUNDS.max) ? '' : e.target.value)} aria-label="أقصى سعر" />
          </label>
        </div>
      </div>

      <p style={{ opacity: 0.7 }}><span className="count digits">{results.length}</span> نتيجة من <span className="count digits">{modelsIndex().length}</span></p>
      {results.length === 0 ? (
        <div className="tile" style={{ textAlign: 'center', padding: 32 }}>
          <h2>مفيش نتيجة مطابقة</h2>
          <p>جرّبي لون أو كلمة تانية — أو <a href="/shop">امسحي الفلاتر</a>.</p>
        </div>
      ) : (
        <div className="tiles" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {results.map((v) => (
            <ProductCard key={`${v.modelCode}__${v.color}`} v={v} />
          ))}
        </div>
      )}
    </div>
  );
}
