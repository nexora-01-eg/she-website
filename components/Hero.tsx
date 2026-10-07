'use client';
import { useEffect, useRef, useState } from 'react';
import { SHE_CONFIG } from '@/data/config';
import { ButterflyMark } from './Logo';

/**
 * SHE signature hero — NEXORA experience build (Concept C + editorial rails).
 * No dependency added on purpose (§25): rAF parallax + IntersectionObserver,
 * transform/opacity only, one primary motion per screen.
 * - Statements mask-reveal with scroll; posters travel straight calm rails.
 * - Reduced motion / mobile: static composition, same story, no parallax.
 * - Posters are real SHE campaign shots (brand ambience, not product claims).
 */
const STATEMENTS = SHE_CONFIG.hero.statements;
const POSTERS = [...SHE_CONFIG.hero.posters];

export function Hero({ pieces, models, variants }: { pieces: number; models: number; variants: number }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [calm, setCalm] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 720px)');
    const apply = () => setCalm(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    if (mq.matches) return () => mq.removeEventListener?.('change', apply);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    if (ref.current) io.observe(ref.current);

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!visible || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const vh = window.innerHeight;
        // progress 0→1 while hero crosses the viewport
        const p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
        setActive(Math.min(STATEMENTS.length - 1, Math.floor(p * STATEMENTS.length)));
        const imgs = ref.current.querySelectorAll<HTMLElement>('[data-rail]');
        imgs.forEach((el) => {
          const speed = Number(el.dataset.rail || '1');
          el.style.transform = `translateY(${(p * 90 * speed).toFixed(1)}px)`;
        });
        const wing = ref.current.querySelector<HTMLElement>('[data-wing]');
        if (wing) wing.style.transform = `scale(${(0.7 + p * 0.5).toFixed(3)})`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      io.disconnect();
      mq.removeEventListener?.('change', apply);
    };
  }, [replayKey]);

  return (
    <section ref={ref} aria-label="SHE hero" className="hero"
      style={{ position: 'relative', overflow: 'hidden', minHeight: '92svh', display: 'grid', alignItems: 'center' }}>
      <style>{`
        .hero-statements { position: relative; min-height: 3.2em; }
        .hero-statement { position: absolute; inset: 0; margin: 0; opacity: 0; clip-path: inset(0 0 100% 0); transition: opacity var(--dur-slow) var(--ease-enter), clip-path var(--dur-slow) var(--ease-enter); }
        .hero-statement.on { opacity: 1; clip-path: inset(0 0 0% 0); }
        .hero-rail img { width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: var(--radius-l); background: color-mix(in srgb, var(--fg) 8%, var(--bg)); }
        @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr !important; } .hero-rail.extra { display: none; } }
      `}</style>

      <div className="wrap hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'var(--space-8)', alignItems: 'center', width: '100%' }}>
        <div>
          <p className="latin-track" style={{ color: 'var(--she-pink)' }}>BE YOU .. ALWAYS</p>
          <div className="hero-statements" aria-live="polite">
            {STATEMENTS.map((s, i) => (
              <h1 key={s} className={`hero-statement latin-track${(calm ? i === 0 : i === active) ? ' on' : ''}`}>{s}</h1>
            ))}
          </div>
          <div data-wing style={{ margin: 'var(--space-2) 0' }}>
            <ButterflyMark size={54} />
          </div>
          <p>شنط وشوز بستايلك انتي — اختاري لونك ومقاسك واطلبي على واتساب في دقيقة.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href="/shop">تسوقي الآن / SHOP NOW</a>
            <a className="btn btn-ghost" href="/collections">EXPLORE THE COLLECTION</a>
            <button className="btn btn-ghost" onClick={() => { setActive(0); setReplayKey((k) => k + 1); window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); }}>
              REPLAY
            </button>
          </div>
          <p style={{ opacity: 0.65, fontSize: 13, marginTop: 12 }}>
            <span className="digits">{pieces}</span> قطعة · <span className="digits">{models}</span> موديل · <span className="digits">{variants}</span> لون — كل الأرقام محسوبة من البيانات.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }} aria-hidden="false" aria-label="SHE campaign posters">
          {[0, 1, 2].map((rail) => (
            <div key={rail} className={rail === 2 ? 'hero-rail extra' : 'hero-rail'} style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
              {POSTERS.filter((_, i) => i % 3 === rail).map((src, j) => (
                <div key={src} data-rail={calm ? undefined : (0.4 + rail * 0.35 + j * 0.1).toFixed(2)}>
                  <img src={src} alt="SHE campaign" loading={rail === 0 && j === 0 ? 'eager' : 'lazy'} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
