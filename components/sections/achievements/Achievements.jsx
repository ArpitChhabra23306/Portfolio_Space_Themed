import dynamic from "next/dynamic";
import { readJson } from "@/lib/content";
import { buildCredentialLD } from "@/lib/seo";
import Section from "@/components/shared/Section";
import SectionHeading from "@/components/shared/SectionHeading";
import FadeIn from "@/components/shared/animations/FadeIn";
import Recognition from "./Recognition";

const CodingStats = dynamic(() => import("./CodingStats"), { ssr: false });

/**
 * Achievements section — one unified live "Coding Activity" panel (DSA + GitHub)
 * plus a single "Recognition" panel merging Hackathons, Leadership roles, and
 * Certifications, so related credibility signals live together instead of
 * being split across visually inconsistent blocks.
 */
export default function Achievements() {
  const achievements = readJson("achievements.json");
  const certifications = readJson("certifications.json");

  return (
    <Section id="achievements">
      <SectionHeading
        eyebrow="Track Record"
        subtitle="Live coding stats and hard-won recognition."
      >
        Achievements<em className="font-serif italic"> & Stats</em>
      </SectionHeading>

      {/* JSON-LD structured data for each certification */}
      {certifications.map((cert, i) => (
        <script
          key={`ld-cert-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildCredentialLD(cert)),
          }}
        />
      ))}

      <div className="flex flex-col gap-4">
        <FadeIn>
          <CodingStats />
        </FadeIn>

        <FadeIn>
          <Recognition achievements={achievements} certifications={certifications} />
        </FadeIn>
      </div>
    </Section>
  );
}
