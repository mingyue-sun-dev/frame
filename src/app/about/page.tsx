'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { fadeUp, fadeIn, stagger, wipeRight } from '@/animations/variants';
import { FM } from '@/animations/easings';

export default function AboutPage() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [bodyRef,   bodyInView]   = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [quoteRef,  quoteInView]  = useInView<HTMLDivElement>({ threshold: 0.5 });
  const [closeRef,  closeInView]  = useInView<HTMLDivElement>({ threshold: 0.4 });

  return (
    <main
      className="scene"
      style={{
        minHeight: '100dvh',
        paddingTop: 'calc(clamp(20px,3.2vh,40px) + 5rem)',
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Page header ── */}
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
            About Frame
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
            A study in<br />
            <span style={{ color: 'var(--color-ash)' }}>restraint.</span>
          </motion.h1>

          <motion.div
            variants={wipeRight}
            className="mt-8 h-px"
            style={{
              background: 'linear-gradient(to right, var(--color-gold), transparent)',
              maxWidth: '14rem',
            }}
          />
        </motion.div>

        {/* ── Two-column body ── */}
        <div
          ref={bodyRef}
          className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 mb-24 lg:mb-40"
        >
          {/* Left — descriptor */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={bodyInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-6"
          >
            <motion.p
              variants={fadeUp}
              className="t-label"
              style={{ color: 'var(--color-gold-dim)' }}
            >
              Philosophy
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="t-body leading-relaxed"
              style={{ color: 'var(--color-ash)' }}
            >
              Frame is not a portfolio, a product, or a platform. It is a
              question: what happens when the web is treated like film?
            </motion.p>
          </motion.div>

          {/* Right — editorial paragraphs */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={bodyInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-8"
          >
            <motion.p
              variants={fadeUp}
              className="t-body leading-relaxed"
              style={{ color: 'var(--color-silver)', fontSize: 'var(--text-base)' }}
            >
              Every director knows that the most powerful tool is not the camera —
              it is the cut. The moment of transition. What you show, what you
              withhold, and precisely when you make the exchange.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="t-body leading-relaxed"
              style={{ color: 'var(--color-dust)' }}
            >
              Frame applies this principle to interface design. Scroll is a
              timeline. Typography carries emotional weight before a single word
              is read. Motion is not decoration — it is direction.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="t-body leading-relaxed"
              style={{ color: 'var(--color-ash)' }}
            >
              The result is an experience that does not simply display information.
              It controls pace. It builds tension. It delivers the moment — and
              then knows when to be still.
            </motion.p>
          </motion.div>
        </div>

        {/* ── Pull quote ── */}
        <motion.div
          ref={quoteRef}
          variants={stagger}
          initial="hidden"
          animate={quoteInView ? 'visible' : 'hidden'}
          className="border-t border-b py-14 lg:py-20 mb-24 lg:mb-40"
          style={{ borderColor: 'var(--color-iron)' }}
        >
          <motion.blockquote
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--color-silver)',
              maxWidth: '40rem',
            }}
          >
            &ldquo;The eye goes where it is led. Lead it with intention.&rdquo;
          </motion.blockquote>

          <motion.div
            variants={fadeIn}
            className="mt-6 flex items-center gap-4"
          >
            <div className="h-px w-8" style={{ background: 'var(--color-iron)' }} />
            <span className="t-mono" style={{ color: 'var(--color-iron)' }}>
              Frame — Design Principle 01
            </span>
          </motion.div>
        </motion.div>

        {/* ── Closing row ── */}
        <motion.div
          ref={closeRef}
          variants={stagger}
          initial="hidden"
          animate={closeInView ? 'visible' : 'hidden'}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
        >
          <motion.p
            variants={fadeUp}
            className="t-body"
            style={{ color: 'var(--color-ash)' }}
          >
            Built with Next.js, Framer Motion, GSAP, and Tailwind.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-8">
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
                Experience Frame
              </span>
            </Link>

            <Link
              href="/scenes"
              className="t-label transition-colors duration-300"
              style={{ color: 'var(--color-dust)' }}
            >
              <span className="hover:text-accent transition-colors duration-300">
                Scene Index
              </span>
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </main>
  );
}
