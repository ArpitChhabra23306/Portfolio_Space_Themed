"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Mouse-tracked 3D rotation with conic-gradient highlight.
 * @param {{ children: React.ReactNode, max?: number, className?: string }} props
 * max: maximum rotation in degrees (default ±12°)
 */
export default function Tilt3D({ children, max = 12, className }) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);
  const [highlight, setHighlight] = useState("transparent");

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0-1
    const y = (e.clientY - rect.top) / rect.height; // 0-1

    // Map 0-1 to -max...+max, clamped
    const rx = Math.max(-max, Math.min(max, (y - 0.5) * -2 * max));
    const ry = Math.max(-max, Math.min(max, (x - 0.5) * 2 * max));

    rotateX.set(rx);
    rotateY.set(ry);

    // Conic gradient highlight follows pointer
    const angle = Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI) + 180;
    setHighlight(
      `conic-gradient(from ${angle}deg at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.12) 0deg, transparent 60deg)`
    );
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    setHighlight("transparent");
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
        perspective: 800,
        background: highlight,
      }}
    >
      {children}
    </motion.div>
  );
}
