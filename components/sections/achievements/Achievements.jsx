import dynamic from "next/dynamic";
import { readJson } from "@/lib/content";
import Section from "@/components/shared/Section";
import SectionHeading from "@/components/shared/SectionHeading";
import Starfield from "@/components/shared/Starfield";
import FadeIn from "@/components/shared/animations/FadeIn";
import TrophyShelf from "./TrophyShelf";

const CodingStats = dynamic(() => import("./CodingStats"), { ssr: false });

/**
 * Achievements section — one unified live "Coding Activity" panel (DSA + GitHub)
 * plus a hackathon trophy shelf. Static/duplicated counter tiles were removed in
 * favour of the live, always-accurate stats.
 */
export default function Achievements() {
  const achievements = readJson("achievements.json");
  const hackathonAchievements = achievements.filter((a) => a.category === "Hackathon");

  return (
    <Section id="achievements" className="relative overflow-hidden">
      <Starfield />

      <div className="relative">
        <SectionHeading
          eyebrow="Track Record"
          subtitle="Live coding stats and hard-won ranks."
        >
          Achievements<em className="font-serif italic"> & Stats</em>
        </SectionHeading>

        <div className="flex flex-col gap-4">
          <FadeIn>
            <CodingStats />
          </FadeIn>

          <FadeIn>
            <TrophyShelf achievements={hackathonAchievements} />
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}
