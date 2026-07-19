import GlassCard from "@/components/shared/GlassCard";

/**
 * TrophyShelf — hackathon rank achievements as accent-bordered chips inside a
 * full-width glass card, styled to match the unified Coding Activity panel.
 *
 * @param {{ achievements: Array<{ title: string, metricLabel: string, year: number }> }} props
 */
export default function TrophyShelf({ achievements }) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <GlassCard className="p-5 sm:p-8">
      <h3 className="text-lg font-medium text-text-primary mb-1">Hackathons</h3>
      <p className="text-xs text-text-dim mb-5">Competition ranks & wins</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {achievements.map((item) => (
          <div
            key={item.title}
            className="group flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent-ember/30 hover:bg-white/[0.05] transition-colors p-4"
          >
            <span className="text-xl leading-none mt-0.5" aria-hidden="true">🏆</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">{item.metricLabel}</p>
              <p className="text-xs text-text-muted mt-0.5 truncate">{item.title}</p>
              <p className="text-[11px] text-text-dim mt-1">{item.year}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
