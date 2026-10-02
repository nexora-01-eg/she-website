/**
 * /order/[code] — confirmation with order code + WhatsApp deep link.
 * wa href passed as query (built server-side in the API); fallback rebuilds nothing (no fake data).
 */
export default async function OrderPage({
  params, searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ wa?: string }>;
}) {
  const { code } = await params;
  const { wa } = await searchParams;
  return (
    <div className="wrap">
      <section className="section" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '3rem', margin: 0 }}>🤍</p>
        <h1>طلبك اتسجل يا قمر</h1>
        <p>رقم الطلب: <strong className="digits" style={{ color: 'var(--she-pink)', fontSize: '1.3rem' }}>{code}</strong></p>
        <p style={{ opacity: 0.7 }}>خطوة واحدة وتخلصي: ابعتي الطلب واتساب للتأكيد.</p>
        {wa ? (
          <a className="btn btn-primary" href={decodeURIComponent(wa)} target="_blank" rel="noreferrer">
            تأكيد على واتساب
          </a>
        ) : (
          <p>ارجعي لـ <a href="/shop">الشوب</a>.</p>
        )}
        <p><a href="/shop">كمّلي تسوق</a></p>
      </section>
    </div>
  );
}
