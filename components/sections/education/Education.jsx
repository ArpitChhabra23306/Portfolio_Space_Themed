import { readJson } from "@/lib/content";
import Section from "@/components/shared/Section";
import SectionHeading from "@/components/shared/SectionHeading";
import FadeIn from "@/components/shared/animations/FadeIn";
import EducationCard from "./EducationCard";

/**
 * Education section — server component. Loads education data and renders
 * clean glass cards in a responsive grid.
 */
export default function Education() {
  const educationData = readJson("education.json");

  return (
    <Section id="education">
      <SectionHeading
        eyebrow="Foundations"
        subtitle="Where the fundamentals took root."
      >
        Education<em className="font-serif italic">.</em>
      </SectionHeading>

      <div className="grid gap-6 md:grid-cols-2">
        {educationData.map((edu, index) => (
          <FadeIn key={edu.degree} delay={index * 0.1}>
            <EducationCard education={edu} />
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
