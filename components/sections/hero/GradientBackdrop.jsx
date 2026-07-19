"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Cinematic animated mesh-gradient background for the Hero section.
 * Multiple CSS-animated blobs with different speeds, sizes, and paths create
 * a living, breathing 3D mesh effect. Falls back to a static gradient
 * when prefers-reduced-motion is active.
 */
export default function GradientBackdrop() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 overflow-hidden"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {/* Deep ambient glow — gives sense of depth */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 60%, rgba(124, 92, 255, 0.08), transparent 70%)",
        }}
      />

      {/* Blob 1 — large violet, slow orbit, deep layer */}
      <div
        className={`absolute w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full
                    top-[-15%] left-[-15%] opacity-70
                    ${prefersReduced ? "" : "animate-[blob1_20s_ease-in-out_infinite]"}
                    motion-reduce:animate-none`}
        style={{
          background:
            "radial-gradient(circle, rgba(124, 92, 255, 0.22) 0%, rgba(124, 92, 255, 0.06) 35%, transparent 65%)",
          filter: "blur(80px)",
          transform: "translateZ(-100px)",
        }}
      />

      {/* Blob 2 — ember/orange, medium orbit, mid layer */}
      <div
        className={`absolute w-[65vw] h-[65vw] max-w-[750px] max-h-[750px] rounded-full
                    top-[5%] right-[-20%] opacity-65
                    ${prefersReduced ? "" : "animate-[blob2_24s_ease-in-out_infinite]"}
                    motion-reduce:animate-none`}
        style={{
          background:
            "radial-gradient(circle, rgba(232, 116, 60, 0.20) 0%, rgba(232, 116, 60, 0.05) 35%, transparent 65%)",
          filter: "blur(70px)",
          transform: "translateZ(-50px)",
        }}
      />

      {/* Blob 3 — violet accent, faster, front layer */}
      <div
        className={`absolute w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full
                    bottom-[-10%] left-[15%] opacity-55
                    ${prefersReduced ? "" : "animate-[blob3_16s_ease-in-out_infinite]"}
                    motion-reduce:animate-none`}
        style={{
          background:
            "radial-gradient(circle, rgba(124, 92, 255, 0.18) 0%, rgba(124, 92, 255, 0.04) 40%, transparent 65%)",
          filter: "blur(60px)",
          transform: "translateZ(-30px)",
        }}
      />

      {/* Blob 4 — small intense ember highlight, nearest layer */}
      <div
        className={`absolute w-[40vw] h-[40vw] max-w-[450px] max-h-[450px] rounded-full
                    top-[35%] left-[45%] opacity-45
                    ${prefersReduced ? "" : "animate-[blob4_13s_ease-in-out_infinite]"}
                    motion-reduce:animate-none`}
        style={{
          background:
            "radial-gradient(circle, rgba(232, 116, 60, 0.16) 0%, transparent 55%)",
          filter: "blur(45px)",
          transform: "translateZ(-10px)",
        }}
      />

      {/* Blob 5 — additional depth layer, slow cyan-violet shimmer */}
      <div
        className={`absolute w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full
                    top-[60%] right-[10%] opacity-30
                    ${prefersReduced ? "" : "animate-[blob1_28s_ease-in-out_infinite_reverse]"}
                    motion-reduce:animate-none`}
        style={{
          background:
            "radial-gradient(circle, rgba(124, 92, 255, 0.12) 0%, rgba(201, 205, 211, 0.03) 40%, transparent 65%)",
          filter: "blur(90px)",
          transform: "translateZ(-120px)",
        }}
      />

      {/* Subtle noise grain over the gradient for texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette for cinematic depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(8, 8, 10, 0.6) 100%)",
        }}
      />
    </div>
  );
}
