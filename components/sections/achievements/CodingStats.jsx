"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/shared/GlassCard";
import ContributionHeatmap from "./ContributionHeatmap";

const DSA_COLORS = [
  "bg-white/[0.06]",
  "bg-amber-900/60",
  "bg-amber-700/80",
  "bg-amber-500/90",
  "bg-amber-400",
];
const GH_COLORS = [
  "bg-white/[0.06]",
  "bg-emerald-900/60",
  "bg-emerald-700/80",
  "bg-emerald-500/90",
  "bg-emerald-400",
];

const PLATFORM_META = {
  leetcode: { color: "text-amber-400", category: "DSA" },
  codechef: { color: "text-orange-400", category: "Competitive" },
  geeksforgeeks: { color: "text-emerald-400", category: "DSA / Core" },
  codestudio: { color: "text-sky-400", category: "DSA" },
  codeforces: { color: "text-rose-400", category: "Competitive" },
};

/** official GitHub shape { weeks: [{ contributionDays|days }] } → { date: count } */
function weeksToMap(calendar) {
  const map = {};
  if (!calendar?.weeks) return map;
  for (const w of calendar.weeks) {
    for (const d of w.contributionDays || w.days || []) {
      if (d.count > 0) map[d.date] = d.count;
    }
  }
  return map;
}

function HeroStat({ value, label, accent }) {
  return (
    <div className="flex flex-col items-center text-center px-2">
      <span
        className={`font-mono text-3xl sm:text-4xl text-text-primary ${accent}`}
      >
        {value}
      </span>
      <span className="text-[11px] sm:text-xs text-text-muted mt-1 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

function DifficultyBar({ easy, medium, hard }) {
  const total = easy + medium + hard || 1;
  const seg = (n, cls) => <div className={cls} style={{ width: `${(n / total) * 100}%` }} />;
  return (
    <div>
      <div className="flex h-2 w-full rounded-full overflow-hidden bg-white/5">
        {seg(easy, "bg-emerald-500")}
        {seg(medium, "bg-amber-500")}
        {seg(hard, "bg-rose-500")}
      </div>
      <div className="flex gap-4 text-xs mt-2">
        <span className="text-emerald-400">Easy {easy}</span>
        <span className="text-amber-400">Medium {medium}</span>
        <span className="text-rose-400">Hard {hard}</span>
      </div>
    </div>
  );
}

function PlatformRow({ p }) {
  const meta = PLATFORM_META[p.key] || { color: "text-text-primary", category: "" };
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`font-medium text-sm ${meta.color} truncate`}>{p.platform}</span>
        {meta.category && (
          <span className="text-[10px] uppercase tracking-wide text-text-dim">{meta.category}</span>
        )}
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="font-mono text-sm text-text-primary">{p.solved}</span>
        {p.rating != null && (
          <span className="text-xs text-text-dim">
            {p.rating}
            {p.maxRating != null && p.maxRating !== p.rating ? ` / ${p.maxRating}` : ""}
          </span>
        )}
        {p.contests > 0 && (
          <span className="text-xs text-text-dim hidden sm:inline">{p.contests} contests</span>
        )}
      </div>
    </div>
  );
}

function RefreshIcon({ spinning }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={spinning ? "animate-spin" : ""}
    >
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-14 h-8 bg-white/10 rounded" />
            <div className="w-16 h-3 bg-white/10 rounded" />
          </div>
        ))}
      </div>
      <div className="h-40 bg-white/5 rounded-xl" />
    </div>
  );
}

/**
 * CodingStats — a single unified panel merging DSA (Codolio-aggregated across
 * LeetCode, CodeChef, GFG, Code360) and GitHub activity. Shows a combined hero
 * strip, a tab switcher for the detailed view, and per-source heatmaps.
 */
