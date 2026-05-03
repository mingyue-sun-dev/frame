'use client';

import { PageTransition } from '@/components/PageTransition';

/**
 * template.tsx — re-instantiated on every navigation (unlike layout.tsx).
 * Delegates to PageTransition for the "fade from black" cinematic entrance.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
