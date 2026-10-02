import { PROMO_MESSAGES } from '@/data/commercial';

/**
 * Top promotional marquee (§06) — ~7 rotating offers, fast but readable,
 * campaign ticker feel. Content controlled by data/commercial.ts.
 */
export function Marquee({ lang }: { lang: 'ar' | 'en' }) {
  const text = PROMO_MESSAGES.map((m) => (lang === 'ar' ? m.ar : m.en)).join('  ✦  ');
  return (
    <div className="marquee" role="note" aria-label="Promotions">
      <div className="marquee-track marquee-fast" aria-hidden="false">
        <span>{text} ✦ {text}</span>
      </div>
    </div>
  );
}
