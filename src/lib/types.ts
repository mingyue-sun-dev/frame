/**
 * Shared TypeScript types for Frame.
 */

import type { SceneId } from './constants';

/* ── Scene ───────────────────────────────────────────── */
export interface Scene {
  id: SceneId;
  chapter: number;
  title: string;
  subtitle?: string;
}

/* ── Motion ──────────────────────────────────────────── */
export type EasingName =
  | 'cinematic'
  | 'reveal'
  | 'settle'
  | 'snap'
  | 'dissolve'
  | 'exit';

/** Direction a wipe or slide enters from */
export type Direction = 'left' | 'right' | 'up' | 'down';

/* ── Cursor ──────────────────────────────────────────── */
export type CursorVariant = 'default' | 'hover' | 'drag' | 'text' | 'hidden';

export interface CursorState {
  x: number;
  y: number;
  variant: CursorVariant;
}
