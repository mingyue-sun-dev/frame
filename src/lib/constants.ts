/**
 * Project-wide constants for Frame.
 * Numeric and string values that appear in more than one file belong here.
 */

/* ── Breakpoints (px) ────────────────────────────────── */
export const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
} as const;

/* ── Scene IDs ───────────────────────────────────────── */
/*
  Keep IDs in one place so anchor links and ScrollTrigger
  selectors never fall out of sync.
*/
export const SCENE_IDS = {
  hero:       'scene-hero',
  manifesto:  'scene-manifesto',
  method:     'scene-method',
  work:       'scene-work',
  contact:    'scene-contact',
} as const;

export type SceneId = (typeof SCENE_IDS)[keyof typeof SCENE_IDS];

/* ── Timing (ms, for non-GSAP usage) ────────────────── */
export const TIMING = {
  debounce: 100,
  resize:   150,
} as const;

/* ── Aspect ratios ───────────────────────────────────── */
export const ASPECT = {
  scope:    '239/100',  /* 2.39:1 anamorphic */
  wide:     '16/9',
  classic:  '4/3',
} as const;
