"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease, dur, stagger as staggerTokens } from "@/lib/motion";

/**
 * Sequential reveal of children using staggerChildren.
 * @param {{ children: React.ReactNode, stagger?: number, className?: string }} props
 */
export default function Stagger({
  children,
  stagger = staggerTokens.base,
  className,
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur.base, ease },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={item}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={item}>{children}</motion.div>
      }
    </motion.div>
  );
}
