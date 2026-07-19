"use client";

import dynamic from "next/dynamic";
import { useRef, useEffect } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Code2,
  ChefHat,
  Orbit,
  Mail,
  Phone,
  Download,
  ExternalLink,
} from "lucide-react";
import RevealText from "@/components/shared/animations/RevealText";
import RoleSwitcher from "./RoleSwitcher";
import ScrollCue from "./ScrollCue";
import { ease, dur } from "@/lib/motion";
import { CONTACT, ACTIVE_SOCIALS } from "@/lib/site";

const GlobeScene = dynamic(() => import("./GlobeScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-ink-950" aria-hidden="true" />
  ),
});

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  leetcode: Code2,
  codechef: ChefHat,
  codolio: Orbit,
};

const SOCIAL_LINKS = ACTIVE_SOCIALS.map((s) => ({
  href: s.href,
  label: s.label,
  icon: SOCIAL_ICONS[s.key] || ExternalLink,
}));

const ROLES = [
  "Full-Stack Developer",
  "MERN Engineer",
  "Open-Source Contributor",
  "Competitive Programmer",
];

// Staggered entrance variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: dur.base, ease },
  },
};

const nameVariants = {
  hidden: { opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: dur.slow, ease },
  },
};

const socialsContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.5 },
  },
};

const socialItemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: dur.quick, ease },
  },
};

/**
 * Hero section — cinematic 3D globe on the LEFT, text content on the RIGHT.
 * Globe starts small and slowly revolving, grows and spins faster on scroll.
 * Content fades out as user scrolls down.
 */
export default function Hero() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef(null);
  const scrollProgressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Content fades out as user scrolls through hero
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

  // Update the ref for Three.js (avoids re-renders)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      scrollProgressRef.current = v;
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const HeroContent = (
    <motion.div
      className="relative z-10 w-full h-full"
      style={{
        opacity: contentOpacity,
        y: contentY,
      }}
    >
      {/* Split layout — container takes full width, content pushed closer to right edge */}
      <div className="flex items-center justify-end min-h-[100svh] px-6 md:px-16 lg:pr-16 xl:pr-[5vw]">
        <motion.div
          className="flex flex-col items-start text-left w-full max-w-[500px] xl:max-w-[600px]"
          variants={prefersReduced ? undefined : containerVariants}
          initial={prefersReduced ? undefined : "hidden"}
          animate={prefersReduced ? undefined : "visible"}
        >
          {/* Owner's name — Premium typography, ultra-tight leading, subtle gradient */}
          <motion.h1
            className="font-sans font-bold text-[4.5rem] leading-[0.85] tracking-[-0.04em] md:text-[6rem] lg:text-[7.5rem] bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 pb-2"
            variants={prefersReduced ? undefined : nameVariants}
          >
            <RevealText by="word">Arpit Chhabra</RevealText>
          </motion.h1>

          {/* Static tagline — larger, elegant serif */}
          <motion.p
            className="mt-6 text-xl md:text-3xl font-serif italic tracking-tight text-white/60"
            variants={prefersReduced ? undefined : itemVariants}
          >
            Building products that solve real problems.
          </motion.p>

          {/* Typed role switcher */}
          <motion.div
            className="mt-4 h-10 flex items-center text-lg md:text-xl font-mono text-accent-ember/90"
            variants={prefersReduced ? undefined : itemVariants}
          >
            <RoleSwitcher />
          </motion.div>

          {/* Visually hidden full role list for ATS */}
          <span className="sr-only">{ROLES.join(", ")}</span>

          {/* CTA button */}
          <motion.div
            className="mt-10"
            variants={prefersReduced ? undefined : itemVariants}
          >
            <a
              href="/resume/Arpit-Chhabra-Resume.pdf"
              download="Arpit-Chhabra-Resume.pdf"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium
                         bg-white/[0.07] backdrop-blur-sm border border-white/[0.12] text-text-primary
                         hover:bg-white/[0.12] hover:border-white/20
                         hover:shadow-[0_0_50px_-12px_rgba(232,116,60,0.4)]
                         focus-visible:ring-2 focus-visible:ring-accent-ember
                         transition-all duration-300"
            >
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              Download CV
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            className="mt-8 flex items-center gap-3"
            variants={prefersReduced ? undefined : socialsContainerVariants}
          >
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <motion.a
                key={label}
                href={href}
                rel="me noopener"
                target="_blank"
                aria-label={label}
                className="p-2.5 rounded-full text-text-muted/80
                           border border-white/[0.06] bg-white/[0.03]
                           hover:text-text-primary hover:bg-white/[0.1] hover:border-white/[0.15]
                           focus-visible:ring-2 focus-visible:ring-accent-ember
                           transition-all duration-200"
                variants={prefersReduced ? undefined : socialItemVariants}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>

          {/* Direct contact — email + phone, visible up front */}
          <motion.div
            className="mt-6 flex flex-col sm:flex-row sm:items-center gap-x-5 gap-y-2 text-sm"
            variants={prefersReduced ? undefined : itemVariants}
          >
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-2 text-text-muted hover:text-accent-ember transition-colors"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              {CONTACT.email}
            </a>
            {CONTACT.phone && (
              <a
                href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 text-text-muted hover:text-accent-ember transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {CONTACT.phone}
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[110vh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* 3D Globe — positioned to the left via the scene's group position */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <GlobeScene scrollProgress={scrollProgressRef} />
      </div>

      {/* Subtle radial glow behind the globe so its dark edges are visible */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
      >
        {/* Radial glow positioned behind globe area */}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            left: "15%",
            width: "40vw",
            height: "40vw",
            maxWidth: "600px",
            maxHeight: "600px",
            background: "radial-gradient(circle, rgba(25,35,60,0.5) 0%, rgba(8,8,12,0) 70%)",
            transform: "translate(-50%, -50%)",
            top: "50%",
          }}
        />
        {/* Bottom fade — smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 w-full">
        {HeroContent}
      </div>

      {/* Scroll cue at bottom */}
      <ScrollCue />
    </section>
  );
}
