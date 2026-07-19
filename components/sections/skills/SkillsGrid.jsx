"use client";

import { useState } from "react";
import BentoGrid from "@/components/shared/BentoGrid";
import CategoryTabs from "./CategoryTabs";
import SkillFilter from "./SkillFilter";
import SkillTile from "./SkillTile";

/**
 * Client component managing category tabs, text filter, and skill grid rendering.
 * @param {{ categories: string[], skills: Array }} props
 */
export default function SkillsGrid({ categories, skills }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filter, setFilter] = useState("");

  const filtered = skills.filter((skill) => {
    const matchesCategory =
      activeCategory === "All" || skill.category === activeCategory;
    const matchesFilter =
      !filter || skill.name.toLowerCase().includes(filter.toLowerCase());
    return matchesCategory && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header row: tabs + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <CategoryTabs
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />
        <SkillFilter value={filter} onChange={setFilter} />
      </div>

      {/* Skills bento grid */}
      <BentoGrid cols={4}>
        {filtered.map((skill) => (
          <SkillTile key={skill.name} skill={skill} />
        ))}
      </BentoGrid>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-8">
          No skills match your filter.
        </p>
      )}
    </div>
  );
}
