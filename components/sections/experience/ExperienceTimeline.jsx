"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/* ─────────────────────────── helpers ─────────────────────────── */

function formatDate(dateStr) {
  if (!dateStr) return "PRESENT";
  return new Date(dateStr)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();
}

/* Real equirectangular planet maps (2048×1024, in /public/textures).
   Scrolled horizontally to simulate rotation. Cycled by index. */
const PLANETS = [
  { map: "/textures/jupiter_map.jpg", alt: "Jupiter", spin: "32s" },
  { map: "/textures/mars_map.jpg", alt: "Mars", spin: "48s" },
];

/* ─────────────────── parallax star layers ─────────────────── */

function StarLayer({ count, size, opacity, blur = 0 }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        d: 2 + Math.random() * 5,
        delay: Math.random() * 6,
      })),
    [count]
  );
  return (
    <div
      className="absolute inset-0"
      style={{ filter: blur ? `blur(${blur}px)` : undefined }}
    >
      {stars.map((s) => (
        <span
          key={s.id}
          className="exp-star absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: size,
            height: size,
            opacity,
            animationDuration: `${s.d}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────── planet ─────────────────────────── */

function Planet({ planet, reduced }) {
  return (
    <div
      className="relative h-20 w-20 md:h-28 md:w-28 rounded-full overflow-hidden"
      role="img"
      aria-label={planet.alt}
      style={{ boxShadow: "0 8px 34px rgba(0,0,0,0.65)" }}
    >
      {/* rotating surface — a doubled-width equirectangular map scrolled seamlessly */}
      <div
        className={reduced ? "absolute inset-y-0 left-0" : "exp-surface absolute inset-y-0 left-0"}
        style={{
          width: "200%",
          backgroundImage: `url(${planet.map})`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "50% 100%",
          animationDuration: reduced ? undefined : planet.spin,
        }}
      />
      {/* spherical shading: soft highlight + limb darkening → real 3D sphere */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 27%, rgba(255,255,255,0.30), rgba(255,255,255,0.05) 20%, transparent 46%)," +
            "radial-gradient(circle at 50% 50%, transparent 48%, rgba(0,0,0,0.30) 76%, rgba(0,0,0,0.68) 100%)",
        }}
      />
      {/* faint rim */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
      />
    </div>
  );
}

/* ─────────────────── spacecraft HUD card ─────────────────── */

function HudCard({ entry, index, reduced }) {
  const isCurrent = !entry.endDate;
  const missionId = `EXP-${String(index + 1).padStart(2, "0")}`;

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 36, scale: 0.98 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl p-6 md:p-7 overflow-hidden
                 bg-[rgba(10,12,20,0.6)] border border-white/[0.08] backdrop-blur-md
                 hover:border-accent-ember/30
                 transition-colors duration-300
                 shadow-[0_10px_50px_-18px_rgba(0,0,0,0.8)]"
    >
      {/* corner reticle brackets */}
      <span className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l border-t border-white/20" />
      <span className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r border-t border-white/20" />
      <span className="pointer-events-none absolute left-2 bottom-2 h-4 w-4 border-l border-b border-white/20" />
      <span className="pointer-events-none absolute right-2 bottom-2 h-4 w-4 border-r border-b border-white/20" />

      {/* scanline sweep on hover */}
      {!reduced && (
        <span className="exp-scan pointer-events-none absolute inset-x-0 top-0 h-16 opacity-0 group-hover:opacity-100" />
      )}

      {/* corner glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-accent-ember/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* HUD header row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-white/25">
            {missionId}
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent-ember/70">
            {formatDate(entry.startDate)} → {formatDate(entry.endDate)}
          </span>
        </div>

        {/* role */}
        <h3 className="text-xl md:text-2xl font-sans font-bold text-white/95 tracking-tight leading-tight">
          {entry.role}
        </h3>

        {/* org · location + status */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm text-white/45">
            <span className="text-white/70">{entry.org}</span> · {entry.location}
          </p>
          {isCurrent && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-medium text-green-400">
              <span className="relative flex h-1.5 w-1.5">
                {!reduced && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              ACTIVE
            </span>
          )}
        </div>

        {/* bullets */}
        <ul className="mt-4 space-y-2.5">
          {entry.bullets.map((bullet, bi) => (
            <li
              key={bi}
              className="flex items-start gap-3 text-sm text-white/55 leading-relaxed"
            >
              <span className="mt-1.5 font-mono text-accent-ember/50 text-[10px] flex-shrink-0">
                {String(bi + 1).padStart(2, "0")}
              </span>
              {bullet}
            </li>
          ))}
        </ul>

        {/* tags */}
        {entry.tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wide
                           bg-white/[0.03] border border-white/[0.08] text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* ─────────────────── rocket that rides the beam ─────────────────── */

function Rocket() {
  return (
    <div className="relative flex flex-col items-center">
      <span className="exp-flame absolute -bottom-3 h-4 w-1.5 rounded-full bg-gradient-to-b from-accent-ember via-amber-300 to-transparent" />
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
        <path d="M10 0c4 3 6 8 6 13l-3 3H7l-3-3C4 8 6 3 10 0z" fill="#EDEFF3" />
        <circle cx="10" cy="9" r="2.4" fill="#7C5CFF" />
        <path d="M4 15l-3 4 4-1 1-3H4zM16 15l3 4-4-1-1-3h2z" fill="#E8743C" />
      </svg>
    </div>
  );
}

/* ─────────────────────────── main ─────────────────────────── */

export default function ExperienceTimeline({ entries }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yNear = useTransform(sectionProgress, [0, 1], ["0%", "18%"]);
  const yFar = useTransform(sectionProgress, [0, 1], ["0%", "8%"]);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 65%", "end 75%"],
  });
  const beam = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <div
      ref={sectionRef}
      className="relative bg-[#050509] py-24 md:py-32 overflow-hidden"
    >
      {/* Nebula wash */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(1100px 600px at 82% 8%, rgba(124,92,255,0.10), transparent 60%)," +
            "radial-gradient(900px 520px at 10% 92%, rgba(232,116,60,0.08), transparent 60%)",
        }}
      />

      {/* Distant planet */}
      <div
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full opacity-30 blur-[2px]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #3a2b6b 0%, #1a1436 55%, #0a0820 100%)",
          boxShadow: "0 0 120px rgba(124,92,255,0.25)",
        }}
      />

      {/* Parallax stars */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: reduced ? 0 : yFar }}
        aria-hidden="true"
      >
        <StarLayer count={30} size={1} opacity={0.35} blur={0.4} />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: reduced ? 0 : yNear }}
        aria-hidden="true"
      >
        <StarLayer count={22} size={2} opacity={0.55} />
      </motion.div>

      {/* Header */}
      <div className="relative z-10 text-center mb-16 md:mb-24 px-6">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-text-muted/50 mb-4">
          [ Mission Log ]
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-white/90">
          Flight{" "}
          <span className="italic font-serif text-white/50 font-normal">path</span>
        </h2>
        <p className="mt-4 text-sm text-white/35 max-w-md mx-auto">
          Charting the course — each role a world along the journey.
        </p>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Spine */}
        <div className="absolute top-0 bottom-0 left-[27px] md:left-1/2 md:-translate-x-1/2 w-px">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/10 to-white/5" />
          <motion.div
            className="absolute top-0 left-0 w-full origin-top
                       bg-gradient-to-b from-accent-ember via-accent-ember/70 to-transparent
                       shadow-[0_0_14px_rgba(232,116,60,0.7)]"
            style={{ height: "100%", scaleY: reduced ? 1 : beam }}
          />
        </div>

        {/* Rocket riding the beam */}
        {!reduced && (
          <motion.div
            className="absolute left-[27px] md:left-1/2 md:-translate-x-1/2 -translate-x-1/2 z-30"
            style={{ top: beam, marginTop: "-12px" }}
          >
            <Rocket />
          </motion.div>
        )}

        {/* Entries */}
        <div className="space-y-16 md:space-y-28">
          {entries.map((entry, i) => {
            const planet = PLANETS[i % PLANETS.length];
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <div
                key={`${entry.org}-${entry.startDate}`}
                className="relative md:grid md:grid-cols-2 md:gap-32 items-center"
              >
                {/* Planet on the spine */}
                <div className="absolute left-[27px] md:left-1/2 md:-translate-x-1/2 top-4 md:top-1/2 md:-translate-y-1/2 -translate-x-1/2 z-20">
                  <Planet planet={planet} reduced={reduced} />
                </div>

                {/* Card, alternating side */}
                {side === "left" ? (
                  <>
                    <div className="pl-24 md:pl-0 md:pr-6">
                      <HudCard entry={entry} index={i} reduced={reduced} />
                    </div>
                    <div className="hidden md:block" />
                  </>
                ) : (
                  <>
                    <div className="hidden md:block" />
                    <div className="pl-24 md:pl-6">
                      <HudCard entry={entry} index={i} reduced={reduced} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* scoped animations */}
      <style jsx>{`
        :global(.exp-star) {
          animation-name: exp-twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          will-change: opacity;
        }
        @keyframes exp-twinkle {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.7;
          }
        }
        :global(.exp-surface) {
          animation-name: exp-rotate;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @keyframes exp-rotate {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        :global(.exp-flame) {
          animation: exp-flicker 0.18s ease-in-out infinite alternate;
        }
        @keyframes exp-flicker {
          from {
            transform: scaleY(0.7);
            opacity: 0.7;
          }
          to {
            transform: scaleY(1.15);
            opacity: 1;
          }
        }
        :global(.exp-scan) {
          background: linear-gradient(
            to bottom,
            rgba(232, 116, 60, 0.14),
            transparent
          );
          animation: exp-sweep 1.6s ease-in-out infinite;
        }
        @keyframes exp-sweep {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(420%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.exp-star),
          :global(.exp-surface),
          :global(.exp-flame),
          :global(.exp-scan) {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
