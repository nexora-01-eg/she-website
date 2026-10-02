import missing from '@/data/missing-images.json';
import catalog from '@/data/zip-catalog.json';

/**
 * /admin/images — missing-images report (protected by middleware, server-side auth).
 * Launch minimum = one front per variant; angles optional, never broken slots.
 */
export default function AdminImagesPage() {
  const m = missing as {
    generatedAt: string;
    confirmedFronts: number;
    familyColorsWithFront: { bags: string[]; shoes: string[] };
    cellsWithoutFamilyColorImage: Array<{ subsection: string; color: string; pieces: number }>;
    realCodesWithFront: string[];
  };
  const c = catalog as { totalFiles: number; coverage: Array<{ realCode: string; files: number; colors: string[]; kinds: string[] }> };
  return (
    <div className="wrap">
      <section className="section">
        <h1>تقرير الصور الناقصة</h1>
        <p>أُنشئ: <span className="digits">{m.generatedAt}</span></p>
        <p>صور مؤكدة للموديلات (front لكل variant): <strong className="digits">{m.confirmedFronts}</strong> — الربط مستني تأكيدك على <code>data/image-mapping.csv</code> وملف المخزون.</p>
        <h2>تغطية عائلية (توضيحية)</h2>
        <p>شنط: {m.familyColorsWithFront.bags.join('، ') || '—'}</p>
        <p>شوز: {m.familyColorsWithFront.shoes.join('، ') || '—'}</p>
        <h2>خلايا sub×color بدون صورة عائلية ({m.cellsWithoutFamilyColorImage.length})</h2>
        <ul>
          {m.cellsWithoutFamilyColorImage.map((x) => (
            <li key={x.subsection + x.color}>{x.subsection} — {x.color} (<span className="digits">{x.pieces}</span> قطعة: هتظهر بصورة generic أو placeholder)</li>
          ))}
        </ul>
        <h2>الأكواد الحقيقية ({c.coverage.length} كود، {c.totalFiles} ملف)</h2>
        <ul>
          {c.coverage.map((r) => (
            <li key={r.realCode}><span className="digits">{r.realCode}</span> — <span className="digits">{r.files}</span> ملفات · {r.colors.join('/') || 'لون غير محدد'} · {r.kinds.join('/')}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
