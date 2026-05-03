'use client';

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { FM, DURATION } from '@/animations/easings';

interface FadeSceneProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Base delay before the entrance begins (seconds) */
  delay?: number;
  /** Total entrance duration (seconds) */
  duration?: number;
  /**
   * Blur-to-sharp: content starts at blur(8px) and sharpens as it fades in.
   * Mimics a rack-focus pull — use on editorial text blocks and card grids.
   */
  blur?: boolean;
  /** Initial y offset in px — element drifts upward as it fades in */
  y?: number;
  threshold?: number;
}

/**
 * FadeScene — content block entrance animation.
 *
 * Fades a content block into view (opacity 0→1) with an optional upward
 * drift (y) and blur-to-sharp transition.
 *
 * Use inside scenes for:
 *   - Editorial text columns
 *   - Card grids
 *   - Pull quotes and stat rows
 *   - Any content that shouldn't be a full scene entrance
 *
 * Pairs well with TextReveal on the heading and FadeScene on the body:
 *
 *   <TextReveal lines={[...]} blur />        ← heading: masked line reveal
 *   <FadeScene blur delay={0.3}>             ← body: subtle fade + sharpen
 *     <p>Body copy</p>
 *   </FadeScene>
 */
export function FadeScene({
  children,
  className,
  style,
  delay = 0,
  duration = DURATION.cinematic,
  blur = false,
  y = 20,
  threshold = 0.12,
}: FadeSceneProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold, once: true });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{
        opacity: 0,
        y,
        filter: blur ? 'blur(8px)' : 'blur(0px)',
      }}
      animate={
        (inView || reduced)
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y,    filter: blur ? 'blur(8px)' : 'blur(0px)' }
      }
      transition={{
        opacity: { duration: reduced ? 0 : duration,        delay: reduced ? 0 : delay, ease: FM.dissolve  },
        y:       { duration: reduced ? 0 : duration,        delay: reduced ? 0 : delay, ease: FM.reveal    },
        filter:  { duration: reduced ? 0 : duration * 1.25, delay: reduced ? 0 : delay, ease: FM.cinematic },
      }}
    >
      {children}
    </motion.div>
  );
}
