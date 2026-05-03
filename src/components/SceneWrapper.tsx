'use client';

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { FM, DURATION } from '@/animations/easings';
import { cn } from '@/lib/cn';

interface SceneWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Base delay before the entrance begins (seconds) */
  delay?: number;
  /** Fraction of element visible before triggering (0–1) */
  threshold?: number;
}

/**
 * SceneWrapper — cinematic entrance container for a full scene.
 *
 * Renders as a <section>. Applies two layered entrance effects as the
 * section scrolls into view:
 *
 *   Opacity   0 → 1    over 1.1s (dissolve)
 *   Scale     1.02 → 1 over 1.8s (cinematic — like a slow rack pull-back)
 *
 * The scale is imperceptible in isolation but creates a subtle "settling
 * into frame" sensation when combined with inner text/content animations.
 *
 * Use this as the outermost element for scenes that do NOT need a separate
 * ref for Framer Motion useScroll (i.e. no internal parallax layers).
 * For scenes with scroll-driven parallax, keep their own <section> ref
 * and use FadeScene / TextReveal inside instead.
 */
export function SceneWrapper({
  children,
  id,
  className,
  style,
  delay = 0,
  threshold = 0.08,
}: SceneWrapperProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold, once: true });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={cn('overflow-hidden', className)}
      style={style}
      initial={{ opacity: 0, scale: 1.02 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        opacity: { duration: DURATION.cinematic, delay, ease: FM.dissolve },
        scale:   { duration: DURATION.epic,      delay, ease: FM.cinematic },
      }}
    >
      {children}
    </motion.section>
  );
}
