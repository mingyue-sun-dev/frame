'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { FM, DURATION } from '@/animations/easings';

/* ── Types ───────────────────────────────────────────── */

type SplitMode  = 'lines' | 'words' | 'chars';
type TriggerMode = 'inView' | 'onMount';

interface TextRevealProps {
  /**
   * Plain string — used in 'words' and 'chars' modes.
   * In 'lines' mode, pass the `lines` prop instead.
   */
  text?: string;
  /**
   * Explicit line array — used in 'lines' mode.
   * Each string becomes one masked line. Newlines are NOT auto-detected
   * from `text` because browser line-wrapping is unknowable at render time.
   */
  lines?: string[];
  /**
   * 'lines'  — mask reveal: text rises behind overflow:hidden (classic cinematic title)
   * 'words'  — stagger fade per word with optional blur-to-sharp
   * 'chars'  — stagger opacity per character (labels, counters, short words)
   */
  splitBy?: SplitMode;
  /** HTML element to render — does not affect the animation, only semantics */
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  /** Seconds before the first token starts animating */
  delay?: number;
  /** Seconds between each token. Defaults: lines=0.14, words=0.07, chars=0.04 */
  stagger?: number;
  /** Per-token transition duration. Defaults: lines=1.1s, words=0.7s, chars=0.5s */
  duration?: number;
  /**
   * Blur-to-sharp: each token starts blurred (like a lens pulling focus)
   * and sharpens as it animates in.
   * Recommended for headings. Use sparingly on dense body text.
   */
  blur?: boolean;
  /**
   * 'inView'   — fires when element scrolls into viewport (default)
   * 'onMount'  — fires immediately on mount; use for above-the-fold hero text
   */
  trigger?: TriggerMode;
  threshold?: number;
}

/**
 * TextReveal — cinematic text entrance component.
 *
 * Three distinct modes, each with a different visual character:
 *
 *   lines — Mask reveal. Text rises from behind an overflow:hidden container.
 *           The canonical cinematic title animation — used for hero headings,
 *           chapter titles, and any text where the "reveal" IS the statement.
 *           Requires `lines` prop.
 *
 *   words — Stagger fade. Each word drifts up and fades in, with optional
 *           blur-to-sharp. Good for pull quotes, paragraph leads, chapter
 *           subtitles. Requires `text` prop.
 *
 *   chars — Character stagger. Fine-grained blur-to-sharp per character.
 *           Use sparingly — for single words, labels, frame counters.
 *           Requires `text` prop.
 *
 * The component wraps its output in a <div style="display:contents"> to
 * attach the IntersectionObserver ref without affecting the DOM layout.
 */
export function TextReveal({
  text,
  lines,
  splitBy = 'words',
  as: Tag = 'div',
  className,
  style,
  delay = 0,
  stagger,
  duration,
  blur = false,
  trigger = 'inView',
  threshold = 0.2,
}: TextRevealProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold, once: true });
  const shouldAnimate = trigger === 'onMount' || isInView;

  /* Per-mode defaults */
  const resolvedStagger  = stagger  ?? (splitBy === 'lines' ? 0.14 : splitBy === 'words' ? 0.07 : 0.04);
  const resolvedDuration = duration ?? (splitBy === 'lines' ? DURATION.cinematic : splitBy === 'words' ? DURATION.slow : 0.5);

  /* ── Lines mode ─────────────────────────────────────── */
  /*
   * Each line rises from behind an overflow:hidden mask.
   * The mask (the outer <span>) hides the line until it exits the bottom.
   * Optional blur clears as the line ascends.
   */
  if (splitBy === 'lines') {
    const lineTokens = lines ?? (text ? text.split('\n') : []);
    return (
      <div ref={ref} style={{ display: 'contents' }}>
        <Tag className={className} style={style}>
          {lineTokens.map((line, i) => (
            <span
              key={i}
              style={{ display: 'block', overflow: 'hidden', lineHeight: 'inherit' }}
            >
              <motion.span
                style={{ display: 'block' }}
                initial={{
                  y: '108%',
                  filter: blur ? 'blur(6px)' : 'blur(0px)',
                }}
                animate={
                  shouldAnimate
                    ? { y: '0%', filter: 'blur(0px)' }
                    : { y: '108%', filter: blur ? 'blur(6px)' : 'blur(0px)' }
                }
                transition={{
                  y:      {
                    duration: resolvedDuration,
                    delay:    delay + i * resolvedStagger,
                    ease:     FM.reveal,
                  },
                  filter: {
                    duration: resolvedDuration * 1.2,
                    delay:    delay + i * resolvedStagger,
                    ease:     FM.cinematic,
                  },
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </Tag>
      </div>
    );
  }

  /* ── Words mode ─────────────────────────────────────── */
  /*
   * Each word is an inline-block token that fades up with optional blur.
   * The parent is display:flex so words reflow naturally.
   * columnGap mirrors a normal word-space (0.28em ≈ the space character width
   * in most proportional fonts).
   */
  if (splitBy === 'words') {
    const words = text?.split(' ').filter(Boolean) ?? [];
    return (
      <div ref={ref} style={{ display: 'contents' }}>
        <Tag
          className={className}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '0.28em',
            rowGap:    '0.08em',
            ...style,
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              style={{ display: 'inline-block' }}
              initial={{
                opacity: 0,
                y:       14,
                filter:  blur ? 'blur(7px)' : 'blur(0px)',
              }}
              animate={
                shouldAnimate
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 14, filter: blur ? 'blur(7px)' : 'blur(0px)' }
              }
              transition={{
                opacity: { duration: resolvedDuration,        delay: delay + i * resolvedStagger, ease: FM.dissolve  },
                y:       { duration: resolvedDuration,        delay: delay + i * resolvedStagger, ease: FM.reveal    },
                filter:  { duration: resolvedDuration * 1.15, delay: delay + i * resolvedStagger, ease: FM.cinematic },
              }}
            >
              {word}
            </motion.span>
          ))}
        </Tag>
      </div>
    );
  }

  /* ── Chars mode ─────────────────────────────────────── */
  /*
   * Per-character fade with blur-to-sharp. No y movement — the effect is
   * purely optical (sharpening), like a lens pulling into focus.
   * White-space:pre preserves spaces between characters.
   */
  const chars = text?.split('') ?? [];
  return (
    <div ref={ref} style={{ display: 'contents' }}>
      <Tag
        className={className}
        style={{ display: 'inline-flex', flexWrap: 'wrap', ...style }}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
            initial={{
              opacity: 0,
              filter:  blur ? 'blur(6px)' : 'blur(0px)',
            }}
            animate={
              shouldAnimate
                ? { opacity: 1, filter: 'blur(0px)' }
                : { opacity: 0, filter: blur ? 'blur(6px)' : 'blur(0px)' }
            }
            transition={{
              opacity: { duration: resolvedDuration,        delay: delay + i * resolvedStagger, ease: FM.dissolve  },
              filter:  { duration: resolvedDuration * 1.15, delay: delay + i * resolvedStagger, ease: FM.cinematic },
            }}
          >
            {char}
          </motion.span>
        ))}
      </Tag>
    </div>
  );
}
