'use client';

import { motion } from 'framer-motion';
import { FM, DURATION } from '@/animations/easings';
import { CinematicText } from '@/components/CinematicText';
import { useSceneScroll } from '@/hooks/useSceneScroll';
import { heroTimeline } from '@/animations/timelines/hero';

/**
 * Scene 01 — Opening Shot
 *
 * Full black. One title. A breath.
 *
 * CinematicText drives the hero title with:
 *   — char-by-char reveal (blur → sharp)
 *   — letterSpacing tension (0.28em) → release (-0.03em)
 *   — SVG turbulence distortion flash at peak of reveal
 *   — subtitle word-by-word after with letterSpacing exhale
 *
 * GSAP exit: the whole title block fades and drifts up as you scroll away.
 */
export function OpeningShot() {
  const containerRef = useSceneScroll(heroTimeline, {
    pin: true,
    pinDuration: '80%',
    start: 'top top',
    scrub: 1.2,
  });

  return (
    <section
      ref={containerRef}
      id="scene-hero"
      style={{ minHeight: '100dvh' }}
      className="relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Vignette — darkened edges like an old film frame */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Frame counter — top left */}
      <motion.div
        data-gsap="meta-left"
        className="absolute t-mono text-foreground/15"
        style={{ top: 'calc(clamp(20px,3.2vh,40px) + 2rem)', left: '2rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: DURATION.slow, ease: FM.dissolve }}
      >
        001
      </motion.div>

      {/* Aspect label — top right */}
      <motion.div
        data-gsap="meta-right"
        className="absolute t-mono text-foreground/15"
        style={{ top: 'calc(clamp(20px,3.2vh,40px) + 2rem)', right: '2rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: DURATION.slow, ease: FM.dissolve }}
      >
        2.39:1
      </motion.div>

      {/* ── Main title block ── */}
      {/*
        data-gsap="title" — GSAP exit target: whole block fades + drifts up as
        user scrolls past the pin. CinematicText handles the entrance.
      */}
      <div data-gsap="title" className="relative text-center px-6 select-none">

        {/*
          Hero title — CinematicText variant="hero" intensity=1:
            1. Chars arrive one by one, blurry → sharp, from below
            2. LetterSpacing collapses from 0.28em → -0.03em mid-reveal (tension → release)
            3. SVG turbulence flash at peak — film gate under pressure
          The SVG filter defs are rendered as a hidden sibling by the component.
        */}
        <CinematicText
          text="Frame"
          as="h1"
          variant="hero"
          intensity={1}
          trigger="onMount"
          delay={0.9}
          className="t-hero text-foreground"
          style={{ textAlign: 'center' }}
        />

        {/* Hairline rule — wipes in after last character settles */}
        <motion.div
          data-gsap="rule"
          className="mx-auto mt-6 h-px bg-accent/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ originX: 0.5, width: '3rem' }}
          transition={{
            delay: 2.4,
            duration: DURATION.cinematic,
            ease: FM.snap,
          }}
        />

        {/*
          Subtitle — CinematicText variant="subtitle" intensity=0.75:
            1. Words appear one by one — film dialogue style
            2. Lighter blur + y-travel (0.75× intensity)
            3. LetterSpacing exhale: briefly widens then settles, like breath released
        */}
        <CinematicText
          text="A cinematic scroll experience"
          as="p"
          variant="subtitle"
          intensity={0.75}
          trigger="onMount"
          delay={3.0}
          className="t-label text-foreground/30"
          style={{ justifyContent: 'center', marginTop: '1.5rem' }}
        />
      </div>

      {/* ── Scroll cue — bottom center ── */}
      <motion.div
        data-gsap="cue"
        className="absolute flex flex-col items-center gap-3"
        style={{ bottom: 'calc(clamp(20px,3.2vh,40px) + 2.5rem)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 3.8,
          duration: DURATION.slow,
          ease: FM.dissolve,
        }}
      >
        <span className="t-mono text-foreground/25">Scroll</span>
        <motion.div
          className="w-px bg-gradient-to-b from-accent/50 to-transparent"
          style={{ height: '3rem' }}
          animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.4, 0.9, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: 2.4,
            ease: FM.cinematic,
          }}
        />
      </motion.div>
    </section>
  );
}
