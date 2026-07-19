"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ease, dur } from "@/lib/motion";

const PROFICIENCY_MAP = {
  Familiar: 33,
  Proficient: 66,
  Advanced: 92,
};

/**
 * Radial progress ring that animates from 0 to fill on viewport entry.
 * @param {{ proficiency: 'Familiar'|'Proficient'|'Advanced', size?: number }} props
 */
export default function SkillRing({ proficiency, size = 48 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const percent = PROFICIENCY_MAP[proficiency] ?? 33;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      aria-hidden="true"
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
      />
      {/* Animated fill */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={isInView ? { strokeDashoffset: circumference - filled } : {}}
        transition={{ duration: dur.slow, ease }}
        className="text-accent-ember origin-center -rotate-90"
        style={{ transformOrigin: "center" }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* Percentage text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-text-primary text-[10px] font-mono"
        fontSize={size * 0.22}
      >
        {percent}%
      </text>
    </svg>
  );
}
