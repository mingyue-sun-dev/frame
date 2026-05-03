'use client';

/**
 * CinematicText — typography as emotional direction.
 *
 * Typography behaves like film subtitles and cues: text arrives with
 * physical weight, breathes with the story, and at peak intensity
 * distorts like a film gate under pressure before resolving to clarity.
 *
 * Variants:
 *   hero      — char-by-char, letterSpacing tension → release, SVG distortion flash
 *   subtitle  — word-by-word film dialogue reveal, letterSpacing exhale
 *   narrative — line-mask rise, blur-to-sharp, measured stagger
 *
 * Rules:
 *   — Typography must remain readable. Distortion is a moment, not a state.
 *   — Motion reinforces emotion. Every param scales with `intensity` (0–1).
 *   — Use sparingly. Impact moments only.
 */

import { useEffect, useRef, useId, type CSSProperties, type RefObject } from 'react';
import { initGSAP, gsap, ScrollTrigger } from '@/animations/gsap';

type Variant = 'hero' | 'subtitle' | 'narrative';
type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'blockquote';

export interface CinematicTextProps {
  text: string;
  variant?: Variant;
  /** 0–1 — scales blur, y-travel, letterSpacing width, distortion strength. */
  intensity?: number;
  /** What fires the animation. */
  trigger?: 'onMount' | 'inView' | 'scroll';
  /** Seconds before animation begins (onMount / inView). */
  delay?: number;
  as?: TagName;
  className?: string;
  style?: CSSProperties;
  scrollConfig?: {
    /**
     * Custom ScrollTrigger trigger element. Pass a ref to a pinned section
     * so the scrub correctly maps to that section's scroll range.
     */
    triggerRef?: RefObject<HTMLElement | null>;
    start?: string;
    end?: string;
    scrub?: number | boolean;
  };
}

