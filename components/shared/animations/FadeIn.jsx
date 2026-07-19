"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease, dur } from "@/lib/motion";

/**
 * Viewport-triggered opacity fade.
 * @param {{ children: React.ReactNode, delay?: number, duration?: number, className?: string }} props
 */
export default function FadeIn({ children, delay = 0, duration = dur.base, className }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
