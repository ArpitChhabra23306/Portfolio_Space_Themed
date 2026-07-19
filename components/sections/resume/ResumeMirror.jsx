/**
 * ATS-friendly HTML mirror of resume content.
 * Semantic headings and lists for screen readers and crawlers.
 */
export default function ResumeMirror() {
  return (
    <section aria-label="Resume content" className="sr-only">
      <div>
        <h3 className="text-h3 font-sans mb-3">Summary</h3>
        <p className="text-text-muted leading-relaxed">
          Full-stack developer with hands-on experience building scalable web applications
          using the MERN stack, real-time systems, and AI integrations. Passionate about
          clean architecture, developer experience, and shipping fast.
        </p>
      </div>

      <div>
        <h3 className="text-h3 font-sans mb-3">Experience</h3>
        <ul className="list-disc list-inside space-y-2 text-text-muted">
          <li>Full Stack Intern at ModelSuite AI — Built production features with MERN stack and CI/CD pipelines</li>
          <li>Developed real-time collaboration features using Socket.io and Redis</li>
          <li>Implemented AI-powered moderation systems with Gemini API integration</li>
        </ul>
      </div>

      <div>
        <h3 className="text-h3 font-sans mb-3">Skills</h3>
        <ul className="list-disc list-inside space-y-2 text-text-muted">
          <li>Frontend: React, Next.js, Tailwind CSS, Framer Motion</li>
          <li>Backend: Node.js, Express, REST APIs, GraphQL</li>
          <li>Database: MongoDB, PostgreSQL, Redis</li>
          <li>DevOps: Docker, GitHub Actions, Vercel, AWS</li>
          <li>Languages: JavaScript, TypeScript, Python, C++</li>
        </ul>
      </div>

      <div>
        <h3 className="text-h3 font-sans mb-3">Education</h3>
        <ul className="list-disc list-inside space-y-2 text-text-muted">
          <li>B.Tech in Information Technology — IIIT Una (2023–2027)</li>
          <li>Relevant coursework: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks</li>
        </ul>
      </div>
    </section>
  );
}
