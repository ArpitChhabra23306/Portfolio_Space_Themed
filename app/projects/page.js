import { getProjects } from "@/lib/content";
import Section from "@/components/shared/Section";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/shared/GlassCard";
import Pill from "@/components/shared/Pill";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arpitchhabra.com";

export function generateMetadata() {
  return {
    title: "Projects — Arpit Chhabra",
    description:
      "Explore all projects by Arpit Chhabra — full-stack apps, tools, and experiments.",
    openGraph: {
      title: "Projects — Arpit Chhabra",
      description:
        "Explore all projects by Arpit Chhabra — full-stack apps, tools, and experiments.",
      url: `${SITE_URL}/projects`,
      type: "website",
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Projects — Arpit Chhabra",
      description:
        "Explore all projects by Arpit Chhabra — full-stack apps, tools, and experiments.",
      images: [`${SITE_URL}/og.png`],
    },
  };
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <Section id="projects-index">
        <SectionHeading>
          All <em className="font-serif italic">Projects</em>
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(({ frontmatter }) => (
            <Link
              key={frontmatter.slug}
              href={`/projects/${frontmatter.slug}`}
              className="block group"
            >
              <GlassCard className="p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-ember transition-colors">
                  {frontmatter.title}
                </h3>
                <p className="text-text-muted text-sm mb-4 flex-1">
                  {frontmatter.summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {frontmatter.techStack?.slice(0, 4).map((tech) => (
                    <Pill key={tech} variant="glass">
                      {tech}
                    </Pill>
                  ))}
                  {frontmatter.techStack?.length > 4 && (
                    <Pill variant="glass">+{frontmatter.techStack.length - 4}</Pill>
                  )}
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
