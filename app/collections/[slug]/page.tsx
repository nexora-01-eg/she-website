import { notFound } from 'next/navigation';
import { COLLECTIONS, collectionCards, demoProductBySlug, productsByCollection } from '@/data/commercial';
import { ArtVisual, DemoProductCard } from '@/components/commercial';

export const dynamic = 'force-dynamic'; // heavy collection world: SSR (prerender OOMs small build worker)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = COLLECTIONS.find((x) => x.slug === slug);
  if (!c) return { title: 'غير موجود' };
  return { title: `${c.name.ar} (${c.name.en})`, description: c.tagline.ar, alternates: { canonical: `/collections/${c.slug}` } };
}

/**
 * Collection world — mini fashion site (§18): cover, story, ≥20 mixed cards,
 * related products. Visual identity per collection.
 */
export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const coll = COLLECTIONS.find((x) => x.slug === slug);
  if (!coll) notFound();
  const cards = collectionCards(coll.slug);
  const related = productsByCollection(coll.slug).slice(0, 4);

  return (
    <div>
      {/* Cover */}
      <section className="coll-cover" style={{ background: `linear-gradient(135deg, ${coll.art.bg} 0%, ${coll.art.bg2} 100%)`, color: coll.art.ink }}>
        <div className="wrap" style={{ paddingBlock: 56 }}>
          <p className="latin-track" style={{ color: coll.art.accent === '#111111' ? 'var(--she-pink)' : coll.art.accent }}>
            COLLECTION {coll.number}
          </p>
          <h1>{coll.name.ar} · <span lang="en">{coll.name.en}</span></h1>
          <p style={{ maxWidth: 52, opacity: 0.85 }}>{coll.story.ar}</p>
          <p lang="en" style={{ opacity: 0.7 }}>{coll.story.en}</p>
          <p style={{ opacity: 0.7 }}><small>{coll.theme.ar} · {coll.graphic}</small></p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <a className="btn btn-primary" href="#pieces">تسوقي القطع</a>
            <a className="btn btn-ghost" href="/collections" style={{ color: 'inherit', borderColor: 'currentColor' }}>كل العوالم</a>
          </div>
        </div>
      </section>

      {/* ≥20 mixed cards */}
      <section id="pieces" className="wrap section" aria-label={`${coll.name.en} pieces`}>
        <h2>قطع {coll.name.ar} — <span className="digits">{cards.length}</span></h2>
        <div className="tiles">
          {cards.map((card) => {
            if (card.kind === 'product') {
              const p = demoProductBySlug(card.productSlug!);
              if (!p) return null;
              return <DemoProductCard key={card.key} p={p} />;
            }
            return (
              <figure key={card.key} className="tile fragment">
                <ArtVisual art={card.art} label={card.title.en} kind={card.kind} />
                <figcaption style={{ marginTop: 8 }}>
                  <small className="latin-track" style={{ opacity: 0.6 }}>{card.kind.toUpperCase()}</small>
                  <br /><strong>{card.title.ar}</strong>
                  <br /><small lang="en" style={{ opacity: 0.6 }}>{card.title.en}</small>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="wrap section" aria-label="Related products">
          <h2>قطع مرتبطة</h2>
          <div className="tiles">
            {related.map((p) => <DemoProductCard key={p.slug} p={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
