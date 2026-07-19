"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease, dur } from "@/lib/motion";

const offsets = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

/**
 * Viewport-triggered translate + fade.
 * @param {{ children: React.ReactNode, direction?: 'up'|'down'|'left'|'right', delay?: number, duration?: number, className?: string }} props
 */
export default function SlideIn({
  children,
  direction = "up",
  delay = 0,
  duration = dur.base,
  className,
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const { x, y } = offsets[direction] || offsets.up;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
