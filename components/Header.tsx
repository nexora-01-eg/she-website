'use client';
import { useEffect, useState } from 'react';
import { LogoLockup } from './Logo';
import { SHE_CONFIG } from '@/data/config';
import { useAtelier } from '@/lib/atelier';
import { SoundToggle } from './commercial';

const NAV = [
  { href: '/', label: { ar: 'الرئيسية', en: 'HOME' } },
  { href: '/collections', label: { ar: 'كولكشن', en: 'COLLECTIONS' } },
  { href: '/bags', label: { ar: 'شنط', en: 'BAGS' } },
  { href: '/shoes', label: { ar: 'شوز', en: 'SHOES' } },
  { href: '/offers', label: { ar: 'العروض', en: 'OFFERS' } },
];

export function Header({ lang }: { lang: 'ar' | 'en' }) {
  const [compact, setCompact] = useState(false);
  const [hide, setHide] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { count, setOpen } = useAtelier();
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setCompact(y > 24);
      setHide(y > last && y > 220);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`site-header${compact ? ' compact' : ''}${hide ? ' hide' : ''}`}>
      <div className="header-inner">
        <a href={lang === 'ar' ? '/' : '/en'} aria-label="SHE home">
          <LogoLockup />
        </a>
        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>{lang === 'ar' ? n.label.ar : n.label.en}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a href="/shop" aria-label="Search">⌕</a>
          <a href="/my-she" aria-label="My SHE">♡</a>
          <button onClick={() => setOpen(true)} aria-label="Atelier" style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: '1rem', color: 'var(--fg)' }}>
            👜<span className="count digits">{mounted ? count : 0}</span>
          </button>
          <a href={lang === 'ar' ? '/en' : '/'} aria-label="Language">{lang === 'ar' ? 'EN' : 'AR'}</a>
          <span className="header-socials">
            <a href={SHE_CONFIG.brand.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">◍</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="TikTok">♪</a>
            <a href="#" aria-label="WhatsApp">✆</a>
          </span>
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}
