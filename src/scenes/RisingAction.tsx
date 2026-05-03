'use client';

import { motion } from 'framer-motion';
import { ChapterLabel } from '@/components/ChapterLabel';
import { TextReveal } from '@/components/TextReveal';
import { FadeScene } from '@/components/FadeScene';
import { useInView } from '@/hooks/useInView';
import { useSceneScroll } from '@/hooks/useSceneScroll';
import { risingActionTimeline } from '@/animations/timelines/risingAction';
import { wipeRight } from '@/animations/variants';
import { FM, DURATION } from '@/animations/easings';

const ACTS = [
  {
    index: '01',
    title: 'Composition',
    body:  'Where you place the camera determines what the audience believes. Layout is direction — every element either earns its space or wastes it.',
    from:  'left' as const,
  },
  {
    index: '02',
    title: 'Motion',
    body:  'Still images are facts. Moving images are arguments. Timing, easing, and velocity carry emotional information that words alone cannot.',
    from:  'right' as const,
  },
  {
    index: '03',
    title: 'Rhythm',
    body:  'The cut that lands at exactly the right moment makes you feel nothing consciously — and everything viscerally. Rhythm is invisible craft.',
    from:  'left' as const,
  },
] as const;

/**
 * Scene 03 — Rising Action
 *
 * Energy builds. The layout becomes more dynamic.
 * Alternating card entrances, asymmetric grid, increasing typographic weight.
 * GSAP parallax shifts the header and grid at different rates.
 */
export function RisingAction() {
  const containerRef = useSceneScroll(risingActionTimeline, {
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
  });

  const [headerRef, headerInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section
      ref={containerRef}
      id="scene-method"
      className="scene relative"
      style={{ minHeight: '100vh' }}
    >
      {/* Section header */}
      <div ref={headerRef} data-gsap="header" className="max-w-7xl mx-auto mb-16 lg:mb-24">
        {headerInView && <ChapterLabel number={3} label="Rising Action" />}

        <div className="flex flex-col gap-4">
          <TextReveal
            lines={['The craft', 'in three acts.']}
            splitBy="lines"
            as="h2"
            blur
            delay={0.08}
            stagger={0.2}
            className="t-chapter"
            style={{ color: headerInView ? 'var(--color-foreground)' : 'transparent' }}
          />

          {/* Accent rule — wipes right after heading settles */}
          <motion.div
            variants={wipeRight}
            initial="hidden"
            animate={headerInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.5 }}
            className="h-px mt-2"
            style={{
              background: 'linear-gradient(to right, var(--color-accent), transparent)',
              maxWidth: '24rem',
            }}
          />
        </div>
      </div>

      {/* Card grid */}
      <div data-gsap="grid" className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-px" style={{ background: 'var(--color-iron)' }}>
          {ACTS.map((act, i) => (
            <ActCard key={act.index} act={act} index={i} />
          ))}
        </div>
      </div>

      {/* Full-width statement line — energy peak before climax */}
      <FullWidthStatement />
    </section>
  );
}

/* ── Act Card ── */

function ActCard({
  act,
  index,
}: {
  act: (typeof ACTS)[number];
  index: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25 });

  const slideVariant = {
    hidden:  { x: act.from === 'left' ? -44 : 44, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: DURATION.cinematic, ease: FM.snap, delay: index * 0.08 },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={slideVariant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ x: 6, transition: { duration: 0.45, ease: FM.cinematic } }}
      className="group relative grid grid-cols-1 md:grid-cols-[5rem_1fr] items-start gap-6 md:gap-10"
      style={{
        backgroundColor: '#080808',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        cursor: 'default',
      }}
    >
      {/* Hover background layer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: 'rgba(200,169,110,0.03)' }}
        aria-hidden="true"
      />

      {/* Index */}
      <span
        className="relative t-mono"
        style={{ color: 'var(--color-gold)', paddingTop: '0.2em' }}
      >
        {act.index}
      </span>

      {/* Content */}
      <div className="relative flex flex-col gap-3">
        <h3 className="t-subheading text-foreground group-hover:text-accent transition-colors duration-500">
          {act.title}
        </h3>
        <p className="t-body max-w-lg" style={{ color: 'var(--color-dust)' }}>
          {act.body}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Full-Width Statement ── */

function FullWidthStatement() {
  return (
    <FadeScene
      blur
      delay={0.15}
      y={10}
      threshold={0.4}
      className="max-w-7xl mx-auto mt-16 lg:mt-24 pt-12 border-t"
      style={{ borderColor: 'var(--color-iron)' }}
    >
      <motion.p
        className="t-display-italic"
        style={{
          fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
          color: 'var(--color-ash)',
          maxWidth: '36rem',
        }}
        whileHover={{ x: 6, color: 'var(--color-silver)', transition: { duration: 0.5, ease: FM.cinematic } }}
      >
        &ldquo;Motion without meaning is noise.<br />
        Motion with meaning is cinema.&rdquo;
      </motion.p>
    </FadeScene>
  );
}
