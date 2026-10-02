'use client';
import { useEffect, useState } from 'react';
import { ButterflyMark } from './Logo';

/**
 * Concept C — The Butterfly Unfolds.
 * Doubles as scroll-progress indicator. Calm in reduced-motion.
 * Easter egg (Phase C): tap → flies across. Placeholder hook here.
 */
export function ButterflyProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setP(h > 0 ? Math.min(window.scrollY / h, 1) : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  const open = 0.35 + p * 0.65; // wings unfold with story
  return (
    <div className="butterfly-progress" aria-hidden="true" title={`Scroll ${Math.round(p * 100)}%`}>
      <div className="wings" style={{ transform: `scaleX(${open.toFixed(3)})` }}>
        <ButterflyMark size={30} />
      </div>
    </div>
  );
}
