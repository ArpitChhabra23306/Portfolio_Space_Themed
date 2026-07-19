"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom glowing dot + ring cursor.
 * Skipped on touch devices and when prefers-reduced-motion: reduce.
 * Preserves native cursor on interactive elements (a, button, input, textarea, select).
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip on touch devices
    const isTouch = window.matchMedia("(hover: none)").matches || window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    // Skip on reduced motion
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    setVisible(true);

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let animationId;

    function handleMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
    }

    // Delayed ring follows with lerp
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
      }

      animationId = requestAnimationFrame(animateRing);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Glowing dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent-ember pointer-events-none z-[9999]
          shadow-[0_0_8px_2px_rgba(232,116,60,0.6)]"
        aria-hidden="true"
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent-ember/40 pointer-events-none z-[9998]"
        aria-hidden="true"
      />
    </>
  );
}
