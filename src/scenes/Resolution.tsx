'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChapterLabel } from '@/components/ChapterLabel';
import { FadeScene } from '@/components/FadeScene';
import { useInView } from '@/hooks/useInView';
import { useSceneScroll } from '@/hooks/useSceneScroll';
import { resolutionTimeline } from '@/animations/timelines/resolution';
import { fadeUp, fadeIn, stagger } from '@/animations/variants';
import { FM, DURATION } from '@/animations/easings';

const CLOSING_WORDS = ['Still.', 'Quiet.', 'Present.'] as const;

/**
 * Scene 05 — Resolution
 *
 * Motion slows to stillness.
 * Three italic words arrive one by one — decelerating stagger.
 * GSAP ambient parallax carries closing words and end card upward.
 */
export function Resolution() {
  const containerRef = useSceneScroll(resolutionTimeline, {
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
  });

  const [wordsRef, wordsInView] = useInView<HTMLDivElement>({ threshold: 0.4 });
  const [endRef,   endInView]   = useInView<HTMLDivElement>({ threshold: 0.6 });

  return (
    <section
      ref={containerRef}
      id="scene-resolution"
      className="scene relative"
      style={{
        minHeight: '100vh',
        borderTop: '1px solid var(--color-iron)',
      }}
    >
      {/* ChapterLabel manages its own InView — no conditional needed */}
      <div className="max-w-7xl mx-auto">
        <ChapterLabel number={5} label="Resolution" />
      </div>

      {/* ── Three closing words ── */}
      <div ref={wordsRef} data-gsap="words" className="max-w-7xl mx-auto mt-16 lg:mt-28">
        <div className="flex flex-col gap-4">
          {CLOSING_WORDS.map((word, i) => (
            <motion.div
              key={word}
              variants={fadeUp}
              initial="hidden"
              animate={wordsInView ? 'visible' : 'hidden'}
              whileHover={{
                x: 10,
                transition: { duration: 0.55, ease: FM.cinematic },
              }}
              transition={{
                delay: i * 0.55,
                duration: DURATION.epic,
                ease: FM.cinematic,
              }}
              style={{ cursor: 'default' }}
            >
              <span
                style={{
                  fontFamily:   'var(--font-cormorant)',
                  fontWeight:   300,
                  fontStyle:    'italic',
                  fontSize:     'clamp(3.5rem, 10vw, 9rem)',
                  lineHeight:   1.0,
                  letterSpacing: '-0.03em',
                  color: i === 0
                    ? 'var(--color-silver)'
                    : i === 1
                    ? 'var(--color-ash)'
                    : 'var(--color-iron)',
                  display: 'block',
                }}
              >
                {word}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── End card ── */}
      <motion.div
        ref={endRef}
        data-gsap="end-card"
        variants={stagger}
        initial="hidden"
        animate={endInView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto mt-24 lg:mt-40 flex flex-col gap-10"
      >
        <motion.div
          variants={fadeIn}
          className="h-px w-full"
          style={{ background: 'var(--color-iron)' }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          {/* Left — closing line + fin. */}
          <FadeScene blur delay={0.2} y={12} className="flex flex-col gap-4">
            <p className="t-body" style={{ color: 'var(--color-ash)', maxWidth: '28rem' }}>
              Every frame finds its rest. The story does not end — it only
              changes what it asks of you.
            </p>

            <motion.span
              style={{
                fontFamily:    'var(--font-cormorant)',
                fontStyle:     'italic',
                fontWeight:    300,
                fontSize:      'clamp(1.2rem, 2vw, 1.6rem)',
                color:         'var(--color-gold)',
                letterSpacing: '0.05em',
                display:       'inline-block',
              }}
              whileHover={{
                letterSpacing: '0.12em',
                transition: { duration: 0.5, ease: FM.cinematic },
              }}
            >
              fin.
            </motion.span>
          </FadeScene>

          {/* Right — CTA */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-4 md:items-end"
          >
            <p className="t-label" style={{ color: 'var(--color-iron)' }}>
              Ready to make something?
            </p>

            <Link
              href="/about"
              className="group flex items-center gap-3 t-label"
              style={{ color: 'var(--color-dust)' }}
            >
              <span
                className="h-px inline-block cta-line"
                style={{ background: 'currentColor' }}
              />
              <span
                className="group-hover:text-accent transition-colors duration-500 group-hover:tracking-widest"
                style={{ transitionTimingFunction: 'cubic-bezier(0.16,1.0,0.3,1.0)' }}
              >
                About Frame
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Footer row */}
        <motion.div
          variants={fadeIn}
          className="flex items-center justify-between pt-4 pb-4"
          style={{ borderTop: '1px solid var(--color-iron)' }}
        >
          <span className="t-mono" style={{ color: 'var(--color-iron)' }}>
            Frame &mdash; A Cinematic Scroll Experience
          </span>
          <span className="t-mono" style={{ color: 'var(--color-iron)' }}>
            2025
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
