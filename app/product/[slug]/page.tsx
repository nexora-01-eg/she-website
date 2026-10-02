import { MODEL_CONTENT } from '@/data/seed';
import { SHOP_INDEX } from '@/lib/shop';
import { BuyBox } from '@/components/BuyBox';
import { ProductCard } from '@/components/ProductCard';
import { isSellableOnline } from '@/lib/inventory';

/**
 * Products prerender at build time with hourly ISR (Vercel builds, not the
 * 8GB local box). Gallery renders ONLY existing angles (never empty slots).
 */
export const revalidate = 3600;

export function generateStaticParams() {
  return MODEL_CONTENT.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = MODEL_CONTENT.find((x) => x.slug === slug);
  if (!c) return { title: 'غير موجود' };
  return {
    title: `${c.name.ar} (${c.modelCode})`,
    description: `${c.name.ar} — ${c.name.en}. اطلبي على واتساب.`,
    alternates: { canonical: `/product/${c.slug}` },
  };
}

/**
 * Product page — editorial first, commerce second, but price/color/size/order
 * visible without hunting. Gallery renders ONLY existing angles (never empty slots).
 */
export default async function ProductPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ color?: string }>;
}) {
  const { slug } = await params;
  const { color } = await searchParams;
  const content = MODEL_CONTENT.find((c) => c.slug === slug);
  if (!content) return <div className="wrap section"><h1>الموديل مش موجود</h1><a href="/shop">عودة للشوب</a></div>;

  const variants = SHOP_INDEX.filter((v) => v.modelCode === content.modelCode);
  const sel = variants.find((v) => v.color === color) ?? variants[0];
  const gallery = sel.gallery; // only existing angles
  const avail = sel.status === 'out' ? 'https://schema.org/OutOfStock' : sel.status === 'low' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock';

  // Complete the look (real data only): same color, bag↔shoes pairing, same occasion
  const sameColor = SHOP_INDEX.filter((v) => v.color === sel.color && v.modelCode !== sel.modelCode && v.qty > 0).slice(0, 4);
  const opposite = sel.section === 'shoes' ? 'bags' : 'shoes';
  const pair = SHOP_INDEX.filter((v) => v.section === opposite && v.color === sel.color && v.qty > 0).slice(0, 4);
  const occasion = SHOP_INDEX.filter((v) => v.modelCode !== sel.modelCode && v.occasion.some((o) => sel.occasion.includes(o)) && v.qty > 0).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${content.name.ar} ${content.modelCode}`,
    sku: `${content.modelCode}-${sel.color}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EGP',
      price: sel.price,
      availability: avail,
    },
  };

  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p style={{ opacity: 0.6 }}><a href="/shop">الشوب</a> / {content.name.ar}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="product-grid">
        <style>{`@media(min-width:900px){.product-grid{grid-template-columns:1.1fr .9fr !important}}`}</style>
        {/* Gallery — existing angles only */}
        <div>
          {gallery.length > 0 ? (
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 8 }}>
              {gallery.map((g, i) => (
                <img key={g.url + i} src={g.url} srcSet={g.srcSet} sizes="(max-width: 900px) 100vw, 480px" alt={`${content.name.ar} — ${g.kind}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  style={{ width: 'min(100%, 480px)', aspectRatio: '4/5', objectFit: 'cover', borderRadius: 'var(--radius-l)', scrollSnapAlign: 'start', flexShrink: 0, background: '#eee' }} />
              ))}
            </div>
          ) : (
            <div style={{ aspectRatio: '4/5', display: 'grid', placeItems: 'center', background: 'color-mix(in srgb, var(--fg) 6%, var(--bg))', borderRadius: 'var(--radius-l)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', opacity: 0.5 }}>{content.modelCode.slice(0, 3)}</span>
            </div>
          )}
          <small style={{ opacity: 0.6 }}>اسحبي للزوايا المتاحة ({gallery.length || 'صورة الموديل قريباً'})</small>
          <div id="size-guide" style={{ marginTop: 16 }}>
            {content.section === 'shoes' && (
              <details>
                <summary>دليل المقاسات</summary>
                <p>EU <span className="digits">37 – 42</span>. لو بين مقاسين اختاري الأكبر. المقاسات اختيارية حالياً وتُكتب في الطلب.</p>
              </details>
            )}
          </div>
        </div>
        {/* Commerce */}
        <div>
          <p style={{ color: 'var(--she-pink)', margin: 0 }}>{sel.subName.ar}</p>
          <h1 style={{ marginTop: 4 }}>{content.name.ar}</h1>
          <p style={{ opacity: 0.6 }}><span className="digits">{content.modelCode}</span> · {content.name.en}</p>
          <BuyBox
            modelCode={content.modelCode} slug={content.slug} name={content.name.ar}
            price={sel.price} section={content.section}
            colors={variants.map((v) => ({ key: v.color, ar: v.colorName.ar, hex: v.colorHex, qty: v.qty, status: v.status }))}
            selectedColor={sel.color} selectedQty={sel.qty}
            sellableOnline={isSellableOnline(content.modelCode)}
            frontUrl={sel.front?.url}
          />
          <div style={{ marginTop: 16 }}>
            {content.story && <details open><summary>الحكاية</summary><p>{content.story}</p></details>}
            {content.materials && <details><summary>الخامة</summary><p>{content.materials}</p></details>}
            {content.dimensions && <details><summary>الأبعاد</summary><p>{content.dimensions}</p></details>}
            {content.care && <details><summary>العناية</summary><p>{content.care}</p></details>}
            <details><summary>التوصيل والاسترجاع</summary><p>التوصيل لحد باب البيت — المدد والسياسة: TODO (من الإعدادات).</p></details>
          </div>
        </div>
      </div>

      {(sameColor.length > 0 || pair.length > 0 || occasion.length > 0) && (
        <section className="section">
          <h2>كمّلي اللوك</h2>
          {pair.length > 0 && (<><h3>{sel.section === 'shoes' ? 'شنطة مع الشوز ده' : 'شوز مع الشنطة دي'}</h3>
            <div className="tiles" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
              {pair.map((v) => <ProductCard key={v.modelCode + v.color} v={v} />)}
            </div></>)}
          {sameColor.length > 0 && (<><h3>نفس اللون</h3>
            <div className="tiles" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
              {sameColor.map((v) => <ProductCard key={v.modelCode + v.color} v={v} />)}
            </div></>)}
          {occasion.length > 0 && (<><h3>نفس المناسبة</h3>
            <div className="tiles" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
              {occasion.map((v) => <ProductCard key={v.modelCode + v.color} v={v} />)}
            </div></>)}
        </section>
      )}
    </div>
  );
}
