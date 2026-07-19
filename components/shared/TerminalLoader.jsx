"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Mission-control style boot lines (launch sequence). */
const BOOT_LINES = [
  "> Igniting main thrusters...",
  "> Uplink to ground control established...",
  "> Loading navigation systems...",
  "> Telemetry locked...",
  "> Fuel cells nominal...",
  "> Clearing the tower...",
  "> Entering orbit...",
  "> Launch sequence complete.",
  "",
  "> Welcome aboard, Commander Arpit.",
];

const LINE_INTERVAL = 340; // ms between lines
const HOLD_AFTER = 600; // ms to hold after last line
const WARP_MS = 900; // hyperspace exit duration
const SESSION_KEY = "boot-shown";

/* ── Warp starfield: stars that streak outward on exit ── */
function WarpStars({ warping, reduced }) {
  const stars = useRef(
    Array.from({ length: 90 }, () => ({
      // position around center, in vw/vh percentages
      x: Math.random() * 100,
      y: Math.random() * 100,
      len: 40 + Math.random() * 120,
      delay: Math.random() * 0.12,
      op: 0.3 + Math.random() * 0.5,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.current.map((s, i) => {
        // angle from center → each star streaks radially outward
        const dx = s.x - 50;
        const dy = s.y - 50;
        const dist = Math.max(0.001, Math.hypot(dx, dy));
        const nx = dx / dist;
        const ny = dy / dist;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: 2,
              height: 2,
              opacity: s.op,
            }}
            animate={
              warping && !reduced
                ? {
                    x: nx * s.len * 6,
                    y: ny * s.len * 6,
                    scaleX: 1 + Math.abs(nx) * 22,
                    scaleY: 1 + Math.abs(ny) * 22,
                    opacity: [s.op, 0.9, 0],
                  }
                : {}
            }
            transition={{ duration: WARP_MS / 1000, ease: "easeIn", delay: s.delay }}
          />
        );
      })}
    </div>
  );
}

/* ── Rocket that climbs with progress ── */
function Rocket({ progress, launched }) {
  // Sits near the bottom, rises with progress, then blasts off the top.
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 z-20"
      initial={{ bottom: "6%" }}
      animate={
        launched
          ? { bottom: "120%" }
          : { bottom: `${6 + (progress / 100) * 40}%` }
      }
      transition={
        launched
          ? { duration: 0.9, ease: [0.5, 0, 0.75, 0] }
          : { duration: 0.35, ease: "easeOut" }
      }
      aria-hidden="true"
    >
      <div className="relative flex flex-col items-center">
        {/* rocket */}
        <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
          <path d="M13 0c5 4 8 10 8 17l-4 4H9l-4-4C5 10 8 4 13 0z" fill="#EDEFF3" />
          <circle cx="13" cy="12" r="3" fill="#7C5CFF" />
          <path d="M5 21l-4 6 5-1.5 1.5-4.5H5zM21 21l4 6-5-1.5-1.5-4.5h2.5z" fill="#E8743C" />
        </svg>
        {/* exhaust flame */}
        <span className="loader-flame mt-0.5 h-5 w-2 rounded-full bg-gradient-to-b from-accent-ember via-amber-300 to-transparent" />
      </div>
    </motion.div>
  );
}

export default function TerminalLoader() {
  const [visible, setVisible] = useState(false);
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [launched, setLaunched] = useState(false);
  const [warping, setWarping] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timers = useRef([]);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timers.current.forEach(clearTimeout);
    setProgress(100);
    setLaunched(true);
    // brief liftoff, then warp, then unmount
    const t1 = setTimeout(() => setWarping(true), 350);
    const t2 = setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch (e) {
        /* ignore */
      }
      setVisible(false);
    }, 350 + WARP_MS);
    timers.current.push(t1, t2);
  }, []);

  useEffect(() => {
    // Only show once per browser session; skip entirely for reduced motion.
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch (e) {
      /* ignore */
    }
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (alreadyShown || prefersReduced) {
      setReduced(!!prefersReduced);
      return; // don't show the loader
    }

    setVisible(true);

    const list = timers.current; // stable array ref; safe to use in cleanup
    BOOT_LINES.forEach((text, i) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, text]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, i * LINE_INTERVAL);
      list.push(t);
    });

    const endT = setTimeout(finish, BOOT_LINES.length * LINE_INTERVAL + HOLD_AFTER);
    list.push(endT);

    return () => list.forEach(clearTimeout);
  }, [finish]);

  // Skip on any key / click / touch
  useEffect(() => {
    if (!visible) return;
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [visible, finish]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="terminal-loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: warping ? 0 : 1 }}
        transition={{ duration: warping ? WARP_MS / 1000 : 0.4, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "#08080A" }}
      >
        {/* starfield + warp streaks */}
        <WarpStars warping={warping} reduced={reduced} />

        {/* subtle nebula glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-violet/[0.06] blur-[130px]" />
        </div>

        {/* Rocket climbing in the background */}
        <Rocket progress={progress} launched={launched} />

        {/* Terminal window */}
        <motion.div
          className="relative z-10 w-[90vw] max-w-xl"
          animate={warping ? { scale: 1.08, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeIn" }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-t-lg"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="ml-3 text-[10px] font-mono text-white/25 tracking-wider">
              arpit@portfolio ~ launch
            </span>
          </div>

          {/* Terminal body */}
          <div
            className="px-5 py-4 rounded-b-lg font-mono text-xs leading-relaxed min-h-[248px]"
            style={{
              background: "rgba(10, 10, 10, 0.82)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: "none",
            }}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className="mb-1"
                style={{
                  color:
                    line.startsWith("> Launch sequence") || line.startsWith("> Welcome")
                      ? "#E8743C"
                      : "rgba(255,255,255,0.38)",
                }}
              >
                {line}
              </div>
            ))}
            <span className="inline-block w-2 h-3.5 bg-[#E8743C]/70 loader-blink align-middle" />
          </div>

          {/* Altitude gauge */}
          <div className="mt-4 flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.2em] text-white/25 uppercase">
              Altitude
            </span>
            <div className="relative flex-1 h-[3px] rounded-full overflow-hidden bg-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#7C5CFF,#E8743C)" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <span className="font-mono text-[9px] text-white/30 tabular-nums w-16 text-right">
              {Math.round(progress * 4.2)} km
            </span>
          </div>

          {/* Skip hint */}
          <p className="mt-3 text-center font-mono text-[9px] text-white/20 tracking-widest">
            PRESS ANY KEY TO SKIP
          </p>
        </motion.div>

        <style jsx>{`
          .loader-blink {
            animation: loaderBlink 1s steps(2, start) infinite;
          }
          @keyframes loaderBlink {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
          }
          .loader-flame {
            animation: loaderFlame 0.16s ease-in-out infinite alternate;
            transform-origin: top center;
          }
          @keyframes loaderFlame {
            from {
              transform: scaleY(0.7);
              opacity: 0.7;
            }
            to {
              transform: scaleY(1.25);
              opacity: 1;
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
