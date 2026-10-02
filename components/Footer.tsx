import { LogoLockup } from './Logo';
import { COLLECTIONS } from '@/data/commercial';

/** Premium SHE footer (§55) — elegant, not corporate. */
export function Footer({ lang }: { lang: 'ar' | 'en' }) {
  const ar = lang === 'ar';
  return (
    <footer className="she-footer">
      <div className="wrap footer-grid">
        <div>
          <LogoLockup />
          <p style={{ opacity: 0.75, marginTop: 8 }}>
            {ar ? 'SHE مش مجرد ستور — هي هوية أزياء. BE YOU .. ALWAYS.' : 'SHE IS NOT JUST A STORE — a fashion identity. BE YOU .. ALWAYS.'}
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }} aria-label="Social">
            <a href="https://instagram.com/she.shoes.27" target="_blank" rel="noreferrer" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="TikTok">TikTok</a>
            <a href="#" aria-label="WhatsApp">WhatsApp</a>
          </div>
        </div>
        <nav aria-label="Shop">
          <strong className="latin-track">SHOP</strong>
          <br /><a href="/bags">{ar ? 'الشنط' : 'Bags'}</a>
          <br /><a href="/shoes">{ar ? 'الشوز' : 'Shoes'}</a>
          <br /><a href="/offers">{ar ? 'العروض' : 'Offers'}</a>
          <br /><a href="/shop">{ar ? 'الكل' : 'All'}</a>
        </nav>
        <nav aria-label="Collections">
          <strong className="latin-track">WORLDS</strong>
          {COLLECTIONS.slice(0, 5).map((c) => (
            <span key={c.slug}><br /><a href={`/collections/${c.slug}`}>{ar ? c.name.ar : c.name.en}</a></span>
          ))}
          <br /><a href="/collections" style={{ opacity: 0.7 }}>{ar ? 'كل العوالم' : 'All worlds'}</a>
        </nav>
        <nav aria-label="SHE">
          <strong className="latin-track">SHE</strong>
          <br /><a href="/story">{ar ? 'الحكاية' : 'Story'}</a>
          <br /><a href="/my-she">My SHE</a>
          <br /><a href="/atelier">{ar ? 'الأتيليه' : 'Atelier'}</a>
          <br /><a href="/inner-circle">{ar ? 'الدايرة القريبة' : 'Inner Circle'}</a>
          <br /><a href="/social">{ar ? 'عالم SHE' : 'Social'}</a>
        </nav>
        <nav aria-label="Care">
          <strong className="latin-track">CARE</strong>
          <br /><a href="/checkout">{ar ? 'التوصيل' : 'Delivery'}</a>
          <br /><a href="/checkout">{ar ? 'الاستبدال والاسترجاع' : 'Returns'}</a>
          <br /><a href="#privacy">{ar ? 'الخصوصية' : 'Privacy'}</a>
          <br /><a href="#terms">{ar ? 'الشروط' : 'Terms'}</a>
        </nav>
      </div>
      <div className="wrap" style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid color-mix(in srgb, var(--fg) 10%, transparent)', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <small style={{ opacity: 0.6 }}>SHE — BE YOU .. ALWAYS · <a href="https://instagram.com/she.shoes.27">Instagram @she.shoes.27</a></small>
        <small style={{ opacity: 0.6 }}><a href="?lab=1">Experience Lab</a> (dev)</small>
      </div>
    </footer>
  );
}
