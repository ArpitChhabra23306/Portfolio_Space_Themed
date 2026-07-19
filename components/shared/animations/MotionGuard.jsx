"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Reduced-motion gating wrapper.
 * When the user prefers reduced motion, renders children at their final state
 * without any transitions or animations.
 *
 * Wrap any animated section with MotionGuard to ensure accessibility.
 * When reduced motion is active, children are rendered directly (no motion wrappers).
 *
 * @param {{ children: React.ReactNode, fallback?: React.ReactNode }} props
 * fallback: optional static content to render instead when reduced motion is active.
 */
export default function MotionGuard({ children, fallback }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced && fallback) {
    return <>{fallback}</>;
  }

  // When reduced motion is preferred, children still render — but individual
  // animation components (FadeIn, SlideIn, etc.) each check useReducedMotion
  // internally and skip their transitions. MotionGuard serves as a semantic
  // wrapper and can provide an alternate fallback if needed.
  return <>{children}</>;
}