export function CinematicText({
  text,
  variant     = 'narrative',
  intensity   = 1,
  trigger     = 'inView',
  delay       = 0,
  as: TagName = 'p',
  className,
  style,
  scrollConfig,
}: CinematicTextProps) {
  /* Unique ID per instance — no collision between concurrent CinematicTexts */
  const uid        = useId().replace(/:/g, '');
  const filterId   = `ct-${uid}`;
  const containerRef = useRef<HTMLElement>(null);

  /* Distortion is only meaningful at the climax of a hero reveal */
  const withDistortion = variant === 'hero' && intensity >= 0.7;

  useEffect(() => {
    initGSAP();
    const el = containerRef.current;
    if (!el) return;

    const units = Array.from(el.querySelectorAll<HTMLElement>('[data-ct-unit]'));
    if (!units.length) return;

    /* Reduced motion: make text immediately visible, skip all animation */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(units, { opacity: 1, y: 0, filter: 'none' });
      if (variant === 'hero') gsap.set(el, { letterSpacing: '-0.03em' });
      return () => { gsap.set(el, { clearProps: 'letterSpacing,filter' }); };
    }

    /* Scale all effect dimensions by intensity (0–1) */
    const blurPx  = intensity * 12;
    const yPx     = Math.round(intensity * 18);
    const stagger = variant === 'hero'
      ? 0.065 + intensity * 0.035   /* slower stagger at higher intensity */
      : variant === 'subtitle'
      ? 0.048
      : 0.13;

    const tl = gsap.timeline({ paused: true });

    /* ── Hero ─────────────────────────────────────────────────────────── */
    if (variant === 'hero') {
      /* Tension state: wide letter-spacing, set before animation starts */
      gsap.set(el, { letterSpacing: `${(intensity * 0.28).toFixed(2)}em` });

      /* Char-by-char: blur → sharp, below → position, invisible → opaque */
      tl.fromTo(units,
        { opacity: 0, y: yPx, filter: `blur(${blurPx.toFixed(1)}px)` },
        { opacity: 1, y: 0, filter: 'blur(0px)', stagger, duration: 1.3, ease: 'power3.out' },
        delay,
      );

      /* LetterSpacing collapse — tension releases as text settles.
         Begins mid-reveal so the "breath" arrives with the last characters. */
      tl.to(el, {
        letterSpacing: '-0.03em',
        duration: 1.8,
        ease: 'power4.out',
      }, delay + units.length * stagger * 0.5);

      /* ── Distortion flash — film gate under peak pressure ── */
      if (withDistortion) {
        const peakAt = delay + units.length * stagger * 0.55;
        const turbEl = document.getElementById(`${filterId}-turb`);
        const dispEl = document.getElementById(`${filterId}-disp`);
        if (turbEl && dispEl) {
          tl
            /* Gate slips — turbulence spikes */
            .to(turbEl, {
              attr: { baseFrequency: `${(0.018 * intensity).toFixed(4)} ${(0.06 * intensity).toFixed(4)}` },
              duration: 0.13, ease: 'none',
            }, peakAt)
            .to(dispEl, {
              attr: { scale: Math.round(16 * intensity) },
              duration: 0.13, ease: 'none',
            }, peakAt)
            /* Gate recovers — resolves to sharp */
            .to(turbEl, {
              attr: { baseFrequency: '0 0' },
              duration: 0.55, ease: 'power3.out',
            }, peakAt + 0.13)
            .to(dispEl, {
              attr: { scale: 0 },
              duration: 0.55, ease: 'power3.out',
            }, peakAt + 0.13);
        }
      }
    }

    /* ── Subtitle ─────────────────────────────────────────────────────── */
    else if (variant === 'subtitle') {
      tl.fromTo(units,
        { opacity: 0, y: Math.round(yPx * 0.55), filter: `blur(${(blurPx * 0.55).toFixed(1)}px)` },
        { opacity: 1, y: 0, filter: 'blur(0px)', stagger, duration: 0.65, ease: 'power2.out' },
        delay,
      );

      /* Letter-spacing exhale — brief expansion then settles.
         Like a held breath releasing after the last word appears. */
      if (intensity >= 0.5) {
        const breathAt = delay + units.length * stagger + 0.65;
        tl
          .to(el, {
            letterSpacing: `${(0.05 * intensity).toFixed(3)}em`,
            duration: 0.22, ease: 'power1.out',
          }, breathAt)
          .to(el, {
            letterSpacing: '0.01em',
            duration: 0.55, ease: 'power2.inOut',
          }, breathAt + 0.22);
      }
    }

    /* ── Narrative ────────────────────────────────────────────────────── */
    else {
      /* Lines rise through overflow:hidden masks — feels like film subtitles */
      tl.fromTo(units,
        { y: '108%', opacity: 0, filter: `blur(${(blurPx * 0.6).toFixed(1)}px)` },
        { y: '0%', opacity: 1, filter: 'blur(0px)', stagger, duration: 0.85, ease: 'power3.out' },
        delay,
      );
    }

    /* ── Trigger wiring ───────────────────────────────────────────────── */
    let st: ScrollTrigger | undefined;
    const triggerEl = scrollConfig?.triggerRef?.current ?? el;

    if (trigger === 'onMount') {
      tl.play(0);
    } else if (trigger === 'inView') {
      st = ScrollTrigger.create({
        trigger: el,
        start: scrollConfig?.start ?? 'top 88%',
        once: true,
        onEnter: () => tl.play(0),
      });
    } else {
      /* scroll — timeline playhead scrubs with scroll position */
      st = ScrollTrigger.create({
        trigger: triggerEl,
        start: scrollConfig?.start ?? 'top 80%',
        end: scrollConfig?.end ?? 'bottom 20%',
        scrub: scrollConfig?.scrub ?? 1.5,
        animation: tl,
      });
    }

    return () => {
      tl.kill();
      st?.kill();
      /* Clean up GSAP inline styles so React can take over again */
      gsap.set(el, { clearProps: 'letterSpacing,filter' });
    };
    // scrollConfig intentionally excluded: it contains a RefObject whose
    // identity changes every render, but the ref's .current is read in
    // the effect body after mount — when it is always populated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, intensity, trigger, delay, filterId, withDistortion]);

  /* ── Render ─────────────────────────────────────────────────────────── */

  const Tag = TagName as React.ElementType;

  /* ── Hero ── */
  if (variant === 'hero') {
    return (
      <>
        {/*
          Hidden SVG filter — provides the turbulence displacement for the
          distortion flash. width:0 height:0 ensures no layout impact.
          Rendered only when intensity is high enough to warrant distortion.
        */}
        {withDistortion && (
          <svg
            aria-hidden="true"
            focusable="false"
            style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
          >
            <defs>
              <filter id={filterId} x="-12%" y="-12%" width="124%" height="124%">
                <feTurbulence
                  id={`${filterId}-turb`}
                  type="turbulence"
                  baseFrequency="0 0"
                  numOctaves="2"
                  seed="7"
                  result="noise"
                />
                <feDisplacementMap
                  id={`${filterId}-disp`}
                  in="SourceGraphic"
                  in2="noise"
                  scale="0"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
          </svg>
        )}

        {/*
          display:block so letterSpacing applies after each inline-block char.
          Initial letterSpacing is wide (tension) — GSAP collapses it on reveal.
        */}
        <Tag
          ref={containerRef as React.Ref<any>}
          className={className}
          style={{
            display: 'block',
            letterSpacing: `${(intensity * 0.28).toFixed(2)}em`,
            ...(withDistortion && { filter: `url(#${filterId})` }),
            ...style,
          }}
        >
          {text.split('').map((char, i) => (
            <span
              key={i}
              data-ct-unit
              style={{ display: 'inline-block', opacity: 0, whiteSpace: 'pre' }}
            >
              {char}
            </span>
          ))}
        </Tag>
      </>
    );
  }

  /* ── Subtitle ── */
  if (variant === 'subtitle') {
    return (
      <Tag
        ref={containerRef as React.Ref<any>}
        className={className}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: '0.28em',
          ...style,
        }}
      >
        {text.split(' ').map((word, i) => (
          <span
            key={i}
            data-ct-unit
            style={{ display: 'inline-block', opacity: 0 }}
          >
            {word}
          </span>
        ))}
      </Tag>
    );
  }

  /* ── Narrative ── */
  return (
    <Tag
      ref={containerRef as React.Ref<any>}
      className={className}
      style={{ display: 'flex', flexDirection: 'column', ...style }}
    >
      {/*
        Each line sits inside overflow:hidden — GSAP slides the inner span
        up through the mask, creating a "text rising from below" reveal.
        The mask div clips the motion without affecting surrounding layout.
      */}
      {text.split('\n').map((line, i) => (
        <div key={i} style={{ overflow: 'hidden', display: 'block' }}>
          <span
            data-ct-unit
            style={{ display: 'block', opacity: 0, transform: 'translateY(108%)' }}
          >
            {line}
          </span>
        </div>
      ))}
    </Tag>
  );
}
