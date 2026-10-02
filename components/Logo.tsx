/**
 * SHE logo set — SVG only, consistent across header/favicon/loader/footer/OG.
 * Variants: full lockup, wordmark-only, butterfly-only, one-color black, one-color cream.
 * Brand: pink script SHE + green swoosh + yellow/orange body.
 */
export function ButterflyMark({ variant = 'color', size = 40 }: { variant?: 'color' | 'black' | 'cream'; size?: number }) {
  const wing = variant === 'black' ? '#111111' : variant === 'cream' ? '#FFF8F2' : '#F7008A';
  const wing2 = variant === 'color' ? '#A8C833' : wing;
  const body = variant === 'color' ? '#FFC107' : wing;
  return (
    <svg width={size} height={size * 0.82} viewBox="0 0 64 52" role="img" aria-label="SHE butterfly" fill="none">
      {/* left wing */}
      <path d="M30 26C22 4 6 2 5 14c-1 9 12 12 25 12Z" fill={wing} />
      {/* right wing */}
      <path d="M34 26c8-22 24-24 25-12 1 9-12 12-25 12Z" fill={wing2} />
      {/* lower wings */}
      <path d="M30 28C24 42 14 44 13 36c-1-6 8-8 17-8Z" fill={wing} opacity="0.82" />
      <path d="M34 28c6 14 16 16 17 8 1-6-8-8-17-8Z" fill={wing2} opacity="0.82" />
      {/* body */}
      <ellipse cx="32" cy="26" rx="2.6" ry="9" fill={body} />
      <circle cx="32" cy="15" r="2.4" fill={variant === 'color' ? '#FF5A00' : wing} />
      {variant === 'color' && <path d="M8 44c10 4 34 4 48-2" stroke="#A8C833" strokeWidth="2.4" strokeLinecap="round" />}
    </svg>
  );
}

export function Wordmark({ color = '#F7008A' }: { color?: string }) {
  return (
    <svg width="86" height="30" viewBox="0 0 86 30" role="img" aria-label="SHE wordmark" fill="none">
      <text x="4" y="23" fontFamily="Fraunces, serif" fontSize="24" fontStyle="italic" fill={color} letterSpacing="1">
        SHE
      </text>
    </svg>
  );
}

export function LogoLockup({ theme = 'auto' }: { theme?: 'auto' | 'black' | 'cream' }) {
  const mono = theme === 'black' ? 'black' : theme === 'cream' ? 'cream' : 'color';
  const word = theme === 'cream' ? '#FFF8F2' : theme === 'black' ? '#111111' : '#F7008A';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} aria-label="SHE — BE YOU .. ALWAYS">
      <ButterflyMark variant={mono as 'color' | 'black' | 'cream'} size={34} />
      <Wordmark color={word} />
    </span>
  );
}
