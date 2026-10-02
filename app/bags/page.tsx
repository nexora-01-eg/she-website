import { Suspense } from 'react';
import { ShopView } from '@/components/ShopView';

export default function BagsPage() {
  return (
    <div className="wrap">
      <section className="section" style={{ paddingBottom: 0 }}>
        <h1>شنط</h1>
        <p style={{ opacity: 0.7 }}>سواريه و IN SHE ONLY — الثانية واتساب فقط لحد ما المعنى يتأكد.</p>
      </section>
      <Suspense fallback={<p>…</p>}>
        <ShopView preset={{ section: 'bags' }} />
      </Suspense>
    </div>
  );
}
