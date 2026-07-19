"use client";

import { MDXRemote } from "next-mdx-remote";

/**
 * Client component that renders serialized MDX content for the About section.
 * @param {{ mdxSource: object }} props
 */
export default function AboutContent({ mdxSource }) {
  return <MDXRemote {...mdxSource} />;
}
