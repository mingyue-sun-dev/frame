'use client';

import { motion, useScroll } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Thin gold line at the very top of the viewport that tracks scroll progress.
 * Driven by a Framer Motion MotionValue — no React re-renders on scroll.
 * Returns null for users who prefer reduced motion.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position:        'fixed',
        top:              0,
        left:             0,
        right:            0,
        height:          '1px',
        background:      'linear-gradient(to right, var(--color-gold-dim), var(--color-gold), var(--color-gold-dim))',
        scaleX:           scrollYProgress,
        transformOrigin: '0% 50%',
        zIndex:          'var(--z-letterbox)',
        opacity:          0.6,
      }}
    />
  );
}
