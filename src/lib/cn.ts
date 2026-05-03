/**
 * Minimal class-name utility.
 * Filters falsy values — no external dependency needed at this scale.
 *
 * Usage:
 *   cn('base-class', isActive && 'active', undefined, 'other')
 *   → 'base-class active other'
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
