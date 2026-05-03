import { gsap, reducedMotion } from '@/animations/gsap';
import type { TimelineFactory } from '@/hooks/useSceneScroll';

/**
 * Scene 02 — Establishing Scene parallax timeline.
 *
 * Replaces Framer Motion useScroll/useTransform parallax.
 * Two columns move at different speeds — left at 0.5× scroll rate,
 * right at 1× — creating editorial depth without a pin.
 */
export const establishingTimeline: TimelineFactory = (container, tl) => {
  const bg       = container.querySelector('[data-gsap="bg"]');
  const colLeft  = container.querySelector('[data-gsap="col-left"]');
  const colRight = container.querySelector('[data-gsap="col-right"]');

  if (!colLeft || !colRight) return;
  if (reducedMotion) return;

  tl
    /* Background gradient drifts subtly — slowest layer */
    .fromTo(bg,       { yPercent: -2 }, { yPercent: 2,  ease: 'none', duration: 1 }, 0)
    /* Left column: slower drift — anchor/label feels grounded */
    .fromTo(colLeft,  { yPercent: 3  }, { yPercent: -3, ease: 'none', duration: 1 }, 0)
    /* Right column: faster drift — editorial content breathes with scroll */
    .fromTo(colRight, { yPercent: 6  }, { yPercent: -6, ease: 'none', duration: 1 }, 0);
};
