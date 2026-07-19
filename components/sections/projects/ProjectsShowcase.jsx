"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const SkillPlayground = dynamic(() => import("./SkillPlayground"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-accent-ember/30 animate-pulse" />
    </div>
  ),
});

const SUBTITLES = {
  "MindClash": "AI Debate Platform",
  "DevFlow": "Dev Productivity",
  "QuickNote AI": "Smart Notes",
  "CodeRace": "Competitive Coding",
  "Portfolio v2": "This Portfolio",
};

const contentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
};

const playgroundVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.2 },
  },
};

/**
 * ProjectsShowcase — split layout.
 * Project tabs on top → LEFT: physics skill playground | RIGHT: project details
 *
 * @param {{ projects: Array }} props
 */
export default function ProjectsShowcase({ projects }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeProject = projects[activeIdx];
  const fm = activeProject?.frontmatter || {};

  return (
    <div className="space-y-8">
      {/* ── Project Selector Tabs ── */}
      <div className="flex flex-wrap gap-2 justify-center">
        {projects.map((project, i) => {
          const isActive = i === activeIdx;
          const title = project.frontmatter.title;
          return (
            <button
              key={project.frontmatter.slug}
              onClick={() => setActiveIdx(i)}
              className={`
                group relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember
                ${isActive
                  ? "bg-accent-ember/15 border border-accent-ember/40 text-accent-ember"
                  : "bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/[0.15] hover:bg-white/[0.06]"
                }
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-ember animate-pulse" />
                )}
                {title}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Split View: Playground (Left) | Details (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[480px]">
        {/* LEFT — Physics Playground */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`playground-${fm.slug}`}
            variants={playgroundVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full"
          >
            <SkillPlayground skills={fm.techStack || []} />
          </motion.div>
        </AnimatePresence>

        {/* RIGHT — Project Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`details-${fm.slug}`}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col justify-center space-y-6 py-4"
          >
            {/* Subtitle */}
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent-ember/50">
              {SUBTITLES[fm.title] || fm.domains?.[0] || "Project"}
            </p>

            {/* Title */}
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white/95 tracking-tight leading-tight">
              {fm.title}
            </h3>

            {/* Summary */}
            <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-xl">
              {fm.summary}
            </p>

            {/* Problem / Solution / Impact */}
            {(fm.problem || fm.solution || fm.impact) && (
              <div className="space-y-4 pt-2">
                {fm.problem && (
                  <div className="flex gap-4 items-start">
                    <span className="mt-1 w-1 h-1 rounded-full bg-accent-ember/40 flex-shrink-0" />
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/25 mb-1">Problem</p>
                      <p className="text-sm text-white/45 leading-relaxed">{fm.problem}</p>
                    </div>
                  </div>
                )}
                {fm.solution && (
                  <div className="flex gap-4 items-start">
                    <span className="mt-1 w-1 h-1 rounded-full bg-accent-ember/40 flex-shrink-0" />
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/25 mb-1">Solution</p>
                      <p className="text-sm text-white/45 leading-relaxed">{fm.solution}</p>
                    </div>
                  </div>
                )}
                {fm.impact && (
                  <div className="flex gap-4 items-start">
                    <span className="mt-1 w-1 h-1 rounded-full bg-accent-ember/40 flex-shrink-0" />
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/25 mb-1">Impact</p>
                      <p className="text-sm text-white/45 leading-relaxed">{fm.impact}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Domains */}
            {fm.domains?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {fm.domains.map((d) => (
                  <span
                    key={d}
                    className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-white/[0.03] border border-white/[0.06] text-white/30"
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            <div className="flex items-center gap-3 pt-2">
              {fm.liveUrl && (
                <a
                  href={fm.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-accent-ember text-ink-950 hover:bg-white hover:scale-105 transition-all duration-200"
                >
                  <ExternalLink size={14} />
                  View Live
                </a>
              )}
              {fm.repoUrl && (
                <a
                  href={fm.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/[0.05] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.1] transition-all duration-200"
                >
                  <Github size={14} />
                  Source
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
