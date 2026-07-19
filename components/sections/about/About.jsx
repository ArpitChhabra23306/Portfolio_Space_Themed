import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Section from "@/components/shared/Section";
import { MDXRemote } from "next-mdx-remote/rsc";
import AboutClient from "./AboutClient";

/**
 * About section — server component.
 * Reads MDX and passes to Client Component for Bento Box animation.
 */
export default async function About() {
  const filePath = path.join(process.cwd(), "content", "about.mdx");
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(raw);

  return (
    <Section id="about">
      {/* Render MDX on the server and pass it as children (server→client pattern) */}
      <AboutClient data={frontmatter}>
        <MDXRemote source={content} />
      </AboutClient>
    </Section>
  );
}
