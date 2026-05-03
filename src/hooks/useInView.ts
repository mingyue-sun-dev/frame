'use client';

import { useEffect, useRef, useState } from 'react';

interface Options {
  /**
   * Fraction of the element that must be visible before firing.
   * 0.15 works well for most scene entrances.
   */
  threshold?: number;
  /**
   * Expand or contract the root viewport.
   * Negative bottom margin (`"0px 0px -80px"`) fires slightly before
   * the element fully enters — creates a more eager feeling entrance.
   */
  rootMargin?: string;
  /**
   * Once true (default), the observer disconnects after the first
   * intersection so cinematic entrances never reverse on scroll-up.
   */
  once?: boolean;
}

/**
 * Returns [ref, inView].
 *
 * Attach ref to the DOM element you want to observe.
 * Drive Framer Motion's `animate` prop with `inView`:
 *
 *   const [ref, inView] = useInView()
 *   <motion.div ref={ref} animate={inView ? "visible" : "hidden"} />
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: Options = {},
) {
  const { threshold = 0.15, rootMargin = '0px', once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView] as const;
}
