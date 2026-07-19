const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arpitchhabra.com";

/**
 * Builds JSON-LD Person structured data for the site owner.
 * Used in the root layout for global SEO.
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
    sameAs: [
      "https://github.com/arpitchhabra",
      "https://linkedin.com/in/arpitchhabra",
      "mailto:arpit@arpitchhabra.com",
    ],
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
