'use client';

import { useEffect } from 'react';
import { useMotionValue } from 'framer-motion';

/**
 * Tracks raw mouse position as Framer Motion MotionValues.
 *
 * Returns { x, y } — both are live MotionValues, not React state,
 * so cursor movement never triggers component re-renders.
 *
 * Start off-screen (-200) so the custom cursor doesn't flash
 * at (0,0) before the first mousemove fires.
 *
 * Usage:
 *   const { x, y } = useCursor()
 *   <motion.div style={{ x, y }} />
 */
export function useCursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onLeave = () => {
      x.set(-200);
      y.set(-200);
    };

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y]);

  return { x, y } as const;
}
