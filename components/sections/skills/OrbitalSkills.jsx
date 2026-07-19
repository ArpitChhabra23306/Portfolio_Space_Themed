"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Orbital Skills — immersive solar system. Orbits extend beyond viewport.
 * Tilted for 3D perspective. Skills orbit as glowing nodes.
 * Hover pauses the system and reveals details.
 */

/* ── colour palette matching the dark-blue / ember system ── */
const RING_CONFIG = [
  { category: "Frontend",  color: "#38bdf8", glow: "rgba(56,189,248,0.35)",  radius: 160, speed: 32, tilt: 75 },
  { category: "Backend",   color: "#4ade80", glow: "rgba(74,222,128,0.35)",  radius: 260, speed: 44, tilt: 75 },
  { category: "DevOps",    color: "#fbbf24", glow: "rgba(251,191,36,0.35)",  radius: 360, speed: 58, tilt: 75 },
  { category: "Database",  color: "#c084fc", glow: "rgba(192,132,252,0.35)", radius: 450, speed: 70, tilt: 75 },
  { category: "Languages", color: "#fb7185", glow: "rgba(251,113,133,0.35)", radius: 560, speed: 86, tilt: 75 },
  { category: "Tools",     color: "#94a3b8", glow: "rgba(148,163,184,0.35)", radius: 660, speed: 100, tilt: 75 },
];

