import Hero from "@/components/sections/hero/Hero";
import About from "@/components/sections/about/About";
import Skills from "@/components/sections/skills/Skills";
import Projects from "@/components/sections/projects/Projects";
import Experience from "@/components/sections/experience/Experience";
import Education from "@/components/sections/education/Education";
import Achievements from "@/components/sections/achievements/Achievements";
import Resume from "@/components/sections/resume/Resume";
import Contact from "@/components/sections/contact/Contact";
import Stagger from "@/components/shared/animations/Stagger";

// Title/description/OG image are inherited from the root layout's metadata
// (app/layout.js) and the auto-generated app/opengraph-image.js — no need to
// duplicate them here for the home page.

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
        <Resume />
        <Contact />
      </Stagger>
    </main>
  );
}
