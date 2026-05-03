'use client';

import { motion } from 'framer-motion';
import { FM, DURATION } from '@/animations/easings';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition — "fade from black" cinematic page entrance.
 *
 * A fixed dark overlay covers the entire viewport (including the persistent
 * Nav) and fades out as the page mounts, revealing content underneath.
 * Mimics the film dissolve-from-black technique.
 *
 * Used in template.tsx, which re-instantiates on every navigation.
 * The overlay is position:fixed with a very high z-index so it sits above
 * the Nav (z-nav = 500) during the transition.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          duration: DURATION.slow,
          delay: 0.06,
          ease: FM.dissolve,
        }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--color-black)',
          zIndex: 9990,
          pointerEvents: 'none',
        }}
      />
      {children}
    </>
  );
}
