import Hero from "@/components/sections/hero/Hero";
import About from "@/components/sections/about/About";
import Skills from "@/components/sections/skills/Skills";
import Projects from "@/components/sections/projects/Projects";
import Experience from "@/components/sections/experience/Experience";
import Education from "@/components/sections/education/Education";
import Achievements from "@/components/sections/achievements/Achievements";
import Certifications from "@/components/sections/certifications/Certifications";
import Resume from "@/components/sections/resume/Resume";
import Contact from "@/components/sections/contact/Contact";
import Stagger from "@/components/shared/animations/Stagger";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arpitchhabra.com";

export function generateMetadata() {
  const title = "Arpit Chhabra — Full-Stack Developer";
  const description =
    "Portfolio of Arpit Chhabra. Full-stack developer, IIIT Una, specializing in MERN, real-time systems, and AI.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      type: "website",
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og.png`],
    },
  };
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Stagger stagger={0.12}>
        <About />
        <Skills />
        <Projects />
      </Stagger>
      <Experience />
      <Stagger stagger={0.12}>
        <Education />
        <Achievements />
        <Certifications />
        <Resume />
        <Contact />
      </Stagger>
    </main>
  );
}
