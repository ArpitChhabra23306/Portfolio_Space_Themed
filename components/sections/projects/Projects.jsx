import Section from "@/components/shared/Section";
import { getProjects } from "@/lib/content";
import ProjectsShowcase from "./ProjectsShowcase";

/**
 * Projects section — async server component.
 * Loads pinned projects sorted by order.
 * Renders tabbed split view: physics playground + project details.
 */
export default async function Projects() {
  const allProjects = await getProjects();

  // Pinned projects sorted by order — extract only serializable frontmatter
  const pinnedProjects = allProjects
    .filter((p) => p.frontmatter.pinned)
    .slice(0, 7)
    .map((p) => ({ frontmatter: p.frontmatter }));

  return (
    <Section id="projects">
      {/* Section Header */}
      <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted/50 mb-4">
          [ Missions ]
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-white/90">
          Projects.{" "}
          <span className="italic font-serif text-white/50 font-normal">Built to ship.</span>
        </h2>
      </div>

      {/* Hidden plain-text list for SEO / ATS */}
      <ul className="sr-only" aria-label="All projects">
        {pinnedProjects.map((p) => (
          <li key={p.frontmatter.slug}>
            {p.frontmatter.title} — {(p.frontmatter.techStack || []).join(", ")}
          </li>
        ))}
      </ul>

      <ProjectsShowcase projects={pinnedProjects} />
    </Section>
  );
}
