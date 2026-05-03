'use client';

import { useInView } from '@/hooks/useInView';
import { useSceneScroll } from '@/hooks/useSceneScroll';
import { climaxTimeline } from '@/animations/timelines/climax';
import { ChapterLabel } from '@/components/ChapterLabel';
import { CinematicText } from '@/components/CinematicText';

const QUOTE_WORDS = [
  'The', 'most', 'powerful', 'moments', 'live', 'in', 'the',
  'tension', 'between', 'stillness', 'and', 'motion.',
] as const;

const ACCENT_WORDS = new Set(['stillness', 'motion.']);

/**
 * Scene 04 — Climax  (the visual centrepiece)
 *
 * Architecture: five layered depth planes, all driven by a single
 * GSAP scrubbed timeline. No Framer Motion in this scene.
 *
 * Depth layers (back → front):
 *   L1  bg-canvas      Full-bleed background. Scale 1.08→1.0→0.97
 *                      and a warm amber gradient that rises from below —
 *                      like footlights in a darkened theater.
 *
 *   L2  bg-number      Large "04" in Cormorant, opacity 0→0.07→0.
 *                      Scale 0.86→1.02. A typographic texture, felt not read.
 *
 *   L3  glow           Radial gold bloom. Builds to peak, recedes on resolution.
 *
 *   L4  film-lines     Horizontal framing lines above/below the quote.
 *                      Extend from centre at entry, retract at peak —
 *                      the film gate "opening" to fully expose the frame.
 *
 *   L5  block          The content: chapter label, quote words, gold rule,
 *                      attribution. GSAP drives every element here.
 *
 * Emotional arc:
 *   0.00  Void — screen is dark, canvas scale zoomed in
 *   0.08  Background texture materialises, glow ignites at edge
 *   0.12  Framing lines extend — the screen is being prepared
 *   0.18  First word appears — "The"
 *   0.40  Last word appears — "motion." — all words visible
 *   0.43  Gold rule extends
 *   0.46  Distortion flash — film gate wobble at maximum pressure
 *   0.52  Lines retract — frame fully exposed, distortion clears
 *   0.56  Accent words flare (stillness, motion.)
 *   0.64  Resolution begins: glow recedes, texture fades
 *   0.74  Camera pullback — content block drifts up, opacity → 0
 *   0.97  Cut to dark — ready for Resolution scene
 *
 * data-gsap targets (queried by climaxTimeline):
 *   "bg-canvas"      Outermost background scale/temperature layer
 *   "bg-number"      Typographic texture container (opacity)
 *   "bg-number-inner" Typographic texture text (scale)
 *   "glow"           Radial bloom container (opacity)
 *   "film-line-top"  Top horizontal framing line
 *   "film-line-bottom" Bottom horizontal framing line
 *   "block"          Content block — distortion flash + pullback
 *   "word"           Each quote word — staggered entry
 *   "line"           Gold extending rule
 *   data-gsap-accent Quote accent words — textShadow flare at peak
 */
