import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * /admin/* — real server-side auth (Basic), never a client-side password.
 * Credentials live in host env: SHE_ADMIN_USER / SHE_ADMIN_PASS.
 * Timing-safe compare to avoid user enumeration via timing.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) return NextResponse.next();
  const user = process.env.SHE_ADMIN_USER ?? '';
  const pass = process.env.SHE_ADMIN_PASS ?? '';
  if (!user || !pass || pass === 'change-me-in-production') {
    // Fail closed when not configured.
    return new NextResponse('Admin not configured', { status: 503 });
  }
  const header = req.headers.get('authorization') ?? '';
  const [scheme, encoded] = header.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return new NextResponse('Auth required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="SHE admin"' } });
  }
  let decoded = '';
  try { decoded = Buffer.from(encoded, 'base64').toString('utf8'); } catch { /* fallthrough */ }
  const sep = decoded.indexOf(':');
  const u = sep >= 0 ? decoded.slice(0, sep) : '';
  const p = sep >= 0 ? decoded.slice(sep + 1) : '';
  if (!timingSafeEqual(u, user) || !timingSafeEqual(p, pass)) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
