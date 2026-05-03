'use client';

import { motion } from 'framer-motion';
import { ChapterLabel } from '@/components/ChapterLabel';
import { TextReveal } from '@/components/TextReveal';
import { FadeScene } from '@/components/FadeScene';
import { useInView } from '@/hooks/useInView';
import { useSceneScroll } from '@/hooks/useSceneScroll';
import { establishingTimeline } from '@/animations/timelines/establishing';
import { fadeUp, stagger } from '@/animations/variants';

/**
 * Scene 02 — Establishing Scene
 *
 * The world opens. Context before conflict.
 * Two-column editorial layout with GSAP parallax depth.
 * Left column moves at 0.5× scroll rate, right at 1× — creates
 * editorial depth without a pin.
 */
export function EstablishingScene() {
  const containerRef = useSceneScroll(establishingTimeline, {
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
  });

  const [contentRef, contentInView] = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      ref={containerRef}
      id="scene-manifesto"
      className="scene relative overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Ambient background element — subtle depth signal */}
      <div
        data-gsap="bg"
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute"
          style={{
            top: '20%',
            left: '-10%',
            width: '60%',
            height: '60%',
            background:
              'radial-gradient(ellipse at center, rgba(200,169,110,0.03) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Vertical rule — left edge framing */}
      <div
        className="absolute left-6 md:left-12 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-iron) 20%, var(--color-iron) 80%, transparent)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 lg:gap-24 items-start">

          {/* ── Left — chapter meta + vertical pull ── */}
          <div data-gsap="col-left" className="pt-4 lg:pt-12">
            <ChapterLabel number={2} label="Establishing" />

            {/* Large chapter number — background typographic texture */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={contentInView ? 'visible' : 'hidden'}
              transition={{ delay: 0.1 }}
              className="t-display-italic select-none"
              style={{
                fontSize: 'clamp(6rem, 14vw, 12rem)',
                lineHeight: 1,
                color: 'var(--color-iron)',
                letterSpacing: '-0.05em',
                marginTop: '1rem',
              }}
            >
              02
            </motion.div>
          </div>

          {/* ── Right — editorial content ── */}
          <motion.div
            ref={contentRef}
            data-gsap="col-right"
            variants={stagger}
            initial="hidden"
            animate={contentInView ? 'visible' : 'hidden'}
            className="pt-4 lg:pt-24 flex flex-col gap-10"
          >
            <TextReveal
              lines={['Every story begins', 'with atmosphere.']}
              splitBy="lines"
              as="h2"
              blur
              delay={0.05}
              stagger={0.18}
              className="t-chapter"
              style={{ color: 'var(--color-foreground)' }}
            />

            <FadeScene blur delay={0.4} y={16} className="flex flex-col gap-6 max-w-xl">
              <p className="t-body text-foreground/55 leading-relaxed">
                Before action, there is observation. Before conflict, there is
                world. We build context one element at a time — each frame
                placed with the precision of a director composing an establishing shot.
              </p>
              <p className="t-body text-foreground/40 leading-relaxed">
                The eye needs to settle before it can be moved. The audience
                must trust the world before they can fear for it.
              </p>
            </FadeScene>

            <motion.div
              variants={fadeUp}
              className="flex items-center gap-5 pt-4"
            >
              <div
                className="h-px flex-1"
                style={{ maxWidth: '3rem', background: 'var(--color-iron)' }}
              />
              <span className="t-label" style={{ color: 'var(--color-ash)' }}>
                Scene two of five
              </span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
