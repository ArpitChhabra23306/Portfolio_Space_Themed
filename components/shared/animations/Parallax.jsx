"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Scroll-linked Y-translate parallax wrapper.
 * @param {{ children: React.ReactNode, speed?: number, className?: string }} props
 * speed: multiplier for parallax offset. 0 = no movement, 1 = full scroll distance.
 */
export default function Parallax({ children, speed = 0.5, className }) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);

  if (prefersReduced) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
