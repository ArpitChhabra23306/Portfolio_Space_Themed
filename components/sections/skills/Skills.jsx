import { readJson } from "@/lib/content";
import Section from "@/components/shared/Section";
import Starfield from "@/components/shared/Starfield";
import SkillsOrbit from "./SkillsOrbit";

/**
 * Skills section — server component.
 * Loads skills.json at build time. Renders a 3D solar system
 * where each category is a sun and sub-skills orbit as planets.
 */
export default function Skills() {
  const { categories, skills } = readJson("skills.json");

  return (
    <Section id="skills" className="relative overflow-hidden py-16 md:py-20">
      <Starfield />

      {/* Section Header */}
      <div className="relative mb-3 md:mb-4 flex flex-col items-center text-center">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted/50 mb-4">
          [ Arsenal ]
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-white/90">
          Technology{" "}
          <span className="italic font-serif text-white/50 font-normal">orbit</span>
        </h2>
      </div>

      {/* Hidden plain-text list for SEO / ATS */}
      <ul className="sr-only" aria-label="All skills">
        {skills.map((skill) => (
          <li key={skill.name}>
            {skill.name} — {skill.category}
          </li>
        ))}
      </ul>

      <div className="relative">
        <SkillsOrbit categories={categories} skills={skills} />
      </div>
    </Section>
  );
}