export default function OrbitalSkills({ categories, skills }) {
  const containerRef = useRef(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [dims, setDims] = useState({ w: 960, h: 700 });

  // Group skills by category
  const grouped = {};
  categories.forEach((cat) => {
    grouped[cat] = skills.filter((s) => s.category === cat);
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const { width } = el.getBoundingClientRect();
      setDims({ w: width, h: Math.min(width * 0.75, 800) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const globalScale = Math.min(dims.w / 1400, 1);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <div
        className="relative mx-auto"
        style={{ width: "100%", height: dims.h, perspective: "1200px" }}
      >
        {/* ── 3D-tilted orbital plane ── */}
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(60deg)",
          }}
        >
          {/* ── Orbit ring tracks ── */}
          {RING_CONFIG.map((ring) => {
            const r = ring.radius * globalScale;
            return (
              <div
                key={`track-${ring.category}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: r * 2,
                  height: r * 2,
                  left: cx - r,
                  top: cy - r,
                  border: `1px solid ${ring.color}10`,
                  boxShadow: `inset 0 0 30px ${ring.color}05`,
                }}
              />
            );
          })}

          {/* ── Central Sun ── */}
          <div
            className="absolute z-30"
            style={{
              width: 90 * globalScale,
              height: 90 * globalScale,
              left: cx - 45 * globalScale,
              top: cy - 45 * globalScale,
              transform: "rotateX(-60deg)",
            }}
          >
            {/* Outer glow pulse */}
            <div
              className="absolute inset-[-60%] rounded-full animate-pulse"
              style={{
                background: "radial-gradient(circle, rgba(232,116,60,0.12) 0%, transparent 70%)",
              }}
            />
            {/* Core */}
            <div
              className="w-full h-full rounded-full flex items-center justify-center border border-accent-ember/30 relative"
              style={{
                background: "radial-gradient(circle, rgba(232,116,60,0.25) 0%, rgba(232,116,60,0.03) 80%)",
                boxShadow: "0 0 50px rgba(232,116,60,0.2), 0 0 100px rgba(232,116,60,0.08), inset 0 0 20px rgba(232,116,60,0.1)",
              }}
            >
              {/* Inner dot */}
              <div
                className="w-3 h-3 rounded-full bg-accent-ember"
                style={{ boxShadow: "0 0 20px rgba(232,116,60,0.8)" }}
              />
            </div>
          </div>

          {/* ── Orbiting Skill Nodes ── */}
          {RING_CONFIG.map((ring) => {
            const r = ring.radius * globalScale;
            const catSkills = grouped[ring.category] || [];
            const direction = RING_CONFIG.indexOf(ring) % 2 === 0 ? 1 : -1;

            return catSkills.map((skill, idx) => {
              const isHovered = hoveredSkill === skill.name;

              return (
                <div
                  key={skill.name}
                  className="absolute"
                  style={{
                    width: 0,
                    height: 0,
                    left: cx,
                    top: cy,
                    animation: isPaused
                      ? undefined
                      : `orbit-${direction > 0 ? "cw" : "ccw"} ${ring.speed}s linear infinite`,
                    animationPlayState: isPaused ? "paused" : "running",
                    animationDelay: `-${(ring.speed / catSkills.length) * idx}s`,
                  }}
                >
                  {/* The node — counter-rotated + un-tilted so text stays readable */}
                  <motion.div
                    className="absolute cursor-pointer select-none"
                    style={{
                      left: r,
                      top: -12 * globalScale,
                      transformOrigin: `${-r}px ${12 * globalScale}px`,
                      animation: isPaused
                        ? undefined
                        : `orbit-${direction > 0 ? "ccw" : "cw"} ${ring.speed}s linear infinite`,
                      animationPlayState: isPaused ? "paused" : "running",
                      animationDelay: `-${(ring.speed / catSkills.length) * idx}s`,
                      /* un-tilt so the label is flat */
                      transform: "rotateX(-60deg)",
                    }}
                    onMouseEnter={() => { setHoveredSkill(skill.name); setIsPaused(true); }}
                    onMouseLeave={() => { setHoveredSkill(null); setIsPaused(false); }}
                    animate={{ scale: isHovered ? 1.4 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Glow ring behind the node */}
                    <div
                      className="absolute inset-[-8px] rounded-full pointer-events-none transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle, ${ring.glow}, transparent 70%)`,
                        opacity: isHovered ? 1 : 0,
                      }}
                    />

                    <div
                      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border whitespace-nowrap transition-all duration-300"
                      style={{
                        fontSize: Math.max(10, 12 * globalScale),
                        background: isHovered
                          ? `linear-gradient(135deg, ${ring.color}20, ${ring.color}08)`
                          : "rgba(255,255,255,0.03)",
                        borderColor: isHovered ? ring.color : "rgba(255,255,255,0.06)",
                        boxShadow: isHovered
                          ? `0 0 16px ${ring.glow}, 0 0 32px ${ring.glow}`
                          : "none",
                        color: isHovered ? ring.color : "rgba(255,255,255,0.65)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: ring.color,
                          boxShadow: `0 0 6px ${ring.color}`,
                        }}
                      />
                      {skill.name}
                    </div>
                  </motion.div>
                </div>
              );
            });
          })}
        </div>

        {/* Radial fade at edges so orbits bleed off-screen */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: `
              linear-gradient(to right, var(--color-ink-950) 0%, transparent 12%, transparent 88%, var(--color-ink-950) 100%),
              linear-gradient(to bottom, var(--color-ink-950) 0%, transparent 8%, transparent 92%, var(--color-ink-950) 100%)
            `,
          }}
        />
      </div>

      {/* ── Hovered Skill Detail ── */}
      <AnimatePresence>
        {hoveredSkill && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-8 z-40 px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl"
          >
            {(() => {
              const s = skills.find((sk) => sk.name === hoveredSkill);
              const cfg = RING_CONFIG.find((r) => r.category === s?.category);
              return (
                <div className="flex items-center gap-4">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: cfg?.color, boxShadow: `0 0 10px ${cfg?.glow}` }}
                  />
                  <div>
                    <p className="text-sm font-medium text-white/90">{s?.name}</p>
                    <p className="text-[11px] text-text-muted/50 font-mono">
                      {s?.category} · {s?.yearsOfExperience} yr{s?.yearsOfExperience > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Category Legend ── */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-12">
        {RING_CONFIG.map((ring) => (
          <div key={ring.category} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: ring.color, boxShadow: `0 0 6px ${ring.glow}` }}
            />
            <span className="text-[11px] text-text-muted/50 font-mono tracking-widest uppercase">
              {ring.category}
            </span>
          </div>
        ))}
      </div>

      {/* ── Keyframes ── */}
      <style jsx>{`
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
