import { reducedMotion } from '@/animations/gsap';
import type { TimelineFactory } from '@/hooks/useSceneScroll';

/**
 * Scene 03 — Rising Action parallax + header kinetics timeline.
 *
 * Replaces Framer Motion gridY transform.
 * The card grid shifts up as you scroll through, adding forward energy.
 * The header drifts upward faster — creates depth between header and cards.
 */
export const risingActionTimeline: TimelineFactory = (container, tl) => {
  const header = container.querySelector('[data-gsap="header"]');
  const grid   = container.querySelector('[data-gsap="grid"]');

  if (!grid) return;
  if (reducedMotion) return;

  tl
    /* Header drifts up at 1.5× scroll rate — disappears behind the cards */
    .fromTo(header, { yPercent: 3  }, { yPercent: -12, ease: 'none', duration: 1 }, 0)
    /* Card grid: moderate drift — builds kinetic energy before the climax */
    .fromTo(grid,   { yPercent: 3  }, { yPercent: -6,  ease: 'none', duration: 1 }, 0);
};
