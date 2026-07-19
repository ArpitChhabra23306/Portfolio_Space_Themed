"use client";

import { useEffect, useState, useRef } from "react";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA",
];

/**
 * Full-screen subtle particle overlay activated by the Konami code.
 * Disabled when prefers-reduced-motion: reduce.
 */
export default function KonamiOverlay() {
  const [active, setActive] = useState(false);
  const sequenceRef = useRef([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Disable on reduced motion
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    function handleKeyDown(e) {
      sequenceRef.current.push(e.code);

      // Keep only the last N keys (length of Konami code)
      if (sequenceRef.current.length > KONAMI_CODE.length) {
        sequenceRef.current.shift();
      }

      // Check if sequence matches
      if (
        sequenceRef.current.length === KONAMI_CODE.length &&
        sequenceRef.current.every((key, i) => key === KONAMI_CODE[i])
      ) {
        setActive((prev) => !prev);
        sequenceRef.current = [];
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Particle animation
  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 116, 60, ${p.alpha})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    window.addEventListener("resize", handleResize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9990]"
      aria-hidden="true"
    />
  );
}
