import { LogoLockup } from './Logo';

export function Footer({ lang }: { lang: 'ar' | 'en' }) {
  const ar = lang === 'ar';
  return (
    <footer>
      <div className="wrap">
        <LogoLockup />
        <p>{ar ? 'BE YOU .. ALWAYS — شنط وشوز بستايلك انتي.' : 'BE YOU .. ALWAYS — bags & shoes in your style.'}</p>
        <nav aria-label="Footer" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href="/shop">{ar ? 'تسوقي' : 'Shop'}</a>
          <a href="/story">{ar ? 'حكايتنا' : 'Story'}</a>
          <a href="/delivery">{ar ? 'التوصيل' : 'Delivery'}</a>
          <a href="/returns">{ar ? 'الاستبدال والاسترجاع' : 'Returns'}</a>
          <a href="/privacy">{ar ? 'الخصوصية' : 'Privacy'}</a>
          <a href="/terms">{ar ? 'الشروط' : 'Terms'}</a>
        </nav>
        <p style={{ opacity: 0.7 }}>
          {ar ? 'واتساب: يُحدد من الإعدادات (TODO) — الفروع والمواعيد: TODO' : 'WhatsApp: from config (TODO) — branches & hours: TODO'}
          {' · '}<a href="https://instagram.com/she.shoes.27">Instagram @she.shoes.27</a>
        </p>
      </div>
    </footer>
  );
}
