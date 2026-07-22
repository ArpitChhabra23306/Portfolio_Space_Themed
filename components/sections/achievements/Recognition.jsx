import { Trophy, Users, BadgeCheck } from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";

const CATEGORY_META = {
  Hackathon: { icon: Trophy, color: "text-accent-ember", label: "Hackathons" },
  Leadership: { icon: Users, color: "text-sky-400", label: "Leadership" },
};

/**
 * Recognition — a single unified panel for Hackathons, Leadership roles, and
 * Certifications, replacing three separately-styled, visually inconsistent
 * blocks with one cohesive card and consistent row styling throughout.
 *
 * @param {{
 *   achievements: Array<{ title: string, category: string, metricLabel: string, description?: string, year: number }>,
 *   certifications: Array<{ name: string, issuer: string, issueDate: string|null, verifyUrl?: string }>,
 * }} props
 */
export default function Recognition({ achievements, certifications }) {
  const hasAchievements = achievements && achievements.length > 0;
  const hasCertifications = certifications && certifications.length > 0;

  if (!hasAchievements && !hasCertifications) return null;

  return (
    <GlassCard className="p-5 sm:p-8">
      <div className="flex flex-col gap-6">
        {hasAchievements && (
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-1">Recognition</h3>
            <p className="text-xs text-text-dim mb-5">Hackathons, leadership, and competitions</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {achievements.map((item) => {
                const meta = CATEGORY_META[item.category] || CATEGORY_META.Hackathon;
                const Icon = meta.icon;
                return (
                  <div
                    key={item.title}
                    className="group flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent-ember/30 hover:bg-white/[0.05] transition-colors p-4"
                  >
                    <Icon size={18} className={`mt-0.5 shrink-0 ${meta.color}`} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">{item.metricLabel}</p>
                      <p className="text-xs text-text-muted mt-0.5">{item.title}</p>
                      {item.description && (
                        <p className="text-[11px] text-text-dim mt-1 leading-snug">{item.description}</p>
                      )}
                      <p className="text-[11px] text-text-dim mt-1">{item.year}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {hasCertifications && (
          <div className={hasAchievements ? "pt-6 border-t border-white/5" : ""}>
            <h3 className="text-lg font-medium text-text-primary mb-1">Certifications</h3>
            <p className="text-xs text-text-dim mb-5">Verified skills and completed programs</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {certifications.map((cert) => {
                const formattedDate = cert.issueDate
                  ? new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                  : null;
                const body = (
                  <div className="group flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent-ember/30 hover:bg-white/[0.05] transition-colors p-4">
                    <BadgeCheck size={18} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">{cert.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">{cert.issuer}</p>
                      {formattedDate && <p className="text-[11px] text-text-dim mt-1">{formattedDate}</p>}
                    </div>
                  </div>
                );
                return cert.verifyUrl ? (
                  <a
                    key={cert.name}
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember rounded-xl"
                  >
                    {body}
                  </a>
                ) : (
                  <div key={cert.name}>{body}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
