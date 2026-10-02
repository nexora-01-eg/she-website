import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Marquee } from '@/components/Marquee';
import { Footer } from '@/components/Footer';
import { Preloader } from '@/components/Preloader';
import { ButterflyProgress } from '@/components/Butterfly';
import { AtelierProvider } from '@/lib/atelier';
import { AtelierDrawer } from '@/components/AtelierDrawer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';

/**
 * Fonts (subset, display=swap, preload only display+text):
 * Latin display serif high-contrast: Fraunces. Arabic pairing equal weight: IBM Plex Sans Arabic.
 * Justification: Fraunces gives fashion-editorial contrast; Plex Arabic is clean modern with
 * full Arabic + Latin coverage so digits/prices stay consistent. Arabic never letter-spaced (CSS).
 */
const display = Fraunces({ subsets: ['latin'], display: 'swap', variable: '--font-display' });
const text = IBM_Plex_Sans_Arabic({ subsets: ['arabic', 'latin'], weight: ['400', '500', '700'], display: 'swap', variable: '--font-text' });

export const metadata: Metadata = {
  title: { default: 'SHE — BE YOU .. ALWAYS | شنط وشوز', template: '%s — SHE' },
  description: 'SHE — women’s luxury bags & shoes in Egypt. شنط وشوز — اطلبي على واتساب.',
  alternates: { languages: { ar: '/', en: '/en' } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // AR default, RTL. EN toggle switches dir+fonts cleanly (Phase B: /en parallel routes).
  return (
    <html lang="ar" dir="rtl" data-theme="light">
      <body className={`${display.variable} ${text.variable}`}>
        <a className="skip" href="#main">تخطي للمحتوى</a>
        <AtelierProvider>
          <Preloader />
          <Marquee lang="ar" />
          <Header lang="ar" />
          <ButterflyProgress />
          <main id="main">{children}</main>
          <Footer lang="ar" />
          <AtelierDrawer />
          <WhatsAppFloat />
        </AtelierProvider>
      </body>
    </html>
  );
}
