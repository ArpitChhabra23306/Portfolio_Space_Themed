"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Zap, Rocket, Terminal, BookOpen, Clock, Globe } from "lucide-react";

/** Live local time in a given IANA timezone, e.g. "7:42 PM". */
function useLocalTime(timeZone) {
  const [time, setTime] = useState("");
  useEffect(() => {
    if (!timeZone) return;
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000 * 30);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

/** Live DSA problems-solved count from the Codolio endpoint (falls back to a static value). */
function useDsaSolved(fallback) {
  const [solved, setSolved] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats/codolio")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json?.ok && json.dsa?.totalQuestions) {
          setSolved(json.dsa.totalQuestions);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return solved ?? fallback;
}

const bentoVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98, filter: "blur(10px)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function AboutClient({ data, children }) {
  const { openToWork, location, values, currentlyLearning } = data;
  const localTime = useLocalTime(data.timezone);
  const dsaSolved = useDsaSolved(500);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 mt-32 z-10">

      {/* Section Header */}
      <motion.div 
        className="mb-16 md:mb-24 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted/50 mb-4">
          [ Origin ]
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-white/90">
          The origin story — <br className="hidden md:block"/>
          <span className="italic font-serif text-white/50 font-normal">reality, purpose, and capabilities.</span>
        </h2>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[auto]">
        
        {/* 1. Main Bio (Spans 2 columns) */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={bentoVariants}
          className="md:col-span-2 lg:col-span-2 row-span-2 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-10 backdrop-blur-md relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 text-white group-hover:opacity-20 transition-opacity duration-500">
            <Terminal size={120} strokeWidth={1} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-12">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-accent-ember animate-pulse shadow-[0_0_12px_rgba(232,116,60,0.6)]" />
                <span className="font-mono text-xs uppercase tracking-widest text-text-muted/60">System Ready</span>
              </div>
              
              <div className="prose prose-invert prose-lg max-w-none text-white/70 
                [&>p]:mb-6 [&>p:last-child]:mb-0 
                [&>p>strong]:font-semibold [&>p>strong]:text-white/90
                [&>p>em]:font-serif [&>p>em]:italic [&>p>em]:text-white">
                {children}
              </div>
            </div>
            
            {openToWork && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Available for New Missions
              </div>
            )}
          </div>
        </motion.div>

        {/* 2. Location / Globe connection */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={bentoVariants}
          className="md:col-span-1 lg:col-span-1 bg-gradient-to-br from-[#0c1322] to-ink-950 border border-blue-900/30 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center text-center relative overflow-hidden group"
        >
          {/* Subtle blue pulse radial */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,100,200,0.1)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          
          <Globe className="w-12 h-12 text-blue-400/80 mb-4 z-10 stroke-[1.5]" />
          <h3 className="text-xl font-bold text-white/90 z-10 tracking-tight">{location}</h3>
          <p className="font-mono text-xs text-blue-400/50 mt-2 tracking-widest z-10">{data.timezone}</p>
          {localTime && (
            <p className="font-mono text-sm text-blue-300/80 mt-3 z-10 flex items-center gap-1.5 tabular-nums">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400" />
              </span>
              {localTime} local
            </p>
          )}
        </motion.div>

        {/* 3. Metrics / Fun Facts Stack */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={bentoVariants}
          className="md:col-span-1 lg:col-span-1 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between group"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted/50 mb-6 flex items-center gap-2">
              <Zap size={14} /> Data Points
            </p>
            <div className="space-y-6">
              <div>
                <p className="text-3xl font-bold text-white/90 tracking-tighter">{dsaSolved}+</p>
                <p className="text-sm text-text-muted/60 mt-1">DSA Problems</p>
              </div>
              <div className="h-[1px] w-full bg-white/[0.05]" />
              <div>
                <p className="text-3xl font-bold text-white/90 tracking-tighter">16 yrs</p>
                <p className="text-sm text-text-muted/60 mt-1">Built first app</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. Values */}
        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={bentoVariants}
          className="md:col-span-2 lg:col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-md group"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted/50 mb-8 flex items-center gap-2">
            <Rocket size={14} /> Core Directives
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center border border-white/[0.08] text-white/60 group-hover:border-white/20 transition-colors">
                  {idx === 0 ? <Rocket size={18}/> : idx === 1 ? <BookOpen size={18}/> : <Code2 size={18}/>}
                </div>
                <h4 className="font-medium text-white/80">{val}</h4>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 5. Currently Learning */}
        <motion.div
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={bentoVariants}
          className="md:col-span-1 lg:col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group"
        >
          <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-white group-hover:opacity-[0.06] transition-opacity duration-500 transform rotate-12">
            <Code2 size={160} strokeWidth={1} />
          </div>
          
          <div className="relative z-10">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted/50 mb-6 flex items-center gap-2">
              <Clock size={14} /> Processing Array...
            </p>
            <div className="flex flex-wrap gap-3">
              {currentlyLearning.map((item, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm text-white/70 tracking-wide hover:bg-white/10 hover:border-white/20 transition-colors cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 6. Connection / CTA Box (Fills the empty space) */}
        <motion.div
          custom={5}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={bentoVariants}
          className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-accent-ember/10 to-transparent border border-accent-ember/20 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-center relative overflow-hidden group hover:border-accent-ember/40 transition-colors"
        >
          {/* Subtle pulse glow */}
          <div className="absolute inset-0 bg-accent-ember/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent-ember/80 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-ember animate-pulse" />
                Connection Open
              </p>
              <h3 className="text-2xl font-bold text-white/90 tracking-tight">Initiate handshake?</h3>
            </div>
            
            <a 
              href="#contact" 
              className="px-6 py-3 rounded-full bg-accent-ember text-ink-950 font-bold tracking-wide hover:bg-white hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Let&apos;s Talk
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
