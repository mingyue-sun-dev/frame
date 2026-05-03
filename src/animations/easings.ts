/**
 * Canonical easing curves for Frame.
 *
 * All values are cubic-bezier control points [x1, y1, x2, y2].
 * Named after their cinematic analogue so intent is always clear.
 *
 * Usage (Framer Motion):  transition={{ ease: FM.snap }}
 * Usage (GSAP):           gsap.to(el, { ease: GSAP.snap })
 * Usage (CSS):            cubic-bezier(...CSS.snap)
 */

/* ── Raw cubic-bezier tuples ─────────────────────────── */
export const CURVES = {
  /** Slow, even push — dolly in/out, background parallax */
  cinematic:  [0.25, 0.1, 0.25, 1.0]  as const,

  /** Fast ramp, gentle land — hero title entrance, scene wipe */
  reveal:     [0.0,  0.0, 0.2,  1.0]  as const,

  /** Overshoot + settle — element snapping into position */
  settle:     [0.34, 1.56, 0.64, 1.0] as const,

  /** Exponential deceleration — rack-focus snap, curtain drop */
  snap:       [0.16, 1.0, 0.3,  1.0]  as const,

  /** Pure linear — opacity dissolves, colour cross-fades */
  dissolve:   [0.0,  0.0, 1.0,  1.0]  as const,

  /** Aggressive ease-in — element leaving frame */
  exit:       [0.55, 0.0, 1.0,  0.45] as const,
} as const;

/* ── Framer Motion ───────────────────────────────────── */
/**
 * Drop directly into Framer Motion `transition.ease`.
 * Framer accepts both strings and [x1,y1,x2,y2] arrays.
 */
export const FM = {
  cinematic:  'easeInOut'                         as const,
  reveal:     CURVES.reveal                       as [number,number,number,number],
  settle:     CURVES.settle                       as [number,number,number,number],
  snap:       CURVES.snap                         as [number,number,number,number],
  dissolve:   'linear'                            as const,
  exit:       CURVES.exit                         as [number,number,number,number],
} as const;

/* ── GSAP ────────────────────────────────────────────── */
/**
 * Pass to GSAP's `ease` option.
 * Matches GSAP's built-in ease names where possible;
 * falls back to CustomEase strings for the bespoke curves.
 */
export const GSAP = {
  cinematic:  'power2.inOut',
  reveal:     'power4.out',
  settle:     'back.out(1.4)',
  snap:       'expo.out',
  dissolve:   'none',
  exit:       'power3.in',
} as const;

/* ── CSS ─────────────────────────────────────────────── */
/**
 * For use in inline styles or Tailwind arbitrary values.
 * e.g. style={{ transitionTimingFunction: CSS.snap }}
 */
export const CSS = {
  cinematic:  `cubic-bezier(${CURVES.cinematic.join(',')})`,
  reveal:     `cubic-bezier(${CURVES.reveal.join(',')})`,
  settle:     `cubic-bezier(${CURVES.settle.join(',')})`,
  snap:       `cubic-bezier(${CURVES.snap.join(',')})`,
  dissolve:   'linear',
  exit:       `cubic-bezier(${CURVES.exit.join(',')})`,
} as const;

/* ── Duration constants (ms) ─────────────────────────── */
export const DURATION = {
  flash:      0.08,   // instant cut
  quick:      0.2,    // UI feedback
  normal:     0.4,    // standard transition
  slow:       0.7,    // deliberate motion
  cinematic:  1.1,    // dramatic entrance
  epic:       1.8,    // full-bleed reveal
} as const;