export function ClimaxScene() {
  const containerRef = useSceneScroll(climaxTimeline, {
    pin: true,
    pinDuration: '160%',
    start: 'top top',
    scrub: 1.5,
  });

  const [labelRef, labelInView] = useInView<HTMLDivElement>({ threshold: 0.5 });

  return (
    <section
      ref={containerRef}
      id="scene-climax"
      className="relative overflow-hidden"
      style={{ background: 'var(--color-black)' }}
    >

      {/* ──────────────────────────────────────────────────────── L1 */}
      {/*
        Background canvas — scale zoom + color temperature.
        The warm gradient rising from below simulates tungsten footlights:
        the theater has found its light source. Starts 8% zoomed in,
        breathes inward to full (1.0), then pulls back (0.97) on exit.
      */}
      <div
        data-gsap="bg-canvas"
        className="absolute inset-0"
        aria-hidden="true"
        style={{ willChange: 'transform' }}
      >
        {/* Color temperature: amber warmth from below, void above */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 200% 80% at 50% 115%, rgba(42,22,8,0.95) 0%, rgba(16,10,4,0.5) 40%, transparent 65%)',
          }}
        />
        {/* Secondary: faint radial centre point — depth origin */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(20,12,4,0.4) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* ──────────────────────────────────────────────────────── L2 */}
      {/*
        Typographic texture — large "04" materialises behind the quote.
        Opacity never exceeds 0.07: it's sensed as texture, not read as text.
        Scale grows from 0.86→1.02 as the scene builds — the background
        itself is expanding as the foreground fills in. Creates genuine
        Z-depth without 3D transforms.
      */}
      <div
        data-gsap="bg-number"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
        style={{ opacity: 0 }}
      >
        <span
          data-gsap="bg-number-inner"
          style={{
            fontFamily:    'var(--font-cormorant)',
            fontWeight:    300,
            fontSize:      'clamp(10rem, 42vw, 52rem)',
            lineHeight:    1,
            letterSpacing: '-0.06em',
            color:         'var(--color-ivory)',
            display:       'block',
            willChange:    'transform',
            userSelect:    'none',
          }}
        >
          04
        </span>
      </div>

      {/* ──────────────────────────────────────────────────────── L3 */}
      {/*
        Ambient gold bloom — the one concession to warm light in this void.
        Opacity: 0 → 0.14 (peak) → 0. The very large blur radius
        (100px) spreads it across most of the frame at opacity > 0.
        Uses an outer div for opacity animation (compositor), so the
        expensive blur recalculation doesn't run on every frame.
      */}
      <div
        data-gsap="glow"
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ opacity: 0, willChange: 'opacity' }}
      >
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width:    '90vw',
            height:   '70vh',
            background:
              'radial-gradient(ellipse at center, rgba(200,169,110,1) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* ──────────────────────────────────────────────────────── L4 */}
      {/*
        Film framing lines — extend from the centre as the scene loads,
        framing the quote like a film gate around an exposed frame.
        At peak they retract: the gate is fully open, the image exposed.
        Position is clamp-based so they always bracket the quote block
        regardless of font-size scaling.
      */}
      <div
        data-gsap="film-line-top"
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          left:             '5vw',
          right:            '5vw',
          top:              'calc(50% - clamp(8.5rem, 17vw, 14rem))',
          height:           '1px',
          background:
            'linear-gradient(to right, transparent, var(--color-gold-dim) 28%, var(--color-gold-dim) 72%, transparent)',
          opacity:           0,
          willChange:        'transform, opacity',
        }}
      />
      <div
        data-gsap="film-line-bottom"
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          left:             '5vw',
          right:            '5vw',
          top:              'calc(50% + clamp(8.5rem, 17vw, 14rem))',
          height:           '1px',
          background:
            'linear-gradient(to right, transparent, var(--color-gold-dim) 28%, var(--color-gold-dim) 72%, transparent)',
          opacity:           0,
          willChange:        'transform, opacity',
        }}
      />

      {/* ──────────────────────────────────────────────────────── L5 */}
      {/*
        Sticky content frame — always centred in the viewport during the pin.
        Outer div provides the sticky context; inner [data-gsap="block"]
        receives distortion and pullback animations from the timeline.
        Separating sticky from transform avoids the browser bug where
        both properties on the same element interfere.
      */}
      <div
        style={{
          position:    'sticky',
          top:          0,
          height:       '100vh',
          display:      'flex',
          alignItems:   'center',
        }}
      >
        <div
          data-gsap="block"
          className="relative px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full"
          style={{ willChange: 'opacity, transform' }}
        >
          {/* Chapter label — uses self-contained InView */}
          <div ref={labelRef} className="mb-10 lg:mb-12">
            {labelInView && <ChapterLabel number={4} label="Climax" dim />}
          </div>

          {/*
            Quote words — plain spans, all animation owned by climaxTimeline.
            data-gsap="word" targets every word for staggered entry.
            data-gsap-accent targets the two accent words for the peak flare.
          */}
          <div
            role="blockquote"
            aria-label="The most powerful moments live in the tension between stillness and motion."
            style={{
              display:    'flex',
              flexWrap:   'wrap',
              gap:        '0.5em',
              alignItems: 'baseline',
            }}
          >
            {QUOTE_WORDS.map((word, i) => {
              const isAccent = ACCENT_WORDS.has(word);
              return (
                <span
                  key={i}
                  data-gsap="word"
                  data-gsap-accent={isAccent ? 'true' : undefined}
                  style={{
                    opacity:        0,
                    fontFamily:    'var(--font-cormorant)',
                    fontWeight:     300,
                    fontSize:      'clamp(2.4rem, 6.5vw, 5.5rem)',
                    lineHeight:     1.05,
                    letterSpacing: '-0.02em',
                    color: isAccent ? 'var(--color-gold)' : 'var(--color-ivory)',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* Gold rule — climaxTimeline scales from left, duration synced to peak */}
          <div className="relative mt-14 h-px overflow-visible">
            <div
              data-gsap="line"
              style={{
                position:        'absolute',
                inset:            0,
                transform:       'scaleX(0)',
                transformOrigin: 'left center',
                background:
                  'linear-gradient(to right, var(--color-gold), var(--color-gold-dim))',
                willChange:      'transform',
              }}
            />
          </div>

          {/*
            Attribution — CinematicText variant="subtitle":
            Word-by-word film subtitle reveal when section enters viewport.
            Lives inside [data-gsap="block"] so it inherits the pullback
            opacity-fade on exit automatically (parent opacity cascade).
          */}
          <CinematicText
            text="Scene four — the tension holds"
            as="p"
            variant="subtitle"
            intensity={1}
            trigger="inView"
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      'var(--text-2xs)',
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              color:          'var(--color-ash)',
              marginTop:      '1.25rem',
            }}
          />
        </div>
      </div>
    </section>
  );
}
