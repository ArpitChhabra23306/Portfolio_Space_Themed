import { readJson } from "@/lib/content";
import { buildCredentialLD } from "@/lib/seo";
import Section from "@/components/shared/Section";
import SectionHeading from "@/components/shared/SectionHeading";
import FadeIn from "@/components/shared/animations/FadeIn";
import CertificationFlipCard from "./CertificationFlipCard";

/**
 * Certifications section — server component that loads certification data,
 * renders flip cards and JSON-LD structured data per cert.
 */
export default function Certifications() {
  const certifications = readJson("certifications.json");

  return (
    <Section id="certifications">
      <SectionHeading
        eyebrow="Credentials"
        subtitle="Verified skills and completed programs."
      >
        Certifications<em className="font-serif italic">.</em>
      </SectionHeading>

      {/* JSON-LD structured data for each certification */}
      {certifications.map((cert) => (
        <script
          key={`ld-${cert.credentialId}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildCredentialLD(cert)),
          }}
        />
      ))}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {certifications.map((cert, index) => (
          <FadeIn key={cert.credentialId} delay={index * 0.1}>
            <CertificationFlipCard cert={cert} />
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
