'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DemoProduct } from '@/data/commercial';
import { useAtelier, useMyShe } from '@/lib/atelier';

/* Procedural fashion visual — swappable with real imagery later.
 * Renders boutique-grade gradient + silhouette + monogram. Never breaks. */
export function ArtVisual({
  art, label, kind, ratio = '4/5', large = false,
}: {
  art: { bg: string; bg2: string; accent: string };
  label: string;
  kind?: string;
  ratio?: string;
  large?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{
        aspectRatio: ratio,
        borderRadius: 'var(--radius-m)',
        background: `radial-gradient(120% 90% at 80% 10%, ${art.bg2} 0%, ${art.bg} 55%, ${art.bg} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {/* lighting sweep */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '-20%', pointerEvents: 'none',
        background: `linear-gradient(115deg, transparent 40%, ${art.accent}22 48%, transparent 56%)`,
      }} />
      {/* silhouette */}
      <svg aria-hidden="true" viewBox="0 0 120 140" style={{ width: large ? '46%' : '38%', opacity: 0.92 }}>
        {kind === 'shoe' ? (
          <g fill="none" stroke={art.accent} strokeWidth="4" strokeLinecap="round">
            <path d="M18 108 C 40 108, 55 96, 70 78 L 96 44 L 104 52 L 78 88 C 66 104, 48 116, 22 116 Z" fill={`${art.accent}33`} />
            <line x1="88" y1="60" x2="98" y2="106" />
          </g>
        ) : (
          <g fill="none" stroke={art.accent} strokeWidth="4" strokeLinecap="round">
            <path d="M35 60 h50 l7 52 h-64 Z" fill={`${art.accent}2e`} />
            <path d="M48 60 c0-16 24-16 24 0" />
            <circle cx="60" cy="86" r="4" fill={art.accent} stroke="none" />
          </g>
        )}
      </svg>
      <span aria-hidden="true" style={{
        position: 'absolute', bottom: 10, insetInlineStart: 12,
        fontFamily: 'var(--font-display)', fontSize: large ? 22 : 13,
        letterSpacing: '0.12em', color: art.accent, opacity: 0.9,
      }}>
        SHE
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

/* Premium demo product card: hover angle swap, color switch, angles dots, offer + availability */
export function DemoProductCard({ p, lang = 'ar' }: { p: DemoProduct; lang?: 'ar' | 'en' }) {
  const { add } = useAtelier();
  const { has, toggle } = useMyShe();
  const [colorIdx, setColorIdx] = useState(0);
  const [angleIdx, setAngleIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const color = p.colors[colorIdx] ?? p.colors[0];
  const saved = has(p.code, color.key);
  const discount = p.comparePrice ? Math.round((1 - p.price / p.comparePrice) * 100) : 0;

  // hover cycles lifestyle/detail; dots allow manual angle preview (6-angle mini carousel)
  const shownAngle = hover ? p.angles[(angleIdx + 4) % p.angles.length] : p.angles[angleIdx % p.angles.length];

  return (
    <article className="demo-card" style={{ opacity: 1 }}>
      <a
        href={`/product/${p.slug}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ display: 'block', textDecoration: 'none' }}
        aria-label={lang === 'ar' ? p.name.ar : p.name.en}
      >
        <div style={{ filter: `hue-rotate(${colorIdx * 14}deg)` }}>
          <ArtVisual art={p.art} label={`${p.name.en} — ${shownAngle}`} kind={p.kind} />
        </div>
      </a>
      <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="coll-label">{p.collection}</span>
        {discount > 0 && <span className="offer-label">-{discount}%</span>}
        {p.limited && <span className="limited-label">LIMITED</span>}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }} role="group" aria-label="colors">
        {p.colors.map((c, i) => (
          <button
            key={c.key}
            title={lang === 'ar' ? c.ar : c.en}
            aria-label={c.en}
            aria-pressed={i === colorIdx}
            onClick={() => setColorIdx(i)}
            style={{ background: 'none', border: 0, cursor: 'pointer', padding: 2 }}
          >
            <span className="color-dot" style={{ background: c.hex, outline: i === colorIdx ? '2px solid var(--she-pink)' : 'none' }} />
          </button>
        ))}
      </div>
      {/* 6-angle mini carousel dots */}
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }} role="group" aria-label="angles">
        {p.angles.map((a, i) => (
          <button
            key={a} onClick={() => setAngleIdx(i)} aria-label={a} title={a}
            style={{
              width: 22, height: 6, borderRadius: 99, border: 0, cursor: 'pointer',
              background: i === (angleIdx % p.angles.length) ? 'var(--she-pink)' : 'color-mix(in srgb, var(--fg) 18%, transparent)',
            }}
          />
        ))}
        <small style={{ opacity: 0.55, marginInlineStart: 4 }}>{shownAngle}{p.interior ? ' · interior' : ''}</small>
      </div>
      <h3 style={{ margin: '8px 0 2px', fontSize: '1rem' }}>
        <a href={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>{lang === 'ar' ? p.name.ar : p.name.en}</a>
      </h3>
      <small style={{ opacity: 0.6 }}>{p.code} · {lang === 'ar' ? color.ar : color.en}</small>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <strong className="price digits">{p.price.toLocaleString('en-US')} EGP</strong>
        {p.comparePrice && <s style={{ opacity: 0.5 }} className="digits">{p.comparePrice.toLocaleString('en-US')}</s>}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          className="btn btn-primary"
          style={{ flex: 1, padding: '8px 10px', fontSize: 13 }}
          onClick={() => add({ modelCode: p.code, name: p.name.ar, color: color.ar, price: p.price })}
        >
          {lang === 'ar' ? 'أضيفي للأتيليه' : 'Add to Atelier'}
        </button>
        <button
          aria-label={saved ? 'Remove from My SHE' : 'Save to My SHE'}
          aria-pressed={saved}
          onClick={() => toggle({ modelCode: p.code, color: color.key, slug: p.slug, name: p.name.ar, price: p.price })}
          style={{ background: 'transparent', border: '1px solid color-mix(in srgb, var(--fg) 20%, transparent)', borderRadius: 999, width: 36, height: 36, cursor: 'pointer', color: saved ? 'var(--she-pink)' : 'inherit', fontSize: 17 }}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
    </article>
  );
}

