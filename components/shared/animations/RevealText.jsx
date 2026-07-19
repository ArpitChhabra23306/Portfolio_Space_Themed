"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease, dur, stagger as staggerTokens } from "@/lib/motion";

/**
 * Word/char clip-mask text reveal.
 * Splits text by word (default) or character, each wrapped in overflow-hidden span
 * with a y-translate animation.
 *
 * @param {{ children: string, by?: 'word'|'char', className?: string }} props
 */
export default function RevealText({ children, by = "word", className }) {
  const prefersReduced = useReducedMotion();

  if (typeof children !== "string") {
    return <span className={className}>{children}</span>;
  }

  const units = by === "char" ? children.split("") : children.split(" ");

  if (prefersReduced) {
    return <span className={className}>{children}</span>;
  }

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: by === "char" ? staggerTokens.fast : staggerTokens.base,
      },
    },
  };

  const child = {
    hidden: { y: "120%" },
    visible: {
      y: "0%",
      transition: { duration: dur.base, ease },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      aria-label={children}
    >
      {units.map((unit, i) => (
        <span
          key={i}
          className="overflow-hidden inline-block"
          style={{ verticalAlign: "top" }}
        >
          <motion.span className="inline-block" variants={child}>
            {unit}
            {by === "word" && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
