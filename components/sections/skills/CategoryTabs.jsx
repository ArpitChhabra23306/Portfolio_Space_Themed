"use client";

import { cn } from "@/lib/utils";
import Pill from "@/components/shared/Pill";

/**
 * Tab buttons for skill categories with an "All" option.
 * @param {{ categories: string[], active: string, onChange: (cat: string) => void }} props
 */
export default function CategoryTabs({ categories, active, onChange }) {
  const all = ["All", ...categories];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Skill categories">
      {all.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          onClick={() => onChange(cat)}
          className={cn(
            "inline-flex items-center rounded-full px-4 py-1.5 text-sm border transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember",
            active === cat
              ? "bg-accent-ember/20 border-accent-ember/50 text-text-primary"
              : "bg-white/5 border-white/10 text-text-muted hover:bg-white/10 hover:text-text-primary"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
