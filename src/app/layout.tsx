import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Cormorant } from 'next/font/google';
import '../styles/globals.css';
import { Nav } from '@/components/Nav';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Cursor } from '@/components/Cursor';

/* ── Fonts ───────────────────────────────────────────── */

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

/*
  Cormorant Garamond — display font.
  Light (300) is our default; we also load regular and medium
  so scene components can step up weight for emphasis without
  a separate font request.
*/
const cormorant = Cormorant({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

/* ── Metadata ────────────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    default: 'Frame',
    template: '%s — Frame',
  },
  description:
    'A cinematic scroll experience. Every frame matters.',
  openGraph: {
    title: 'Frame',
    description: 'A cinematic scroll experience. Every frame matters.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#080808',
  colorScheme: 'dark',
};

/* ── Root layout ─────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable}`}
    >
      <body>
        {/* Keyboard users jump directly to main content */}
        <a href="#main-content" className="skip-link">Skip to content</a>

        {/* Film grain — CSS only, no JS cost */}
        <div className="film-grain" aria-hidden="true" />

        {/* Letterbox framing bars */}
        <div className="letterbox-top"  aria-hidden="true" />
        <div className="letterbox-bottom" aria-hidden="true" />

        {/* Scroll progress — MotionValue-driven, zero re-renders */}
        <ScrollProgress />

        {/* Custom cursor — native cursor is hidden globally via CSS */}
        <Cursor />

        {/* Persistent navigation — sits just below the letterbox bar */}
        <Nav />

        {children}
      </body>
    </html>
  );
}
