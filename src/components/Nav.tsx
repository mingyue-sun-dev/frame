'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FM, DURATION } from '@/animations/easings';

const LINKS = [
  { label: 'Home',   href: '/' },
  { label: 'Scenes', href: '/scenes' },
  { label: 'About',  href: '/about' },
] as const;

export function Nav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  /* Transparent → blurred dark as the user scrolls past the hero */
  const bg     = useTransform(scrollY, [0, 80], ['rgba(8,8,8,0)', 'rgba(8,8,8,0.82)']);
  const blur   = useTransform(scrollY, [0, 80], [0, 14]);
  const border = useTransform(scrollY, [0, 80], ['rgba(200,169,110,0)', 'rgba(200,169,110,0.08)']);

  return (
    <motion.header
      className="fixed left-0 right-0"
      style={{ top: 'clamp(20px, 3.2vh, 40px)', zIndex: 'var(--z-nav)' }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, delay: 0.5, ease: FM.reveal }}
    >
      {/* Scroll-reactive backdrop */}
      <motion.div
        className="absolute inset-0 border-b"
        style={{
          backgroundColor: bg,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          borderColor: border,
        }}
      />

      <div className="relative flex items-center justify-between px-6 md:px-12 py-4">
        {/* Wordmark */}
        <Link href="/" aria-label="Frame — home">
          <motion.span
            className="t-label text-foreground/60 hover:text-accent transition-colors duration-500"
            whileHover={{ letterSpacing: '0.55em' }}
            transition={{ duration: 0.5, ease: FM.cinematic }}
          >
            Frame
          </motion.span>
        </Link>

        {/* Links */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-8 md:gap-12">
            {LINKS.map((link, i) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: DURATION.normal,
                    delay: 0.6 + i * 0.07,
                    ease: FM.reveal,
                  }}
                >
                  <Link
                    href={link.href}
                    className={`t-label transition-colors duration-300 ${
                      isActive
                        ? 'text-accent'
                        : 'text-foreground/35 hover:text-foreground/75'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}
