import dynamic from 'next/dynamic';
import { OpeningShot } from '@/scenes/OpeningShot';

/* Below-fold scenes are code-split — they don't block the initial bundle.
   All scenes are 'use client'; GSAP only runs client-side inside useEffect. */
const EstablishingScene = dynamic(
  () => import('@/scenes/EstablishingScene').then((m) => m.EstablishingScene),
);
const RisingAction = dynamic(
  () => import('@/scenes/RisingAction').then((m) => m.RisingAction),
);
const ClimaxScene = dynamic(
  () => import('@/scenes/ClimaxScene').then((m) => m.ClimaxScene),
);
const Resolution = dynamic(
  () => import('@/scenes/Resolution').then((m) => m.Resolution),
);

/**
 * Home — the cinematic scroll experience.
 * Five scenes form the narrative arc; each scene manages its own animation.
 */
export default function Home() {
  return (
    <main id="main-content">
      <OpeningShot />
      <EstablishingScene />
      <RisingAction />
      <ClimaxScene />
      <Resolution />
    </main>
  );
}
