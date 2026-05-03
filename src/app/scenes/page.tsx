'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { fadeUp, stagger, wipeRight } from '@/animations/variants';
import { FM, DURATION } from '@/animations/easings';

const CHAPTERS = [
  {
    number:      1,
    title:       'Opening Shot',
    anchor:      '/#scene-hero',
    description: 'The screen holds black. Then a name. The story announces itself without urgency.',
    duration:    'Full viewport',
  },
  {
    number:      2,
    title:       'Establishing Scene',
    anchor:      '/#scene-manifesto',
    description: 'The world takes shape. Context before conflict. An editorial two-column that lets the eye settle.',
    duration:    '100vh',
  },
  {
    number:      3,
    title:       'Rising Action',
    anchor:      '/#scene-method',
    description: 'Energy builds. The layout becomes dynamic. Three acts of craft arrive with alternating momentum.',
    duration:    '100vh +',
  },
  {
    number:      4,
    title:       'Climax',
    anchor:      '/#scene-climax',
    description: 'A quote reveals itself word by word as you scroll. A gold line extends. The atmosphere peaks.',
    duration:    '160vh',
  },
  {
    number:      5,
    title:       'Resolution',
    anchor:      '/#scene-resolution',
    description: 'Motion decelerates to stillness. Three words arrive slowly, then fade into the end card.',
    duration:    '100vh',
  },
] as const;

export default function ScenesPage() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <main
      className="scene"
      style={{
        minHeight: '100dvh',
        paddingTop: 'calc(clamp(20px,3.2vh,40px) + 5rem)',
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <motion.div
          ref={headerRef}
          variants={stagger}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="mb-20 lg:mb-32"
        >
          <motion.p
            variants={fadeUp}
            className="t-mono mb-6"
            style={{ color: 'var(--color-accent)' }}
          >
            Scene Index
          </motion.p>

          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontWeight: 300,
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: 'var(--color-ivory)',
            }}
          >
            Five chapters.<br />
            <span style={{ color: 'var(--color-ash)' }}>One arc.</span>
          </motion.h1>

          <motion.div
            variants={wipeRight}
            className="mt-8 h-px"
            style={{
              background: 'linear-gradient(to right, var(--color-gold), transparent)',
              maxWidth: '20rem',
            }}
          />
        </motion.div>

        {/* Chapter list */}
        <div className="flex flex-col gap-px" style={{ background: 'var(--color-iron)' }}>
          {CHAPTERS.map((chapter, i) => (
            <ChapterRow key={chapter.number} chapter={chapter} index={i} />
          ))}
        </div>

        {/* Footer nudge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="mt-16 flex items-center gap-4"
        >
          <Link
            href="/"
            className="group flex items-center gap-3 t-label transition-colors duration-300"
            style={{ color: 'var(--color-dust)' }}
          >
            <motion.span
              style={{
                height: '1px',
                width: '2rem',
                background: 'currentColor',
                display: 'inline-block',
              }}
              whileHover={{ width: '3.5rem' }}
              transition={{ duration: 0.4, ease: FM.snap }}
            />
            <span className="group-hover:text-accent transition-colors duration-300">
              Watch from the beginning
            </span>
          </Link>
        </motion.div>

      </div>
    </main>
  );
}

/* ── Chapter Row ── */

function ChapterRow({
  chapter,
  index,
}: {
  chapter: (typeof CHAPTERS)[number];
  index: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      whileHover={{ x: 6, transition: { duration: 0.45, ease: FM.cinematic } }}
      transition={{
        duration: DURATION.slow,
        delay: index * 0.07,
        ease: FM.snap,
      }}
    >
      <Link
        href={chapter.anchor}
        className="group relative flex items-start gap-6 md:gap-10 py-8 md:py-10 px-0"
        style={{ background: 'var(--color-black)' }}
      >
        {/* Hover background flash */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: 'rgba(200,169,110,0.03)' }}
          aria-hidden="true"
        />
        {/* Number */}
        <span
          className="t-mono flex-shrink-0 pt-1"
          style={{
            color: 'var(--color-gold)',
            width: '2.5rem',
          }}
        >
          {String(chapter.number).padStart(2, '0')}
        </span>

        {/* Content */}
        <div className="flex flex-col gap-2 flex-1">
          <h2
            className="group-hover:text-accent transition-colors duration-500"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontWeight: 300,
              fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--color-ivory)',
            }}
          >
            {chapter.title}
          </h2>
          <p
            className="t-body"
            style={{ color: 'var(--color-ash)', maxWidth: '40rem' }}
          >
            {chapter.description}
          </p>
        </div>

        {/* Duration + arrow */}
        <div
          className="hidden md:flex flex-col items-end gap-2 flex-shrink-0 self-center"
        >
          <span className="t-mono" style={{ color: 'var(--color-iron)' }}>
            {chapter.duration}
          </span>
          <motion.span
            className="t-mono"
            style={{ color: 'var(--color-gold-dim)' }}
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: FM.cinematic }}
          >
            →
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
}
