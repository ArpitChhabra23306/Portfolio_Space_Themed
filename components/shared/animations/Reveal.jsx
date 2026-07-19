"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease, dur } from "@/lib/motion";

/**
 * Generic viewport-entry reveal wrapper.
 * @param {{ children: React.ReactNode, className?: string }} props
 */
export default function Reveal({ children, className }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: dur.base, ease }}
    >
      {children}
    </motion.div>
  );
}
