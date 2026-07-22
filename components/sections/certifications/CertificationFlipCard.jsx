"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { RotateCw, BadgeCheck, ExternalLink } from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";

/**
 * CSS 3D flip card for certifications.
 * Both faces stay in the DOM so ATS/screen readers can read all content; the
 * visual flip uses backface-visibility on each face. Flip toggles on click or
 * keyboard (Enter/Space); aria-pressed reflects state.
 */
export default function CertificationFlipCard({ cert }) {
  const [flipped, setFlipped] = useState(false);

  const toggle = useCallback(() => setFlipped((p) => !p), []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  const formattedDate = cert.issueDate
    ? new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;

  const expirationDate = cert.expirationDate
    ? new Date(cert.expirationDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "No expiration";

  const issuerInitial = cert.issuer?.trim()?.charAt(0)?.toUpperCase() || "•";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${cert.name} certification card. Activate to ${flipped ? "see the front" : "see details"}.`}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      className="group relative h-64 cursor-pointer rounded-2xl focus-visible:ring-2 focus-visible:ring-accent-ember focus-visible:outline-none"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front face */}
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
          <GlassCard className="h-full p-6 flex flex-col items-center justify-center gap-4 transition-colors group-hover:border-accent-ember/25">
            {/* Flip affordance */}
            <span className="absolute top-3 right-3 text-text-dim/60 group-hover:text-accent-ember transition-colors">
              <RotateCw size={14} aria-hidden="true" />
            </span>

            {/* Logo with initial fallback */}
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10">
              {cert.issuerLogo ? (
                <Image
                  src={cert.issuerLogo}
                  alt={`${cert.issuer} logo`}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <span className="font-mono text-lg text-text-muted">{issuerInitial}</span>
              )}
            </div>

            <h3 className="text-text-primary text-center font-sans text-sm font-medium leading-snug px-2">
              {cert.name}
            </h3>
            <p className="text-text-muted text-xs">{cert.issuer}</p>
            {formattedDate && <p className="text-text-dim text-[11px]">{formattedDate}</p>}

            <span className="absolute bottom-3 text-[10px] uppercase tracking-[0.2em] text-text-dim/50">
              Tap for details
            </span>
          </GlassCard>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <GlassCard className="h-full p-6 flex flex-col justify-center gap-3">
            <div className="flex items-center gap-2 text-accent-ember">
              <BadgeCheck size={16} aria-hidden="true" />
              <h3 className="text-text-primary font-sans text-sm font-medium leading-snug">
                {cert.name}
              </h3>
            </div>

            <dl className="text-xs text-text-muted space-y-1.5">
              <div className="flex justify-between gap-3">
                <dt className="text-text-dim">Issuer</dt>
                <dd className="text-right">{cert.issuer}</dd>
              </div>
              {cert.credentialId && (
                <div className="flex justify-between gap-3">
                  <dt className="text-text-dim">Credential ID</dt>
                  <dd className="font-mono text-[11px] text-right truncate max-w-[60%]">{cert.credentialId}</dd>
                </div>
              )}
              {formattedDate && (
                <div className="flex justify-between gap-3">
                  <dt className="text-text-dim">Issued</dt>
                  <dd>{formattedDate}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-text-dim">Expires</dt>
                <dd>{expirationDate}</dd>
              </div>
            </dl>

            {cert.verifyUrl && (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-1 inline-flex items-center gap-1.5 text-xs text-accent-ember hover:text-accent-ember/80 transition-colors font-medium"
              >
                Verify credential
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
