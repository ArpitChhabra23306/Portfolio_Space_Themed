import { getProjects } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.arpitchhabra.site";

export default async function sitemap() {
  const projects = await getProjects();

  const projectUrls = projects.map(({ frontmatter }) => ({
    url: `${SITE_URL}/projects/${frontmatter.slug}`,
    lastModified: new Date().toISOString(),
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date().toISOString(),
    },
    ...projectUrls,
  ];
}
