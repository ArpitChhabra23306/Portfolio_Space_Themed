import GlassCard from "@/components/shared/GlassCard";
import { GraduationCap } from "lucide-react";

/**
 * Formats a date string to "MMM YYYY" or handles null/expected dates.
 */
function formatDate(dateStr, expected) {
  if (!dateStr && expected) {
    return { display: `Expected ${expected}`, datetime: `${expected}` };
  }
  if (!dateStr) {
    return { display: "Present", datetime: new Date().toISOString().slice(0, 7) };
  }
  const date = new Date(dateStr);
  const display = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const datetime = dateStr.slice(0, 7);
  return { display, datetime };
}

/** Static CGPA ring gauge (out of 10). */
function CgpaRing({ value }) {
  const pct = Math.max(0, Math.min(1, value / 10));
  const c = 2 * Math.PI * 26;
  return (
    <div className="relative h-[68px] w-[68px] flex-shrink-0">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="4" />
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          stroke="#E8743C"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - pct * c}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-base font-bold text-white/90 leading-none">{value}</span>
        <span className="text-[8px] text-text-dim mt-0.5 tracking-wider">CGPA</span>
      </div>
    </div>
  );
}

/**
 * Education card — clean glass card with degree, institution, dates, CGPA ring, coursework.
 */
export default function EducationCard({ education }) {
  const { degree, institution, location, startDate, endDate, expected, cgpa, coursework } = education;
  const isCurrent = !endDate;

  const start = formatDate(startDate);
  const end = formatDate(endDate, expected);

  return (
    <GlassCard className="h-full p-6 md:p-8">
      <div className="flex h-full flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-ember/10 border border-accent-ember/20 text-accent-ember">
              <GraduationCap className="h-4.5 w-4.5" size={18} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary leading-snug">{degree}</h3>
            <p className="text-text-muted text-sm mt-0.5">{institution}</p>
            <p className="text-text-dim text-xs mt-0.5">{location}</p>
          </div>

          {cgpa != null && <CgpaRing value={cgpa} />}
        </div>

        {/* Dates + status */}
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs tracking-wide text-accent-ember/70">
            <time dateTime={start.datetime}>{start.display}</time>
            {" — "}
            <time dateTime={end.datetime}>{end.display}</time>
          </p>
          {isCurrent && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-medium text-green-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              Ongoing
            </span>
          )}
        </div>

        {/* Coursework */}
        {coursework && coursework.length > 0 && (
          <div className="mt-auto">
            <h4 className="text-[10px] font-mono font-medium text-text-dim uppercase tracking-[0.2em] mb-2.5">
              Coursework
            </h4>
            <ul className="flex flex-wrap gap-2" aria-label="Coursework">
              {coursework.map((course) => (
                <li
                  key={course}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-white/[0.03] border border-white/[0.08] text-white/50"
                >
                  {course}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
