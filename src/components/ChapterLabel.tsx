'use client';

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { wipeRight, fadeUp } from '@/animations/variants';
import { FM } from '@/animations/easings';

interface ChapterLabelProps {
  number: number;
  label: string;
  /** Light variant — for use on very dark or accent backgrounds */
  dim?: boolean;
}

/**
 * Chapter identifier row: wipe rule + "01 — Label".
 * Self-contained IntersectionObserver so it can be dropped into any scene.
 */
export function ChapterLabel({ number, label, dim = false }: ChapterLabelProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.6 });

  const textColor = dim ? 'text-foreground/25' : 'text-accent/70';

  return (
    <div ref={ref} className="flex items-center gap-4 mb-10">
      {/* Wipe rule */}
      <motion.div
        variants={wipeRight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="h-px w-10 bg-accent/60 flex-shrink-0"
      />

      {/* Label */}
      <motion.span
        variants={fadeUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ delay: 0.15, ease: FM.snap }}
        className={`t-mono ${textColor}`}
        style={{ textTransform: 'uppercase' }}
      >
        {String(number).padStart(2, '0')} &mdash; {label}
      </motion.span>
    </div>
  );
}
