'use client';
import { useEffect, useState } from 'react';
import { ButterflyMark, Wordmark } from './Logo';

/** Preloader ≤2s — butterfly/wordmark reveal, never a progress bar. Returning visitors skip. */
export function Preloader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem('she-seen')) { setDone(true); return; }
    } catch { /* ignore */ }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => {
      setDone(true);
      try { sessionStorage.setItem('she-seen', '1'); } catch { /* ignore */ }
    }, reduced ? 200 : 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`preloader${done ? ' done' : ''}`} aria-hidden={done}>
      <div style={{ textAlign: 'center' }}>
        <ButterflyMark size={72} />
        <div style={{ marginTop: 8 }}><Wordmark color="#FFF8F2" /></div>
        <p className="latin-track" style={{ fontSize: 11, letterSpacing: 4, opacity: 0.8 }}>BE YOU .. ALWAYS</p>
      </div>
    </div>
  );
}
