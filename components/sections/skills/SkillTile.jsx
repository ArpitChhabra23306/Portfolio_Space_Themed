"use client";

import GlassCard from "@/components/shared/GlassCard";
import SkillRing from "./SkillRing";
import * as Tooltip from "@radix-ui/react-tooltip";

/**
 * Single skill tile — glass card with icon, name, proficiency text, and animated ring.
 * Tooltip on hover/focus shows name, proficiency, and years of experience.
 * @param {{ skill: { name: string, icon: string, proficiency: string, yearsOfExperience: number } }} props
 */
export default function SkillTile({ skill }) {
  const { name, proficiency, yearsOfExperience } = skill;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember rounded-2xl">
            <GlassCard className="p-4 h-full">
              <div className="flex items-start gap-3">
                <SkillRing proficiency={proficiency} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {name}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {proficiency}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={8}
            className="z-50 rounded-lg bg-ink-800 border border-white/10 px-3 py-2 text-xs text-text-primary shadow-lg backdrop-blur-md"
          >
            <p className="font-medium">{name}</p>
            <p className="text-text-muted">
              {proficiency} · {yearsOfExperience} {yearsOfExperience === 1 ? "year" : "years"}
            </p>
            <Tooltip.Arrow className="fill-ink-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
