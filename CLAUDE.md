# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint (Next.js core-web-vitals + TypeScript rules)
```

There are no tests in this project.

## Stack

- **Next.js 16.2.4** (App Router) — `next.config.ts` is minimal; no custom webpack/turbopack config
- **React 19**, **TypeScript 5.9**
- **Tailwind CSS v4** — configured via `postcss.config.mjs`; utility classes are extended by `@theme inline` in `globals.css`
- **Framer Motion 12** — component-level declarative animations
- **GSAP 3 + ScrollTrigger + ScrollToPlugin** — scroll-scrubbed timelines and pinned scenes

## Architecture

### Scene model

The home page (`src/app/page.tsx`) is a linear sequence of five narrative scenes:

```
OpeningShot → EstablishingScene → RisingAction → ClimaxScene → Resolution
```

Below-fold scenes are code-split via `next/dynamic`. Each scene is a `'use client'` component in `src/scenes/`.

Three additional routes exist: `/about` and `/scenes` (both in `src/app/`).

### Animation architecture — two-library split

**Framer Motion** handles component-level variants (entrance/exit on scroll visibility). Variant presets live in `src/animations/variants.ts`. Pair them with `useInView` (`src/hooks/useInView.ts`):

```tsx
const [ref, inView] = useInView({ threshold: 0.15 });
<motion.div ref={ref} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} />
```

**GSAP + ScrollTrigger** handles scrubbed, timeline-driven sequences (pinned hero, parallax, scroll-progress reveals). The `useSceneScroll` hook (`src/hooks/useSceneScroll.ts`) is the single integration point:

```tsx
const containerRef = useSceneScroll(myTimelineFactory, { pin: true, pinDuration: '80%', scrub: 1.2 });
<section ref={containerRef}>...</section>
```

Timeline factory functions live in `src/animations/timelines/` (one file per scene, exported via `index.ts`). They receive the live `container: HTMLElement` and an empty GSAP timeline; tweens added to the timeline are scrubbed by ScrollTrigger.

`initGSAP()` (`src/animations/gsap.ts`) registers plugins and sets defaults. `useSceneScroll` calls it automatically. **Never call `gsap.registerPlugin` elsewhere.**

`src/animations/gsap.ts` also exports standalone helpers: `scrollReveal()` (for elements that can't use Framer Motion), `pinScene()`, `scrollTo()`, and `killAll()`.

### Easing system

All easing curves are defined once in `src/animations/easings.ts` and exported in three formats:
- `FM.*` — for Framer Motion `transition.ease`
- `GSAP.*` — for GSAP `ease` option
- `CSS.*` — for inline styles or Tailwind arbitrary values
- `DURATION.*` — named duration constants in seconds (flash → epic)

Always import from `@/animations/easings`, never hardcode cubic-bezier strings.

### Design tokens → Tailwind

`src/styles/tokens.css` defines all CSS custom properties (colors, typography scale, z-index layers, spacing, durations). `globals.css` bridges them into Tailwind via `@theme inline` so utility classes like `bg-background`, `text-accent`, `z-nav` resolve correctly.

Import order in `globals.css` is load-bearing: `tailwindcss` → `tokens.css` → `typography.css`.

### Typography utility classes

`src/styles/typography.css` defines composable classes applied directly in JSX:
- `t-hero` — cinematic display (Cormorant, ~9rem)
- `t-label` — small tracking-wide uppercase
- `t-mono` — monospace metadata (frame counters, timestamps)
- `t-body` — body copy

### Scene IDs and GSAP targeting

Scene anchor IDs are centralized in `src/lib/constants.ts` as `SCENE_IDS`. Use these for anchor links and ScrollTrigger selectors to keep them in sync.

GSAP targets within a scene use `data-gsap="<name>"` attributes (e.g. `data-gsap="title"`, `data-gsap="cue"`) queried inside timeline factories with `container.querySelector('[data-gsap="title"]')`.

### Global chrome (layout.tsx)

Persistent UI rendered in the root layout — never re-mount on navigation:
- `<ScrollProgress />` — MotionValue-driven progress bar, zero re-renders
- `<Cursor />` — replaces native cursor (OS cursor hidden globally via `cursor: none`)
- `<Nav />` — sits just inside the letterbox bars
- `.film-grain` — CSS-only animated grain overlay (z-index 999)
- `.letterbox-top` / `.letterbox-bottom` — fixed cinematic framing bars (z-index 1000)

Page transitions use `src/app/template.tsx` (re-instantiated on every navigation) which wraps content in `<PageTransition>` — a fixed overlay that fades from black.

### `SceneWrapper` component

For scenes that don't need an internal scroll ref, `SceneWrapper` (`src/components/SceneWrapper.tsx`) provides a `<section>` with a two-layer entrance (opacity dissolve + subtle scale pull-back) driven by `useInView`. Scenes with their own GSAP `containerRef` should **not** use `SceneWrapper`.

### Reduced motion

`reducedMotion` is set once in `initGSAP()` and exported. `useSceneScroll` checks it — pinning and scrubbing are disabled for reduced-motion users while the factory still runs (for `gsap.set` initial visibility). CSS handles the rest via `@media (prefers-reduced-motion: reduce)`.

### Utilities

- `src/lib/cn.ts` — minimal className joiner (no external dep; filters falsy values)
- `src/lib/types.ts` — shared types: `Scene`, `EasingName`, `Direction`, `CursorVariant`, `CursorState`
- `src/lib/constants.ts` — `SCENE_IDS`, `BREAKPOINTS`, `TIMING`, `ASPECT` ratios
