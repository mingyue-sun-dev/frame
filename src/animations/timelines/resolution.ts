import { reducedMotion } from '@/animations/gsap';
import type { TimelineFactory } from '@/hooks/useSceneScroll';

/**
 * Scene 05 — Resolution ambient parallax timeline.
 *
 * No pin. Just a gentle vertical drift on the closing words
 * as the page comes to rest. Motion slows to nothing.
 */
export const resolutionTimeline: TimelineFactory = (container, tl) => {
  const words   = container.querySelector('[data-gsap="words"]');
  const endCard = container.querySelector('[data-gsap="end-card"]');

  if (!words) return;
  if (reducedMotion) return;

  tl
    /* Words drift upward slowly — stillness arriving */
    .fromTo(words,   { yPercent: 4  }, { yPercent: -2,  ease: 'none', duration: 1 }, 0)
    /* End card rises to meet the reader — final frame */
    .fromTo(endCard, { yPercent: 3  }, { yPercent: -1,  ease: 'none', duration: 1 }, 0);
};
