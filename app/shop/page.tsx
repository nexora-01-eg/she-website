import { Suspense } from 'react';
import { ShopView } from '@/components/ShopView';

export default function ShopPage() {
  return (
    <div className="wrap">
      <section className="section" style={{ paddingBottom: 0 }}>
        <h1>تسوقي SHE</h1>
        <p style={{ opacity: 0.7 }}>كل القطع والألوان بأرقامها الحقيقية من البيانات.</p>
      </section>
      <Suspense fallback={<p>…</p>}>
        <ShopView />
      </Suspense>
    </div>
  );
}
