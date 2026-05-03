import { gsap, reducedMotion } from '@/animations/gsap';
import type { TimelineFactory } from '@/hooks/useSceneScroll';

/**
 * Scene 01 — Opening Shot exit timeline.
 *
 * Scroll range: pinned for 80vh of scroll.
 * The hero title + meta gently fade and contract as you leave,
 * making the transition feel like pulling back from a title card.
 */
export const heroTimeline: TimelineFactory = (container, tl) => {
  const title    = container.querySelector('[data-gsap="title"]');
  const subtitle = container.querySelector('[data-gsap="subtitle"]');
  const rule     = container.querySelector('[data-gsap="rule"]');
  const cue      = container.querySelector('[data-gsap="cue"]');
  const metaL    = container.querySelector('[data-gsap="meta-left"]');
  const metaR    = container.querySelector('[data-gsap="meta-right"]');

  /* All elements must exist — skip if scene isn't mounted */
  if (!title) return;

  /* Reduced motion: skip the scroll-exit animation entirely */
  if (reducedMotion) return;

  tl
    /* Title drifts up and fades — camera pulling away from the frame */
    .to(title, { yPercent: -8, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.3)
    /* Rule and subtitle follow a beat later */
    .to([rule, subtitle], { opacity: 0, yPercent: -4, duration: 0.4, ease: 'power2.in' }, 0.45)
    /* Meta counters fade earliest — peripheral detail goes first */
    .to([metaL, metaR], { opacity: 0, duration: 0.3, ease: 'none' }, 0.1)
    /* Scroll cue fades as soon as scrolling starts */
    .to(cue, { opacity: 0, yPercent: 10, duration: 0.2, ease: 'none' }, 0);
};
