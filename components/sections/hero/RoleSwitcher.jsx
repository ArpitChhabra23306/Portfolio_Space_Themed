"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const ROLES = [
  "Full-Stack Developer",
  "MERN Engineer",
  "Open-Source Contributor",
  "Competitive Programmer",
];

const TYPE_SPEED = 80;
const DELETE_SPEED = 40;
const PAUSE_DURATION = 2000;

/**
 * Typing-effect role cycler. Cycles through a list of roles with a typing animation.
 * Falls back to static display of the first role when prefers-reduced-motion is active.
 */
export default function RoleSwitcher() {
  const prefersReduced = useReducedMotion();
  const [displayText, setDisplayText] = useState("");
  const roleIndexRef = useRef(0);
  const phaseRef = useRef("typing"); // "typing" | "pausing" | "deleting"
  const timerRef = useRef(null);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayText(ROLES[0]);
      return;
    }

    function step() {
      setDisplayText((prev) => {
        const currentRole = ROLES[roleIndexRef.current];

        if (phaseRef.current === "typing") {
          if (prev.length < currentRole.length) {
            timerRef.current = setTimeout(step, TYPE_SPEED);
            return currentRole.slice(0, prev.length + 1);
          }
          phaseRef.current = "pausing";
          timerRef.current = setTimeout(() => {
            phaseRef.current = "deleting";
            step();
          }, PAUSE_DURATION);
          return prev;
        }

        if (phaseRef.current === "deleting") {
          if (prev.length > 0) {
            timerRef.current = setTimeout(step, DELETE_SPEED);
            return prev.slice(0, -1);
          }
          roleIndexRef.current = (roleIndexRef.current + 1) % ROLES.length;
          phaseRef.current = "typing";
          timerRef.current = setTimeout(step, TYPE_SPEED);
          return prev;
        }

        return prev;
      });
    }

    timerRef.current = setTimeout(step, TYPE_SPEED);
    return () => clearTimeout(timerRef.current);
  }, [prefersReduced]);

  return (
    <span className="inline-flex items-center font-mono text-accent-ember text-lg md:text-xl">
      <span aria-live={prefersReduced ? "off" : "polite"} aria-atomic="true">
        {displayText}
      </span>
      {!prefersReduced && (
        <span
          className="ml-0.5 inline-block w-[2px] h-5 md:h-6 bg-accent-ember animate-[blink_1s_step-end_infinite] motion-reduce:animate-none"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