/* Cinematic intro — ≤8s, SKIP, logo reveal front/back. Respects reduced motion. */
export function CinematicIntro() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem('she-intro-seen')) { setGone(true); return; }
    } catch { /* ignore */ }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setGone(true); return; }
    setShow(true);
    const t = setTimeout(dismiss, 3200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dismiss = useCallback(() => {
    setShow(false);
    try { sessionStorage.setItem('she-intro-seen', '1'); } catch { /* ignore */ }
    setTimeout(() => setGone(true), 600);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismiss]);
  if (gone) return null;
  return (
    <div className={`intro ${show ? 'on' : 'off'}`} role="dialog" aria-label="SHE intro" aria-hidden={!show}>
      <div className="intro-card">
        <div className="intro-logo" aria-hidden="true">
          <div className="intro-face intro-front">SHE</div>
          <div className="intro-face intro-back">BE.. U.. ALWAYS</div>
        </div>
        <p className="latin-track" style={{ color: 'var(--she-pink)', fontSize: 12 }}>BE.. U.. ALWAYS</p>
      </div>
      <button className="btn btn-ghost intro-skip" onClick={dismiss}>SKIP</button>
    </div>
  );
}

/* Sound — OFF by default, elegant toggle, low-volume ambient via WebAudio (no files). */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode[]; gain: GainNode } | null>(null);
  useEffect(() => () => {
    nodesRef.current?.osc.forEach((o) => { try { o.stop(); } catch { /* ignore */ } });
    ctxRef.current?.close().catch(() => undefined);
  }, []);
  const toggle = async () => {
    if (on) {
      nodesRef.current?.osc.forEach((o) => { try { o.stop(); } catch { /* ignore */ } });
      ctxRef.current?.close().catch(() => undefined);
      ctxRef.current = null; nodesRef.current = null;
      setOn(false);
      return;
    }
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      ctxRef.current = ctx;
      const gain = ctx.createGain();
      gain.gain.value = 0.035; // low volume, never overpower
      gain.connect(ctx.destination);
      const osc = [110, 164.8, 220].map((f) => {
        const o = ctx.createOscillator();
        o.type = 'sine'; o.frequency.value = f;
        o.connect(gain); o.start();
        return o;
      });
      nodesRef.current = { osc, gain };
      setOn(true);
    } catch { /* audio unavailable — stay off */ }
  };
  return (
    <button
      onClick={toggle} aria-pressed={on} aria-label={on ? 'Mute atmosphere' : 'Play atmosphere'}
      title="Atmosphere (off by default)"
      style={{ background: 'transparent', border: '1px solid color-mix(in srgb, var(--fg) 20%, transparent)', borderRadius: 999, padding: '6px 12px', cursor: 'pointer', color: 'inherit', fontSize: 13 }}
    >
      {on ? '♪ ON' : '♪ OFF'}
    </button>
  );
}

