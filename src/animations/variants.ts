/**
 * Framer Motion variant presets for Frame.
 *
 * Variants are pure data — no JSX, no component imports.
 * Import and compose them inside scene components.
 *
 * Pattern:
 *   <motion.div variants={fadeUp} initial="hidden" animate="visible" />
 *
 * For scroll-triggered entrances, pair with useInView:
 *   animate={inView ? "visible" : "hidden"}
 */

import type { Variants } from 'framer-motion';
import { FM, DURATION } from './easings';

/* ── Text entrances ──────────────────────────────────── */

/**
 * Title rises from below an overflow-hidden mask.
 * Wrap each line in <span style={{ overflow:'hidden' }}>.
 */
export const titleReveal: Variants = {
  hidden:  { y: '105%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: DURATION.cinematic, ease: FM.reveal },
  },
};

/**
 * Subtle upward drift with fade — body text, captions.
 */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: FM.cinematic },
  },
};

/**
 * Fade only — for elements that shouldn't move.
 */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: FM.dissolve },
  },
};

/**
 * Element slides in from the right edge.
 */
export const slideInRight: Variants = {
  hidden:  { x: '100%', opacity: 0 },
  visible: {
    x: '0%',
    opacity: 1,
    transition: { duration: DURATION.cinematic, ease: FM.snap },
  },
};

/* ── Graphic entrances ───────────────────────────────── */

/**
 * Horizontal wipe from left — rule lines, chapter labels.
 * Apply to a div with a fixed height and background color.
 */
export const wipeRight: Variants = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: DURATION.slow, ease: FM.snap },
  },
};

/**
 * Clip-path curtain pull — full-bleed image reveals.
 * inset(0 100% 0 0) → inset(0 0% 0 0)
 */
export const curtainReveal: Variants = {
  hidden:  { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: DURATION.epic, ease: FM.snap },
  },
};

/**
 * Scale + fade — images, video thumbnails, scene cards.
 * Parent must have overflow:hidden for the scale to be clipped.
 */
export const scaleReveal: Variants = {
  hidden:  { scale: 1.06, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: DURATION.epic, ease: FM.cinematic },
  },
};

/* ── Containers ──────────────────────────────────────── */

/**
 * Stagger children with a short delay between each.
 * Wrap around a list of motion elements that each have a variant.
 */
export const stagger: Variants = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

/**
 * Slower stagger — for large display titles split by word.
 */
export const staggerSlow: Variants = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.1,
    },
  },
};

/* ── Exit variants ───────────────────────────────────── */

/**
 * Standard exit — fade down, used for page transitions.
 */
export const fadeDown: Variants = {
  hidden:  { opacity: 1, y: 0 },
  exit:    {
    opacity: 0,
    y: 24,
    transition: { duration: DURATION.normal, ease: FM.exit },
  },
};
