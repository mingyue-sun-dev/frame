'use client';

/**
 * GSAP + ScrollTrigger bootstrap for Frame.
 *
 * Import `initGSAP()` once — inside a useEffect at the root
 * layout or a dedicated provider. All subsequent GSAP calls
 * across the app will have ScrollTrigger available.
 *
 * Import `scrollTo()` for programmatic scene jumps.
 * Import `killAll()` for cleanup on unmount.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { GSAP as EASE } from './easings';

let _initialized = false;

/**
 * True if the OS has requested reduced motion.
 * Set once during the first initGSAP() call (client-side).
 * All timeline factories and hooks check this before building tweens.
 */
export let reducedMotion = false;

/**
 * Register GSAP plugins. Safe to call multiple times —
 * subsequent calls are no-ops.
 */
export function initGSAP(): void {
  if (_initialized) return;
  reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* Default GSAP settings */
  gsap.defaults({
    ease: EASE.cinematic,
    duration: 1.1,
  });

  /* ScrollTrigger defaults */
  ScrollTrigger.defaults({
    toggleActions: 'play none none none',
  });

  _initialized = true;
}

/**
 * Animate an element into view, driven by ScrollTrigger.
 * Intended for elements that can't use Framer Motion variants
 * (e.g. canvas, SVG paths, WebGL containers).
 */
export function scrollReveal(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars = {},
  trigger?: gsap.TweenTarget,
): gsap.core.Tween {
  return gsap.from(target, {
    opacity: 0,
    y: 32,
    duration: 1.1,
    ease: EASE.reveal,
    ...vars,
    scrollTrigger: {
      trigger: (trigger ?? target) as gsap.DOMTarget,
      start: 'top 85%',
      toggleActions: 'play none none none',
      ...(typeof vars.scrollTrigger === 'object' ? vars.scrollTrigger : {}),
    },
  });
}

/**
 * Pin an element for the duration of a scroll sequence.
 * Used for horizontal scroll panels, parallax hero sections.
 */
export function pinScene(
  trigger: gsap.DOMTarget,
  opts: ScrollTrigger.StaticVars = {},
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: '+=100%',
    pin: true,
    anticipatePin: 1,
    ...opts,
  });
}

/**
 * Programmatically scroll to a scene by element or selector.
 * Respects the GSAP ticker so it stays in sync with animations.
 */
export function scrollTo(
  target: string | number | Element,
  duration = 1.4,
): gsap.core.Tween {
  return gsap.to(window, {
    scrollTo: target,
    duration,
    ease: EASE.cinematic,
  });
}

/**
 * Kill all live ScrollTrigger instances and tweens.
 * Call on page unmount or route change.
 */
export function killAll(): void {
  ScrollTrigger.getAll().forEach((st) => st.kill());
  gsap.killTweensOf('*');
}

export { gsap, ScrollTrigger };
