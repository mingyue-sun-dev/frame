import { gsap, reducedMotion } from '@/animations/gsap';
import type { TimelineFactory } from '@/hooks/useSceneScroll';

/**
 * Scene 04 — Climax pinned timeline.
 *
 * Scrubbed across 160vh of scroll (normalised 0→1 on this timeline).
 * Five depth layers animated in concert. Every number below is a
 * fraction of the total pin scroll distance.
 *
 * Emotional arc:
 *   Phase 1 · Entry      0.00–0.18  Void opens, background warms
 *   Phase 2 · Build      0.10–0.44  Framing lines + words arrive
 *   Phase 3 · Peak       0.40–0.60  Maximum complexity — one moment
 *   Phase 4 · Resolution 0.60–1.00  Everything recedes, breath released
 *
 * Performance contract:
 *   — opacity + transform only on composited layers (bg-canvas, glow,
 *     film-lines, bg-number, line)
 *   — filter used only for brief punctuation moments (distortion flash,
 *     word blur-in, accent flare) — never animated continuously
 *   — textShadow on accent words is a one-frame set/clear, not a tween
 */
export const climaxTimeline: TimelineFactory = (container, tl) => {
  /* ── Target acquisition ────────────────────────────────────────────── */
  const bgCanvas      = container.querySelector('[data-gsap="bg-canvas"]');
  const bgNumber      = container.querySelector('[data-gsap="bg-number"]');
  const bgNumberInner = container.querySelector('[data-gsap="bg-number-inner"]');
  const glow          = container.querySelector('[data-gsap="glow"]');
  const filmTop       = container.querySelector('[data-gsap="film-line-top"]');
  const filmBottom    = container.querySelector('[data-gsap="film-line-bottom"]');
  const block         = container.querySelector('[data-gsap="block"]');
  const words         = container.querySelectorAll('[data-gsap="word"]');
  const accentWords   = container.querySelectorAll('[data-gsap-accent="true"]');
  const line          = container.querySelector('[data-gsap="line"]');

  if (!words.length || !block) return;

  /* Reduced motion: make every element immediately visible, no timeline */
  if (reducedMotion) {
    gsap.set(words,    { opacity: 1, y: 0, filter: 'none' });
    gsap.set(block,    { opacity: 1, y: 0, skewX: 0, filter: 'none' });
    gsap.set(line,     { scaleX: 1 });
    gsap.set(bgCanvas, { scale: 1 });
    gsap.set(bgNumber, { opacity: 0.04 });
    return;
  }

  /* ════════════════════════════════════════════════════════════════════
     PHASE 1 — ENTRY  (0.00 – 0.18)
     Void opens. Background warms. The stage is being lit.
     ════════════════════════════════════════════════════════════════════ */

  /*
    BG CANVAS: zoomed in (1.08) at entry — intimate, claustrophobic.
    Breathes outward to 1.0 as the scene opens. The zoom-in start
    makes the initial void feel dense rather than simply empty.
  */
  tl.fromTo(bgCanvas,
    { scale: 1.08 },
    { scale: 1.0, ease: 'power1.inOut', duration: 0.45 },
    0,
  );

  /*
    TYPOGRAPHIC TEXTURE: the "04" materialises at the back of the space.
    Opacity rises slowly from 0 — texture precedes legibility.
    Scale from 0.86 → 1.0: the background expands as foreground fills in.
    Both animations run through to phase 3 to feel like a single motion.
  */
  tl.fromTo(bgNumber,
    { opacity: 0 },
    { opacity: 0.04, ease: 'power1.in', duration: 0.3 },
    0.06,
  );
  tl.fromTo(bgNumberInner,
    { scale: 0.86 },
    { scale: 1.0, ease: 'power2.out', duration: 0.55 },
    0.04,
  );

  /*
    GLOW: ignites at the very edge of the frame, barely perceptible.
    Will build toward peak across Phase 2.
  */
  tl.fromTo(glow,
    { opacity: 0 },
    { opacity: 0.05, ease: 'power2.in', duration: 0.28 },
    0.06,
  );

  /* ════════════════════════════════════════════════════════════════════
     PHASE 2 — BUILD  (0.10 – 0.44)
     The frame is being prepared. Words materialise from the dark.
     ════════════════════════════════════════════════════════════════════ */

  /*
    FILM FRAMING LINES: extend from centre — the film gate is being loaded.
    They appear simultaneously, top and bottom, creating a bracket around
    the space where the quote will live. scaleX 0→1, opacity 0→0.65.
    Staggered slightly (top first) for a mechanical "clamping" feel.
  */
  tl.fromTo(filmTop,
    { scaleX: 0, opacity: 0, transformOrigin: 'center' },
    { scaleX: 1, opacity: 0.65, ease: 'power2.out', duration: 0.18 },
    0.11,
  );
  tl.fromTo(filmBottom,
    { scaleX: 0, opacity: 0, transformOrigin: 'center' },
    { scaleX: 1, opacity: 0.65, ease: 'power2.out', duration: 0.18 },
    0.14,
  );

  /*
    GLOW BUILDS: continues rising through the word reveal.
    Two-segment rise so it accelerates into the peak.
  */
  tl.to(glow, { opacity: 0.10, ease: 'power1.in', duration: 0.22 }, 0.22);

  /*
    WORDS: staggered entry across the 0.18–0.44 window.
    Each word rises from y:16 and sharpens from blur(5px).
    The stagger ratio spaces them evenly so the last word arrives
    just as the gold line begins extending at 0.43.

    The 5px blur-in is brief (0.18s each) — felt as sharpening,
    not as a blur animation. Words always remain readable.
  */
  const wordArr    = Array.from(words);
  const totalWords = wordArr.length;
  wordArr.forEach((word, i) => {
    const ratio = i / (totalWords - 1);
    const start = 0.18 + ratio * 0.24;
    tl.fromTo(
      word,
      { opacity: 0, y: 16, filter: 'blur(5px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.18, ease: 'power3.out' },
      start,
    );
  });

  /* ════════════════════════════════════════════════════════════════════
     PHASE 3 — PEAK  (0.40 – 0.62)
     Maximum complexity. One moment where everything converges.
     This is what the entire scroll has been building toward.
     ════════════════════════════════════════════════════════════════════ */

  /*
    GOLD LINE: extends from left as the last words arrive.
    The line is the punctuation mark — it seals the quote.
  */
  tl.fromTo(line,
    { scaleX: 0, transformOrigin: 'left center' },
    { scaleX: 1, transformOrigin: 'left center', ease: 'power2.inOut', duration: 0.22 },
    0.43,
  );

  /*
    GLOW PEAK: reaches maximum warmth precisely as the line completes.
    The bg-number also reaches its highest opacity here.
  */
  tl.to(glow, { opacity: 0.14, ease: 'power2.in', duration: 0.10 }, 0.43);
  tl.to(bgNumber, { opacity: 0.07, ease: 'power1.in', duration: 0.10 }, 0.43);
  tl.to(bgNumberInner, { scale: 1.02, ease: 'power1.in', duration: 0.10 }, 0.43);

  /*
    DISTORTION FLASH — film gate under maximum pressure.
    At the exact peak, the frame wobbles: blur(2px) + skewX(0.35deg)
    for 0.06s (the flash), then power3 recovery over 0.3s.
    Duration must stay very short — this is impact, not effect.
    The scrub + 1.5s lag means users feel a brief resistance, not jank.
  */
  tl
    .to(block, {
      filter:   'blur(2px) contrast(1.1)',
      skewX:     0.35,
      duration:  0.06,
      ease:      'none',
    }, 0.46)
    .to(block, {
      filter:   'blur(0px) contrast(1)',
      skewX:     0,
      duration:  0.28,
      ease:      'power3.out',
    }, 0.52);

  /*
    ACCENT WORD FLARE: "stillness" and "motion." briefly luminous.
    textShadow animates from none to a warm gold halo and back.
    This adds emotional punctuation to the two words that carry
    the quote's entire weight. Kept very brief so it reads as
    a moment of emphasis, not a persistent glow.
  */
  if (accentWords.length) {
    tl
      .to(accentWords, {
        textShadow: '0 0 28px rgba(200,169,110,0.75), 0 0 60px rgba(200,169,110,0.25)',
        duration:    0.12,
        ease:        'power1.in',
      }, 0.48)
      .to(accentWords, {
        textShadow: '0 0 0px rgba(200,169,110,0)',
        duration:    0.45,
        ease:        'power2.out',
      }, 0.60);
  }

  /*
    FILM LINES RETRACT: the gate opens — frame fully exposed.
    They collapse back to scaleX:0 and fade. The moment the lines
    disappear, the quote stands alone in the void — maximum presence.
  */
  tl.to([filmTop, filmBottom], {
    scaleX:   0,
    opacity:   0,
    ease:      'power2.in',
    duration:  0.18,
  }, 0.53);

  /* ════════════════════════════════════════════════════════════════════
     PHASE 4 — RESOLUTION  (0.62 – 1.00)
     Everything recedes. The breath held at peak is released.
     Motion slows. The next scene (Resolution) waits in the dark.
     ════════════════════════════════════════════════════════════════════ */

  /*
    GLOW RECEDES in two stages: first a gradual draw-down, then a
    final fade to zero. The two stages prevent a sharp cutoff — the
    light goes out like a lamp being turned down, not switched off.
  */
  tl.to(glow, { opacity: 0.05, ease: 'power1.out', duration: 0.22 }, 0.63);
  tl.to(glow, { opacity: 0,    ease: 'power2.in',  duration: 0.18 }, 0.80);

  /*
    BACKGROUND TEXTURE dissolves as the glow recedes — without the
    warmth, the "04" loses its anchor and disappears.
  */
  tl.to(bgNumber, { opacity: 0, ease: 'power2.in', duration: 0.22 }, 0.66);
  tl.to(bgNumberInner, { scale: 0.96, ease: 'power2.in', duration: 0.26 }, 0.66);

  /*
    BG CANVAS PULLS BACK: the background itself retreats (scale 1.0 → 0.97).
    Combines with the block's yPercent to sell the camera-pulls-back metaphor:
    both background depth and foreground content move in the same direction.
  */
  tl.to(bgCanvas, { scale: 0.97, ease: 'power2.in', duration: 0.28 }, 0.70);

  /*
    CAMERA PULLBACK: the content block fades and drifts upward.
    yPercent: -4 — subtle, just enough to read as movement.
    opacity: 0 — clean exit. The block completely disappears before
    the pin ends so the transition to Scene 05 is seamless.
  */
  tl.to(block, {
    opacity:   0,
    yPercent: -4,
    ease:      'power2.in',
    duration:   0.24,
  }, 0.74);
};
