import missing from '@/data/missing-images.json';

/**
 * /admin/images — missing-images report, STRICT mode (protected by middleware).
 * Launch minimum = one own-code+color front per variant; placeholders elsewhere.
 */
export default function AdminImagesPage() {
  const m = missing as {
    generatedAt: string;
    mode: string;
    linkedModels: number;
    variantsWithoutOwnFront: number;
    cells: Array<{ subsection: string; color: string; pieces: number }>;
    realCodesWithDerivatives: string[];
  };
  return (
    <div className="wrap">
      <section className="section">
        <h1>تقرير الصور الناقصة (Strict)</h1>
        <p>أُنشئ: <span className="digits">{m.generatedAt}</span> · الوضع: <code>{m.mode}</code></p>
        <p>موديلات مربوطة بصورها: <strong className="digits">{m.linkedModels}</strong> (MODEL_TO_REAL يتملى من الاستيراد).</p>
        <p>variants بدون صورة خاصة: <strong className="digits">{m.variantsWithoutOwnFront}</strong> — بتظهر monogram لحد ما التصدير يقفل الربط.</p>
        <h2>الأكواد الحقيقية اللي ليها derivatives ({m.realCodesWithDerivatives.length})</h2>
        <p style={{ opacity: 0.7 }}>AVIF/WebP بمقاسين (480/960) في <code>public/p/</code> — الأصول (491MB) مش بتتخدم أبداً.</p>
        <ul style={{ columns: 2 }}>
          {m.realCodesWithDerivatives.map((c) => <li key={c} className="digits">{c}</li>)}
        </ul>
        <h2>الخلايا بدون صورة ({m.cells.length})</h2>
        <ul>
          {m.cells.map((x) => (
            <li key={x.subsection + x.color}>{x.subsection} — {x.color} (<span className="digits">{x.pieces}</span> قطعة)</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
