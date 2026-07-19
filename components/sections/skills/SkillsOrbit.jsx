"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Layout, Server, Database, Code, Cloud, Wrench, Move } from "lucide-react";

const SolarSystemCanvas = dynamic(() => import("./SolarSystemCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-accent-ember/60 animate-pulse" />
    </div>
  ),
});

const CATEGORY_ICONS = {
  Frontend: Layout,
  Backend: Server,
  Database: Database,
  Languages: Code,
  DevOps: Cloud,
  Tools: Wrench,
};

export default function SkillsOrbit({ categories, skills }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const activeSkills = skills.filter((s) => s.category === activeCategory);

  return (
    <div className="relative">
      {/* 3D Canvas — full bleed, extends beyond section padding */}
      <div className="relative w-[100vw] -ml-[50vw] left-[50%] h-[48vh] md:h-[56vh]">
        <SolarSystemCanvas activeCategory={activeCategory} skills={activeSkills} />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-2">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] || Code;
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border cursor-pointer ${
                isActive
                  ? "bg-accent-ember/15 border-accent-ember/40 text-accent-ember shadow-[0_0_20px_rgba(232,116,60,0.15)]"
                  : "bg-white/[0.03] border-white/[0.06] text-white/45 hover:text-white/70 hover:border-white/15 hover:bg-white/[0.05]"
              }`}
            >
              <Icon size={14} />
              {cat}
            </button>
          );
        })}
      </div>

      {/* Drag hint */}
      <p className="flex items-center justify-center gap-2 text-text-muted/25 text-[11px] mt-3 font-mono tracking-widest uppercase">
        <Move size={11} />
        Drag to explore
      </p>
    </div>
  );
}
