import { DEMO_SOCIAL } from '@/data/commercial';
import { ArtVisual } from '@/components/commercial';

/** SHE Social World — campaign moments, BTS, product moments (§33). Editorial, not a widget. */
export default function SocialPage() {
  return (
    <div className="wrap">
      <section className="section">
        <p className="latin-track section-kicker">SHE SOCIAL WORLD</p>
        <h1>عالم SHE</h1>
        <p style={{ opacity: 0.7 }}>لحظات الحملات · الكواليس · لحظات المنتج · مقتطفات العوالم.</p>
        <p>
          <a className="btn btn-ghost" href="https://instagram.com/she.shoes.27" target="_blank" rel="noreferrer">Instagram</a>{' '}
          <span style={{ opacity: 0.5, fontSize: 13 }}>Facebook · TikTok · WhatsApp — تُحدد من الإعدادات</span>
        </p>
      </section>
      <section className="section" aria-label="Social moments">
        <div className="social-grid">
          {DEMO_SOCIAL.map((s) => (
            <figure key={s.id} className="social-tile">
              <ArtVisual art={s.art} label={s.caption.en} />
              <figcaption>
                <strong>{s.caption.ar}</strong>
                <br /><small style={{ opacity: 0.6 }}><span lang="en">{s.caption.en}</span> · <em>{s.kind}</em></small>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
