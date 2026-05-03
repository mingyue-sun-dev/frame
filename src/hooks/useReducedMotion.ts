'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true if the user has requested reduced motion via their OS settings.
 *
 * All animation components should respect this. When true, skip or
 * drastically shorten transitions rather than removing them entirely —
 * the page still needs to communicate state changes.
 *
 * Usage:
 *   const reduced = useReducedMotion()
 *   <motion.div animate={inView ? 'visible' : 'hidden'}
 *     transition={{ duration: reduced ? 0 : DURATION.cinematic }} />
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
