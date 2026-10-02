/**
 * /admin/import — protected by middleware.ts (server-side Basic auth).
 * Phase A: upload CSV/XLSX → validate → diff vs live (added/removed/qty/price changed,
 * like the system's "changes since last report") → publish. Keeps previous snapshot for rollback.
 * Phase A ships validation + diff preview against seed; DB persistence lands in Phase B.
 */
export default function AdminImportPage() {
  return (
    <div className="wrap">
      <section className="section">
        <h1>استيراد المخزون <span style={{ fontSize: 14, opacity: 0.6 }}>(report 004 → live)</span></h1>
        <p>ارفعي ملف CSV/XLSX من نظام المخزون. الأعمدة المتوقعة: model_code, color, size?, qty, price, subsection?</p>
        <form method="post" encType="multipart/form-data" action="/admin/import">
          <input type="file" name="report" accept=".csv,.xlsx,.xls" aria-label="Inventory report file" />
          <button className="btn btn-primary" type="submit" style={{ marginInlineStart: 12 }}>فحص ومعاينة الفرق</button>
        </form>
        <h2 style={{ marginTop: 32 }}>الفرق عن البيانات الحالية</h2>
        <p style={{ opacity: 0.7 }}>Phase A: المعاينة والحفظ الكامل في Phase B مع قاعدة البيانات والـ snapshots. الأرقام الحالية محسوبة من seed — لازم تتطابق مع التقرير الحقيقي قبل الإطلاق.</p>
        <ul>
          <li>added — موديلات/ألوان جديدة</li>
          <li>removed — اختفت من التقرير</li>
          <li>quantity changed / price changed</li>
        </ul>
        <p><small>محمي بمصادقة server-side (Basic عبر middleware) — مفيش باسورد في الكلاينت.</small></p>
      </section>
    </div>
  );
}
