import { readJson } from "@/lib/content";
import Starfield from "@/components/shared/Starfield";
import ExperienceTimeline from "./ExperienceTimeline";

/**
 * Sort experience entries: null endDate (current) first, then by endDate desc.
 */
function sortExperience(entries) {
  return [...entries].sort((a, b) => {
    if (!a.endDate && !b.endDate)
      return new Date(b.startDate) - new Date(a.startDate);
    if (!a.endDate) return -1;
    if (!b.endDate) return 1;
    return new Date(b.endDate) - new Date(a.endDate);
  });
}

/**
 * Experience section — server component.
 * Reads content/experience.json → passes to the "Mission Log" orbital timeline,
 * which renders every role at once along a scroll-driven flight-path spine.
 */
export default function Experience() {
  const entries = readJson("experience.json");
  const sorted = sortExperience(entries);

  return (
    <section id="experience" className="relative overflow-hidden">
      <Starfield />

      {/* Hidden accessible list for SEO / screen readers */}
      <ul className="sr-only" aria-label="Work experience">
        {sorted.map((e) => (
          <li key={`${e.org}-${e.startDate}`}>
            {e.role} at {e.org} — {e.tags?.join(", ")}
          </li>
        ))}
      </ul>

      <div className="relative">
        <ExperienceTimeline entries={sorted} />
      </div>
    </section>
  );
}
