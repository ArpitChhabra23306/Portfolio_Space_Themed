import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

const contentDir = path.join(process.cwd(), "content");

/**
 * Reads and parses a JSON content file.
 * @param {string} filePath - Path relative to `content/` directory
 * @returns {object} Parsed JSON data
 */
export function readJson(filePath) {
  const fullPath = path.join(contentDir, filePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw);
}

/**
 * Reads and parses an MDX content file, extracting frontmatter and compiling the MDX body.
 * @param {string} filePath - Path relative to `content/` directory
 * @returns {Promise<{ frontmatter: object, mdxSource: object }>}
 */
export async function readMdx(filePath) {
  const fullPath = path.join(contentDir, filePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data: frontmatter, content } = matter(raw);
  const mdxSource = await serialize(content);
  return { frontmatter, mdxSource };
}

/**
 * Reads all project MDX files from `content/projects/` and returns them sorted by `order` ascending.
 * @returns {Promise<Array<{ frontmatter: object, mdxSource: object }>>}
 */
export async function getProjects() {
  const projectsDir = path.join(contentDir, "projects");

  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const files = fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".mdx"));

  const projects = await Promise.all(
    files.map(async (file) => {
      const { frontmatter, mdxSource } = await readMdx(`projects/${file}`);
      return { frontmatter, mdxSource };
    })
  );

  return projects.sort((a, b) => (a.frontmatter.order ?? 0) - (b.frontmatter.order ?? 0));
}

/**
 * Reads a single project MDX file by slug.
 * @param {string} slug - The project slug (filename without extension)
 * @returns {Promise<{ frontmatter: object, mdxSource: object, rawContent: string } | null>}
 */
export async function getProjectBySlug(slug) {
  const filePath = path.join(contentDir, "projects", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(raw);
  const mdxSource = await serialize(content);
  return { frontmatter, mdxSource, rawContent: content };
}
