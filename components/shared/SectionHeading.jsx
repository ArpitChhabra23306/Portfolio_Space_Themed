"use client";

import RevealText from "@/components/shared/animations/RevealText";

/**
 * Section heading — centered eyebrow hint, <h2> with optional serif accent via
 * <em> children, and an optional subtitle. Matches the "Mission Log / Flight path"
 * treatment used across the site.
 *
 * @param {{
 *   children: React.ReactNode,   // the heading text (may include <em> accents)
 *   eyebrow?: string,            // small uppercase hint shown above, wrapped in [ ... ]
 *   subtitle?: string,           // small supporting line shown below
 *   align?: 'center'|'left',     // defaults to center
 * }} props
 */
export default function SectionHeading({ children, eyebrow, subtitle, align = "center" }) {
  const centered = align !== "left";
  return (
    <div
      className={
        "flex flex-col mb-12 md:mb-16 " +
        (centered ? "items-center text-center" : "items-start text-left")
      }
    >
      {eyebrow && (
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-text-muted/50 mb-4">
          [ {eyebrow} ]
        </p>
      )}
      <RevealText>
        <h2 className="text-h2 font-sans text-text-primary">{children}</h2>
      </RevealText>
      {subtitle && (
        <p
          className={
            "mt-4 text-sm text-text-muted/60 " + (centered ? "max-w-md mx-auto" : "max-w-md")
          }
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