export default function CodingStats() {
  const [state, setState] = useState({ loading: true, error: false });
  const [dsa, setDsa] = useState(null);
  const [github, setGithub] = useState(null);
  const [tab, setTab] = useState("dsa");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (fresh = false) => {
    const q = fresh ? "?fresh=1" : "";
    try {
      const [codolioRes, officialRes] = await Promise.allSettled([
        fetch(`/api/stats/codolio${q}`, fresh ? { cache: "no-store" } : {}).then((r) => r.json()),
        fetch(`/api/stats/github${q}`, fresh ? { cache: "no-store" } : {}).then((r) => r.json()),
      ]);

      const codolio = codolioRes.status === "fulfilled" ? codolioRes.value : null;
      const official = officialRes.status === "fulfilled" ? officialRes.value : null;

      if (codolio?.ok && codolio.dsa) setDsa(codolio.dsa);

      const cGithub = codolio?.ok ? codolio.github : null;
      const officialMap = official?.ok ? weeksToMap(official.contributionCalendar) : {};
      const codolioMap = cGithub?.contributionCalendar || {};
      const calendar = Object.keys(officialMap).length > 0 ? officialMap : codolioMap;

      if (cGithub || official?.ok) {
        setGithub({
          username: cGithub?.username || null,
          publicRepos: official?.ok ? official.publicRepos : 0,
          followers: official?.ok ? official.followers : 0,
          totalStars: official?.ok ? official.totalStars : cGithub?.stars || 0,
          commits: cGithub?.commits || 0,
          totalContributions: cGithub?.totalContributions || 0,
          totalActiveDays: cGithub?.totalActiveDays || 0,
          calendar,
        });
      }

      const ok = (codolio?.ok ?? false) || (official?.ok ?? false);
      setState({ loading: false, error: !ok });
    } catch {
      setState({ loading: false, error: true });
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  };

  const { loading, error } = state;

  return (
    <GlassCard className="p-5 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium text-text-primary">Coding Activity</h3>
          <p className="text-xs text-text-dim mt-1">
            Live across LeetCode · CodeChef · GeeksforGeeks · Code360 · GitHub
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-muted border border-white/10 hover:bg-white/5 hover:text-text-primary transition-colors disabled:opacity-50"
          aria-label="Refresh stats"
        >
          <RefreshIcon spinning={refreshing} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {loading && <Skeleton />}
      {!loading && error && (
        <div role="status" className="flex items-center justify-center py-10 text-text-muted text-sm">
          Stats temporarily unavailable
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Combined hero strip */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-6 gap-x-2 mb-8 pb-8 border-b border-white/10">
            <HeroStat value={dsa?.totalQuestions ?? 0} label="Problems Solved" accent="drop-shadow-[0_0_12px_rgba(232,116,60,0.4)]" />
            <HeroStat value={dsa?.contests ?? 0} label="Contests" accent="drop-shadow-[0_0_12px_rgba(232,116,60,0.4)]" />
            <HeroStat value={dsa?.maxStreak ?? 0} label="Max Streak" accent="drop-shadow-[0_0_12px_rgba(232,116,60,0.4)]" />
            <HeroStat value={github?.totalContributions ?? 0} label="Contributions" accent="drop-shadow-[0_0_12px_rgba(52,211,153,0.35)]" />
            <HeroStat value={github?.publicRepos ?? 0} label="Repos" accent="drop-shadow-[0_0_12px_rgba(52,211,153,0.35)]" />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <TabButton active={tab === "dsa"} onClick={() => setTab("dsa")} accent="amber">
              Problem Solving
            </TabButton>
            <TabButton active={tab === "github"} onClick={() => setTab("github")} accent="emerald">
              GitHub
            </TabButton>
          </div>

          <AnimatePresence mode="wait">
            {tab === "dsa" && dsa && (
              <motion.div
                key="dsa"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <DifficultyBar easy={dsa.easy} medium={dsa.medium} hard={dsa.hard} />

                {dsa.platforms?.length > 0 && (
                  <div className="mt-5 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-1">
                    {dsa.platforms.map((p) => (
                      <PlatformRow key={p.key} p={p} />
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <ContributionHeatmap
                    calendar={dsa.submissionCalendar}
                    colors={DSA_COLORS}
                    unit="submissions"
                  />
                </div>
              </motion.div>
            )}

            {tab === "github" && github && (
              <motion.div
                key="github"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  {github.username && (
                    <a
                      href={`https://github.com/${github.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      @{github.username}
                    </a>
                  )}
                  <span className="text-text-muted">{github.commits} commits</span>
                  <span className="text-text-muted">{github.totalStars} stars</span>
                  <span className="text-text-muted">{github.followers} followers</span>
                  <span className="text-text-muted">{github.totalActiveDays} active days</span>
                </div>

                <div className="mt-6">
                  <ContributionHeatmap
                    calendar={github.calendar}
                    colors={GH_COLORS}
                    unit="contributions"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </GlassCard>
  );
}

function TabButton({ active, onClick, accent, children }) {
  const activeRing =
    accent === "emerald"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : "bg-amber-500/15 text-amber-300 border-amber-500/30";
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors " +
        (active ? activeRing : "border-white/10 text-text-muted hover:bg-white/5 hover:text-text-primary")
      }
    >
      {children}
    </button>
  );
}
