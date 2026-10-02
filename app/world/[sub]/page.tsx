import { Suspense } from 'react';
import { ShopView } from '@/components/ShopView';
import { SUBSECTIONS } from '@/data/schema';
import { piecesBySubsection } from '@/lib/inventory';

export function generateStaticParams() {
  return SUBSECTIONS.map((s) => ({ sub: s.key }));
}

export default async function WorldPage({ params }: { params: Promise<{ sub: string }> }) {
  const { sub: subKey } = await params;
  const sub = SUBSECTIONS.find((s) => s.key === subKey);
  const counts = piecesBySubsection();
  if (!sub) return <div className="wrap section"><h1>لا يوجد هذا العالم</h1><a href="/shop">عودة للشوب</a></div>;
  return (
    <div className="wrap">
      <section className="section" style={{ paddingBottom: 0 }}>
        <h1>{sub.name.ar} <small style={{ fontSize: 16 }}>({sub.name.en})</small></h1>
        <p><span className="count digits">{counts[sub.key]}</span> قطعة — محسوبة من البيانات.</p>
        {!sub.sellableOnline && <p>قطع IN SHE ONLY: عرض + استفسار واتساب فقط (مفيش إضافة للأتيليه) لحد ما المعنى يتأكد.</p>}
      </section>
      <Suspense fallback={<p>…</p>}>
        <ShopView preset={{ sub: sub.key }} />
      </Suspense>
    </div>
  );
}
