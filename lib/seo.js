import { CONTACT, ACTIVE_SOCIALS } from "@/lib/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.arpitchhabra.site";

/**
 * Builds JSON-LD Person structured data for the site owner.
 * Used in the root layout for global SEO. Sourced from lib/site.js so it
 * always matches the real, verified profile links shown in the UI.
 */
export function buildPersonLD() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arpit Chhabra",
    jobTitle: "Full-Stack Developer",
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "IIIT Una",
    },
    url: SITE_URL,
    email: CONTACT.email,
    sameAs: [...ACTIVE_SOCIALS.map((s) => s.href), `mailto:${CONTACT.email}`],
  };
}

/**
 * Builds JSON-LD CreativeWork structured data for a project.
 */
export function buildCreativeWorkLD(project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: project.liveUrl || `${SITE_URL}/projects/${project.slug}`,
    author: {
      "@type": "Person",
      name: "Arpit Chhabra",
    },
    ...(project.repoUrl && { codeRepository: project.repoUrl }),
    keywords: project.techStack?.join(", "),
  };
}

/**
 * Builds JSON-LD EducationalOccupationalCredential for a certification.
 */
export function buildCredentialLD(cert) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: cert.name,
    credentialCategory: "certification",
    recognizedBy: {
      "@type": "Organization",
      name: cert.issuer,
    },
    ...(cert.verifyUrl && { url: cert.verifyUrl }),
    ...(cert.credentialId && { identifier: cert.credentialId }),
    ...(cert.issueDate && { dateCreated: cert.issueDate }),
  };
}
