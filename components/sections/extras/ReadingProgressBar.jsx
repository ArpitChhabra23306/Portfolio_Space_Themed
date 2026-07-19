"use client";

import { motion, useScroll } from "framer-motion";

export default function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 w-full h-px z-50 origin-left
                 bg-gradient-to-r from-accent-ember/40 via-accent-violet/40 to-transparent
                 shadow-[0_0_8px_rgba(124,92,255,0.25)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
