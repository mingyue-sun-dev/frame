# Frame

A cinematic scroll experience. Every frame matters.

Frame is an exploration of what happens when the web is treated like film — where scroll is a timeline, typography carries emotional weight before a single word is read, and motion is direction, not decoration.

## Overview

Five scenes form a narrative arc across the home page:

```
01 Opening Shot     Full black. One title. A breath.
02 Establishing     The world opens. Context before conflict.
03 Rising Action    Tension builds. The pace accelerates.
04 Climax           The peak. Everything converges.
05 Resolution       Stillness returns. The hold.
```

Each scene manages its own entrance, pin, and exit. The experience is designed to be read at a specific pace — the scroll controls the playhead.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # ESLint
```

## Stack

- **Next.js 16.2.4** with App Router
- **React 19** / **TypeScript 5.9**
- **Tailwind CSS v4** — design tokens in `src/styles/tokens.css`
- **Framer Motion 12** — component-level variant animations
- **GSAP 3 + ScrollTrigger** — scroll-scrubbed timelines and pinned scenes

## Animation Model

Two libraries with a clear division of responsibility:

**Framer Motion** handles component-level entrance and exit variants — elements fading, rising, wiping in response to scroll visibility. Variant presets are in `src/animations/variants.ts`.

**GSAP + ScrollTrigger** handles scrubbed, timeline-driven sequences — pinned hero sections, parallax depth, scroll-progress reveals. The `useSceneScroll` hook is the single integration point. Timeline factory functions live in `src/animations/timelines/`.

All easing curves — named after their cinematic analogues (`cinematic`, `reveal`, `settle`, `snap`, `dissolve`, `exit`) — are defined once in `src/animations/easings.ts` and exported for Framer Motion, GSAP, and CSS.

## Visual Design

- **Palette** — near-black backgrounds (`#080808`), ivory foreground (`#f0ede8`), warm amber accent (`#c8a96e`)
- **Display type** — Cormorant Garamond (light 300), used for all hero and chapter titles
- **Aspect ratio** — 2.39:1 anamorphic framing bars define the cinematic window
- **Film grain** — CSS-only animated grain overlay at z-index 999
- **Cursor** — native cursor hidden globally; replaced by a custom `<Cursor />` component
