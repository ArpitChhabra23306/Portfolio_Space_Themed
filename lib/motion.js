/**
 * Shared motion configuration — easings, durations, stagger values, and helpers.
 * Used by all animation primitives in components/shared/animations/.
 */

/** Cinematic out-cubic easing */
export const ease = [0.22, 1, 0.36, 1];

/** Duration presets (seconds) */
export const dur = { quick: 0.3, base: 0.6, slow: 1.2 };

/** Stagger presets (seconds between children) */
export const stagger = { fast: 0.05, base: 0.08, slow: 0.12 };

/**
 * Returns true when the user prefers reduced motion.
 * Safe to call server-side (returns false).
 */
export function isReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
