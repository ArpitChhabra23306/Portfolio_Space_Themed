import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/content";
import { buildCreativeWorkLD } from "@/lib/seo";
import { MDXRemote } from "next-mdx-remote/rsc";
import Section from "@/components/shared/Section";
import Pill from "@/components/shared/Pill";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.arpitchhabra.site";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ frontmatter }) => ({ slug: frontmatter.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  const { frontmatter } = project;
  const title =
    frontmatter.title.length > 47
      ? `${frontmatter.title.slice(0, 47)}… — Arpit`
      : `${frontmatter.title} — Arpit Chhabra`;
  const description =
    frontmatter.summary.length > 160
      ? frontmatter.summary.slice(0, 157) + "..."
      : frontmatter.summary;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/projects/${frontmatter.slug}`,
      type: "article",
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og.png`],
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { frontmatter, rawContent } = project;
  const creativeWorkLD = buildCreativeWorkLD(frontmatter);

  return (
    <main>
      <script
        id={`ld-project-${frontmatter.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLD) }}
      />

      <Section id="project-detail">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-h2 font-sans text-text-primary mb-4">
            {frontmatter.title}
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mb-6">
            {frontmatter.summary}
          </p>

          {/* Tech stack pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {frontmatter.techStack?.map((tech) => (
              <Pill key={tech} variant="glass">
                {tech}
              </Pill>
            ))}
          </div>

          {/* External links */}
          <div className="flex gap-4">
            {frontmatter.liveUrl && (
              <a
                href={frontmatter.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-ember hover:underline text-sm font-medium"
              >
                Live Demo →
              </a>
            )}
            {frontmatter.repoUrl && (
              <a
                href={frontmatter.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary hover:underline text-sm font-medium transition-colors"
              >
                Source Code →
              </a>
            )}
          </div>
        </header>

        {/* Problem / Solution / Impact */}
        {(frontmatter.problem || frontmatter.solution || frontmatter.impact) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {frontmatter.problem && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <h2 className="text-sm font-semibold text-accent-ember uppercase tracking-wider mb-2">
                  Problem
                </h2>
                <p className="text-text-muted text-sm">{frontmatter.problem}</p>
              </div>
            )}
            {frontmatter.solution && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <h2 className="text-sm font-semibold text-accent-violet uppercase tracking-wider mb-2">
                  Solution
                </h2>
                <p className="text-text-muted text-sm">{frontmatter.solution}</p>
              </div>
            )}
            {frontmatter.impact && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <h2 className="text-sm font-semibold text-accent-silver uppercase tracking-wider mb-2">
                  Impact
                </h2>
                <p className="text-text-muted text-sm">{frontmatter.impact}</p>
              </div>
            )}
          </div>
        )}

        {/* MDX Body */}
        <article className="prose prose-invert prose-lg max-w-none prose-headings:font-sans prose-headings:text-text-primary prose-p:text-text-muted prose-a:text-accent-ember prose-strong:text-text-primary">
          <MDXRemote source={rawContent} />
        </article>
      </Section>
    </main>
  );
}
