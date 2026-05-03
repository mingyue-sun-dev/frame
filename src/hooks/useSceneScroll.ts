'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { gsap, ScrollTrigger, initGSAP, reducedMotion } from '@/animations/gsap';

export interface SceneScrollConfig {
  /** Extra scroll distance pinned. '100%' = one viewport height of scroll. */
  pin?: boolean;
  pinDuration?: string;
  /** ScrollTrigger start/end overrides */
  start?: string;
  end?: string;
  scrub?: number | boolean;
}

export type TimelineFactory = (
  container: HTMLElement,
  timeline: gsap.core.Timeline,
) => void;

/**
 * Attaches a GSAP ScrollTrigger timeline to a scene container.
 *
 * Usage:
 *   const containerRef = useSceneScroll(buildMyTimeline, { pin: true, pinDuration: '150%' });
 *   <section ref={containerRef} ...>
 *
 * The factory receives the live container element and an empty scrubbed
 * timeline. Add tweens to the timeline — ScrollTrigger drives playhead.
 * All cleanup (kill + revert) happens automatically on unmount.
 */
export function useSceneScroll(
  factory: TimelineFactory,
  config: SceneScrollConfig = {},
): RefObject<HTMLElement | null> {
  const containerRef = useRef<HTMLElement>(null);
  /* Stable ref so effect deps don't thrash when factory is defined inline */
  const factoryRef = useRef<TimelineFactory>(factory);
  factoryRef.current = factory;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    initGSAP();

    const {
      pin = false,
      pinDuration = '100%',
      start = 'top top',
      end,
      scrub = 1,
    } = config;

    /* Reduced motion: no pinning or scrubbing — factory still runs to set
       initial visibility via gsap.set, but no scroll-driven playhead. */
    const effectivePin   = reducedMotion ? false : pin;
    const effectiveScrub = reducedMotion ? false : scrub;
    const resolvedEnd    = end ?? (effectivePin ? `+=${pinDuration}` : 'bottom top');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start,
        end: resolvedEnd,
        scrub: effectiveScrub,
        pin: effectivePin,
        anticipatePin: effectivePin ? 1 : 0,
        invalidateOnRefresh: true,
      },
    });

    factoryRef.current(container, tl);

    return () => {
      tl.scrollTrigger?.kill();
      tl.revert();
    };
    // config values are primitives — JSON-stringify them so effect reruns only on real changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.pin, config.pinDuration, config.start, config.end, config.scrub]);

  return containerRef as RefObject<HTMLElement | null>;
}
