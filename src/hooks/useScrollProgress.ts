'use client';

import { useEffect, useRef, useState } from 'react';

interface Options {
  /**
   * Observe a specific element instead of the full document.
   * Useful for per-scene progress bars or parallax depth layers.
   */
  target?: React.RefObject<HTMLElement | null>;
}

/**
 * Returns a 0–1 value representing scroll progress.
 *
 * Without a target: tracks total document scroll (0 = top, 1 = bottom).
 * With a target:    tracks how far the element has traversed the viewport
 *                   (0 = element enters bottom, 1 = element leaves top).
 *
 * Uses requestAnimationFrame to stay on the compositor thread.
 *
 * Usage:
 *   const progress = useScrollProgress()
 *   // drive a CSS variable or inline style
 *   style={{ transform: `scaleX(${progress})` }}
 */
export function useScrollProgress(options: Options = {}) {
  const { target } = options;
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const compute = (): number => {
      if (target?.current) {
        const rect = target.current.getBoundingClientRect();
        const total = rect.height + window.innerHeight;
        const elapsed = window.innerHeight - rect.top;
        return Math.max(0, Math.min(1, elapsed / total));
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? window.scrollY / max : 0;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setProgress(compute()));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initialise without waiting for a scroll event
    setProgress(compute());

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return progress;
}
