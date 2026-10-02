'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_LAYERS, HERO_STATEMENTS } from '@/data/commercial';
import { ArtVisual } from './commercial';

/**
 * SHE Hero — cinematic boutique entry.
 * Concept: RIGHT → INSIDE → LEFT camera drift, scroll controls progression.
 * Video slot: set data-hero-video src via config later; procedural fallback now.
 * 7 graphic layers move along straight lines (appear → travel → disappear).
 * Reduced motion: static composed frame, replay still works.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [statementIdx, setStatementIdx] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Scroll progress within hero
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
        setProgress(p);
        if (!reduced.current) setStatementIdx(Math.min(HERO_STATEMENTS.length - 1, Math.floor(p * HERO_STATEMENTS.length)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [replayKey]);

  const replay = useCallback(() => {
    setReplayKey((k) => k + 1);
    setProgress(0);
    setStatementIdx(0);
    ref.current?.scrollIntoView({ behavior: reduced.current ? 'auto' : 'smooth' });
  }, []);

  const st = HERO_STATEMENTS[statementIdx];

  return (
    <section ref={ref} className="hero" aria-label="SHE boutique entry" data-progress={progress.toFixed(2)}>
      {/* Boutique environment — video slot (real branch video replaces fallback) */}
      <div className="hero-env" aria-hidden="true">
        <div className="hero-env-glow" style={{ transform: `translateX(${(progress - 0.5) * 60}px)` }} />
        <div className="hero-env-floor" />
        <p className="hero-env-sign latin-track">SHE · BOUTIQUE</p>
      </div>

      {/* Camera drift: entire layer row translates RIGHT → LEFT with scroll */}
      <div className="hero-layers" key={replayKey} aria-hidden="false">
        {HERO_LAYERS.map((layer, i) => {
          // Each layer owns a scroll window: appear → straight-line travel → disappear
          const windowSize = 1 / HERO_LAYERS.length;
          const start = i * windowSize;
          const local = (progress - start) / windowSize; // 0..1 within own window
          const visible = local > -0.3 && local < 1.3;
          const x = 120 - local * 240; // straight line travel (px)
          const opacity = local < 0 ? Math.max(0, 1 + local * 3) : local > 1 ? Math.max(0, 1 - (local - 1) * 3) : 1;
          return (
            <div
              key={layer.id}
              className="hero-layer"
              style={{
                opacity: visible ? opacity : 0,
                transform: `translateX(${x}px) scale(${0.92 + Math.max(0, Math.min(1, local + 0.3)) * 0.08})`,
                zIndex: i + 1,
                visibility: visible ? 'visible' : 'hidden',
              }}
            >
              <div style={{ width: 150 }}>
                <ArtVisual art={layer.art} label={layer.label.en} kind={layer.kind} />
                <small style={{ display: 'block', marginTop: 6, opacity: 0.75 }}>{layer.label.ar}</small>
              </div>
            </div>
          );
        })}
      </div>

      {/* Choreographed typography */}
      <div className="hero-type">
        <p className="latin-track hero-kicker">BE.. U.. ALWAYS</p>
        <h1 key={statementIdx} className="hero-statement">
          <span lang="en" className="latin-track">{st.en}</span>
          <span lang="ar">{st.ar}</span>
        </h1>
        {/* scroll progress */}
        <div className="hero-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Boutique entry progress">
          <div className="hero-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="hero-hint">{progress < 0.05 ? 'اسكرولي وادخلي البوتيك ↓' : progress > 0.95 ? 'REAL BOUTIQUE → DIGITAL SHE WORLD' : '… أنتِ جوه SHE'}</p>
      </div>

      {/* 3 CTAs */}
      <div className="hero-ctas">
        <a className="btn btn-primary" href="/shop">تسوقي الآن / SHOPPING NOW</a>
        <a className="btn btn-ghost" href="/collections">EXPLORE THE COLLECTION</a>
        <button className="btn btn-ghost" onClick={replay} aria-label="Replay hero animation">↻ REPLAY HERO</button>
      </div>
    </section>
  );
}