/* SHE EXPERIENCE LAB — hidden dev panel (?lab=1), never in production nav. */
const LAB_KEY = 'she-lab-v1';
export interface LabState {
  heroVideo: boolean; threeD: boolean; glass: boolean; bigType: boolean;
  horizontal: boolean; sixAngle: boolean; product3d: boolean; sound: boolean;
  heavyMotion: boolean; editorial: boolean; worlds: boolean;
  atelier: boolean; myshe: boolean; innerCircle: boolean;
  motion: 'full' | 'balanced' | 'minimal';
  quality: 'cinematic' | 'balanced' | 'essential';
}
const DEFAULT_LAB: LabState = {
  heroVideo: true, threeD: true, glass: false, bigType: true,
  horizontal: true, sixAngle: true, product3d: false, sound: false,
  heavyMotion: true, editorial: true, worlds: true,
  atelier: true, myshe: true, innerCircle: true,
  motion: 'full', quality: 'cinematic',
};

export function useLab(): [LabState, (p: Partial<LabState>) => void] {
  const [lab, setLab] = useState<LabState>(DEFAULT_LAB);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAB_KEY);
      if (raw) setLab({ ...DEFAULT_LAB, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);
  const patch = useCallback((p: Partial<LabState>) => {
    setLab((prev) => {
      const next = { ...prev, ...p };
      try { localStorage.setItem(LAB_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      document.documentElement.dataset.motion = next.motion;
      document.documentElement.dataset.quality = next.quality;
      return next;
    });
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = lab.motion;
    document.documentElement.dataset.quality = lab.quality;
  }, [lab.motion, lab.quality]);
  return [lab, patch];
}

export function ExperienceLab() {
  const [lab, patch] = useLab();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('lab') === '1') setOpen(true);
  }, []);
  if (!open) return null;
  const toggles: Array<[keyof LabState, string]> = [
    ['heroVideo', 'HERO VIDEO'], ['threeD', '3D'], ['glass', 'GLASS EFFECTS'],
    ['bigType', 'LARGE TYPOGRAPHY'], ['horizontal', 'HORIZONTAL SECTIONS'],
    ['sixAngle', '6-ANGLE'], ['product3d', 'PRODUCT 3D'], ['sound', 'SOUND'],
    ['heavyMotion', 'HEAVY MOTION'], ['editorial', 'EDITORIAL LAYOUT'],
    ['worlds', 'COLLECTION WORLDS'], ['atelier', 'ATELIER'],
    ['myshe', 'MY SHE'], ['innerCircle', 'INNER CIRCLE'],
  ];
  return (
    <aside aria-label="SHE Experience Lab" style={{
      position: 'fixed', insetInlineEnd: 12, bottom: 12, zIndex: 90,
      background: 'var(--she-black)', color: 'var(--she-cream)',
      borderRadius: 16, padding: 14, width: 250, fontSize: 12,
      boxShadow: '0 12px 40px rgba(0,0,0,.35)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong className="latin-track">SHE EXPERIENCE LAB</strong>
        <button onClick={() => setOpen(false)} aria-label="Close lab" style={{ background: 'none', border: 0, color: 'inherit', cursor: 'pointer' }}>✕</button>
      </div>
      <small style={{ opacity: 0.6 }}>dev only (?lab=1) — hidden from customers</small>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
        {toggles.map(([k, label]) => (
          <button
            key={k} onClick={() => patch({ [k]: !lab[k] } as Partial<LabState>)}
            aria-pressed={!!lab[k]}
            style={{
              borderRadius: 8, border: 0, padding: '6px 4px', cursor: 'pointer', fontSize: 10,
              background: (lab[k] as boolean) ? 'var(--she-pink)' : '#333', color: '#fff',
            }}
          >
            {label} {lab[k] ? 'ON' : 'OFF'}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <small>MOTION: </small>
        {(['full', 'balanced', 'minimal'] as const).map((m) => (
          <button key={m} onClick={() => patch({ motion: m })} aria-pressed={lab.motion === m}
            style={{ marginInlineEnd: 4, borderRadius: 6, border: 0, padding: '4px 8px', cursor: 'pointer', background: lab.motion === m ? 'var(--she-green)' : '#333', color: '#fff', fontSize: 10 }}>
            {m.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 6 }}>
        <small>QUALITY: </small>
        {(['cinematic', 'balanced', 'essential'] as const).map((q) => (
          <button key={q} onClick={() => patch({ quality: q })} aria-pressed={lab.quality === q}
            style={{ marginInlineEnd: 4, borderRadius: 6, border: 0, padding: '4px 8px', cursor: 'pointer', background: lab.quality === q ? 'var(--she-orange)' : '#333', color: '#fff', fontSize: 10 }}>
            {q.toUpperCase()}
          </button>
        ))}
      </div>
    </aside>
  );
}

export function LabOpener() {
  return (
    <a href="?lab=1" aria-label="Open Experience Lab"
      style={{ position: 'fixed', insetInlineStart: 10, bottom: 10, zIndex: 80, fontSize: 11, opacity: 0.35, textDecoration: 'none' }}>
      LAB
    </a>
  );
}
