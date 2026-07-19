"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ease, dur } from "@/lib/motion";

const COMMANDS = [
  "$ cd ~/portfolio",
  "$ npm run dev",
  "✓ Ready on http://localhost:3000",
];

const TYPING_SPEED = 60; // ms per character
const PAUSE_BETWEEN = 500; // ms between commands
const REVEAL_DELAY = 800; // ms after last command before fade

/**
 * Terminal-style CLI intro that types fake shell commands before revealing hero content.
 * Skips animation entirely when prefers-reduced-motion: reduce.
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function TerminalIntro({ children }) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState(prefersReduced ? "done" : "typing");
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");

  const typeCommands = useCallback(async () => {
    for (let i = 0; i < COMMANDS.length; i++) {
      const cmd = COMMANDS[i];
      // Type each character
      for (let j = 0; j <= cmd.length; j++) {
        await new Promise((r) => setTimeout(r, TYPING_SPEED));
        setCurrentLine(cmd.slice(0, j));
      }
      // Commit line
      setLines((prev) => [...prev, cmd]);
      setCurrentLine("");
      // Pause between commands
      if (i < COMMANDS.length - 1) {
        await new Promise((r) => setTimeout(r, PAUSE_BETWEEN));
      }
    }
    // Wait before revealing hero
    await new Promise((r) => setTimeout(r, REVEAL_DELAY));
    setPhase("done");
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      setPhase("done");
      return;
    }
    typeCommands();
  }, [prefersReduced, typeCommands]);

  // Skip animation entirely for reduced motion
  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {phase === "typing" && (
          <motion.div
            key="terminal"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.base, ease }}
            className="flex items-center justify-center min-h-[60vh]"
            aria-hidden="true"
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-ink-950/90 backdrop-blur-xl
                         border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                         p-6 font-mono text-sm"
            >
              {/* Terminal title bar */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-text-muted">terminal</span>
              </div>

              {/* Typed lines */}
              <div className="space-y-1">
                {lines.map((line, i) => (
                  <p key={i} className="text-green-400">
                    {line}
                  </p>
                ))}
                {/* Currently typing line */}
                {currentLine && (
                  <p className="text-green-400">
                    {currentLine}
                    <span className="inline-block w-2 h-4 ml-0.5 bg-green-400 animate-pulse align-middle" />
                  </p>
                )}
                {/* Blinking cursor when idle between commands */}
                {!currentLine && phase === "typing" && lines.length < COMMANDS.length && (
                  <p className="text-green-400">
                    <span className="inline-block w-2 h-4 bg-green-400 animate-pulse align-middle" />
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero content */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur.base, ease }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
