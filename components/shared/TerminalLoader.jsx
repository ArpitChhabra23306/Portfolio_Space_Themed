"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "> Initializing system...", delay: 0 },
  { text: "> Loading kernel modules...", delay: 400 },
  { text: "> Establishing secure connection...", delay: 800 },
  { text: "> Fetching portfolio data...", delay: 1200 },
  { text: "> Compiling assets...", delay: 1800 },
  { text: "> Rendering UI components...", delay: 2400 },
  { text: "> Calibrating display...", delay: 3000 },
  { text: "> System ready.", delay: 3600 },
  { text: "", delay: 4000 },
  { text: "> Welcome, Arpit Chhabra.", delay: 4200 },
];

export default function TerminalLoader() {
  const [visible, setVisible] = useState(true);
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const timerRef = useRef([]);

  useEffect(() => {
    // Show each line with a delay
    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, line.text]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, line.delay);
      timerRef.current.push(t);
    });

    // Start fade-out at 5s
    const fadeTimer = setTimeout(() => setFadeOut(true), 5000);
    // Remove overlay at 5.8s
    const removeTimer = setTimeout(() => setVisible(false), 5800);

    timerRef.current.push(fadeTimer, removeTimer);

    return () => timerRef.current.forEach(clearTimeout);
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          key="terminal-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#08080A" }}
        >
          {/* Terminal window */}
          <div className="w-[90vw] max-w-xl">
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
              <span className="ml-3 text-[10px] font-mono text-white/20 tracking-wider">
                arpit@portfolio ~ boot
              </span>
            </div>

            {/* Terminal body */}
            <div
              className="px-5 py-4 rounded-b-lg font-mono text-xs leading-relaxed min-h-[260px]"
              style={{
                background: "rgba(10, 10, 10, 0.8)",
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
                      line.startsWith("> System ready") ||
                      line.startsWith("> Welcome")
                        ? "#E8743C"
                        : "rgba(255,255,255,0.35)",
                  }}
                >
                  {line}
                </div>
              ))}

              {/* Blinking cursor */}
              <span className="inline-block w-2 h-3.5 bg-[#E8743C]/60 animate-pulse" />
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-full h-[2px] rounded-full overflow-hidden bg-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "#E8743C" }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <p className="mt-2 text-center font-mono text-[9px] text-white/10 tracking-widest">
              {progress}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
