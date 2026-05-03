'use client';

import { motion, useSpring } from 'framer-motion';
import { useCursor } from '@/hooks/useCursor';

/* Dot snaps to cursor exactly — no lag.
   Crosshair trails with a tight spring for smoothness without sluggishness. */
const SPRING_CROSS = { stiffness: 900, damping: 42, mass: 0.25 };

const GAP = 5;
const ARM = 8;

const arm = (style: React.CSSProperties): React.CSSProperties => ({
  position: 'absolute',
  backgroundColor: 'rgba(200,169,110,0.55)',
  ...style,
});

export function Cursor() {
  const { x, y } = useCursor();

  const cx = useSpring(x, SPRING_CROSS);
  const cy = useSpring(y, SPRING_CROSS);

  return (
    <>
      {/* Dot — tracks raw position, always exactly at cursor */}
      <motion.div
        aria-hidden="true"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          position: 'fixed',
          top: 0,
          left: 0,
          width: 3,
          height: 3,
          borderRadius: '50%',
          backgroundColor: 'var(--color-ivory)',
          zIndex: 'var(--z-cursor)',
          pointerEvents: 'none',
        }}
      />

      {/* Crosshair — trails slightly, viewfinder aesthetic */}
      <motion.div
        aria-hidden="true"
        style={{
          x: cx,
          y: cy,
          translateX: '-50%',
          translateY: '-50%',
          position: 'fixed',
          top: 0,
          left: 0,
          width: (GAP + ARM) * 2,
          height: (GAP + ARM) * 2,
          zIndex: 'var(--z-cursor)',
          pointerEvents: 'none',
        }}
      >
        <div style={arm({ right: `calc(50% + ${GAP}px)`, top: '50%', width: ARM, height: 1, transform: 'translateY(-50%)' })} />
        <div style={arm({ left:  `calc(50% + ${GAP}px)`, top: '50%', width: ARM, height: 1, transform: 'translateY(-50%)' })} />
        <div style={arm({ bottom: `calc(50% + ${GAP}px)`, left: '50%', width: 1, height: ARM, transform: 'translateX(-50%)' })} />
        <div style={arm({ top:    `calc(50% + ${GAP}px)`, left: '50%', width: 1, height: ARM, transform: 'translateX(-50%)' })} />
      </motion.div>
    </>
  );
}
