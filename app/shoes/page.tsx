import { Suspense } from 'react';
import { ShopView } from '@/components/ShopView';

export default function ShoesPage() {
  return (
    <div className="wrap">
      <section className="section" style={{ paddingBottom: 0 }}>
        <h1>شوز</h1>
        <p style={{ opacity: 0.7 }}>فورمال وسواريه وباليرينا وسنيكرز — اختاري مقاسك وهيتكتب في الطلب.</p>
      </section>
      <Suspense fallback={<p>…</p>}>
        <ShopView preset={{ section: 'shoes' }} />
      </Suspense>
    </div>
  );
}
