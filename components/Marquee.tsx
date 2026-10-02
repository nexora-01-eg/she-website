import { SHE_CONFIG } from '@/data/config';

/** Promotional marquee — only active:true messages. Direction respects RTL via CSS. */
export function Marquee({ lang }: { lang: 'ar' | 'en' }) {
  const items = SHE_CONFIG.marquee.filter((m) => m.active);
  const text = items.map((m) => (lang === 'ar' ? m.ar : m.en)).join('  ✦  ');
  return (
    <div className="marquee" role="note" aria-label="Announcements">
      <div className="marquee-track" aria-hidden="false">
        <span>{text} ✦ {text}</span>
      </div>
    </div>
  );
}
