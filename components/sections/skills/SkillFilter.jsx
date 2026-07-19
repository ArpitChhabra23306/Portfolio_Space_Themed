"use client";

import { cn } from "@/lib/utils";

/**
 * Free-text filter input for skills — case-insensitive substring match.
 * @param {{ value: string, onChange: (val: string) => void }} props
 */
export default function SkillFilter({ value, onChange }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Filter skills..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter skills"
        className={cn(
          "w-full max-w-xs rounded-full px-4 py-2 text-sm",
          "bg-white/5 border border-white/10 text-text-primary placeholder:text-text-dim",
          "focus:outline-none focus:ring-2 focus:ring-accent-ember/50 focus:border-accent-ember/30",
          "transition-colors"
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear filter"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}
