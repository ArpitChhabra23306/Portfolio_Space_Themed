"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Animated scroll indicator at the bottom of the Hero section.
 * Bouncing chevron icon prompting the user to scroll down.
 * Disabled when prefers-reduced-motion is active.
 */
export default function ScrollCue() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      aria-hidden="true"
    >
      <ChevronDown
        className={`w-6 h-6 text-text-muted ${
          prefersReduced ? "" : "animate-bounce"
        } motion-reduce:animate-none`}
      />
    </div>
  );
}
