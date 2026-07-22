"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Intro", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Achievements", href: "#achievements" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

/**
 * Vertical sidebar navigation — left-aligned, vertically centered.
 * Features a scroll progress track with dots for each section,
 * active section highlighting, and story-like scroll-through feel.
 * Hidden on mobile — replaced with a floating hamburger.
 */
export default function Nav() {
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.href.slice(1));

    const handleIntersect = (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length > 0) {
        setActiveSection(visible[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Overall scroll progress for the vertical track — throttled to one update
  // per animation frame so we don't re-render on every scroll event.
  useEffect(() => {
    let rafId = null;
    function compute() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(progress, 1));
      rafId = null;
    }
    function handleScroll() {
      if (rafId != null) return;
      rafId = requestAnimationFrame(compute);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileOpen) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [mobileOpen]);

  const handleLinkClick = useCallback((e, href) => {
    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "instant" : "smooth",
      });
    }
    setMobileOpen(false);
  }, []);

  // Find active index for progress calculation
  const activeIndex = NAV_LINKS.findIndex(
    (link) => link.href.slice(1) === activeSection
  );

  return (
    <nav ref={navRef} aria-label="Primary" className="z-50">
      {/* ─── Desktop: Vertical sidebar, left-aligned, vertically centered ─── */}
      <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col items-start gap-0">
        {/* Origin label */}
        <div className="mb-4 pl-6">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted/50">
            [ Portfolio ]
          </p>
        </div>

        {/* Section links with vertical track */}
        <div className="relative flex flex-col">
          {/* Vertical track line — background */}
          <div
            className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-white/[0.06] z-0"
            aria-hidden="true"
          />

          {/* Vertical track line — progress fill */}
          <div
            className="absolute left-[5px] top-2 w-[1px] bg-gradient-to-b from-white/50 to-white/10 transition-all duration-100 ease-out z-0"
            style={{
              height: `${scrollProgress * 100}%`,
              maxHeight: "calc(100% - 16px)",
            }}
            aria-hidden="true"
          />

          {/* Nav items */}
          <ul className="relative flex flex-col gap-0 z-10">
            {NAV_LINKS.map((link, i) => {
              const isActive = activeSection === link.href.slice(1);
              const isPast = activeIndex >= 0 && i < activeIndex;

              // Calculate distance from active for 3D bulging effect
              const dist = activeIndex >= 0 ? Math.abs(i - activeIndex) : Math.abs(i);
              
              let scale = 1;
              let xOffset = 0;
              let opacityClass = "";
              
              if (dist === 0) {
                scale = 1.15;
                xOffset = 18;
                opacityClass = "text-text-primary";
              } else if (dist === 1) {
                scale = 1.05;
                xOffset = 10;
                opacityClass = "text-text-primary/70";
              } else if (dist === 2) {
                scale = 0.95;
                xOffset = 4;
                opacityClass = "text-text-muted/50";
              } else {
                scale = 0.85;
                xOffset = 0;
                opacityClass = "text-text-muted/30";
              }

              return (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    aria-current={isActive ? "location" : undefined}
                    className="group flex items-center gap-3 py-[6px] pr-4 focus-visible:outline-none"
                  >
                    {/* Dot on the track - Solid background to sit OVER the line */}
                    <span
                      className={cn(
                        "relative w-[11px] h-[11px] rounded-full border transition-all duration-500 ease-[cubic-bezier(0.17,0.67,0.22,1.2)] shrink-0 bg-ink-950",
                        isActive
                          ? "border-white/90 scale-[1.3] shadow-[0_0_12px_rgba(255,255,255,0.25)]"
                          : isPast
                          ? "border-white/40 scale-90"
                          : "border-white/20 scale-75"
                      )}
                      aria-hidden="true"
                    >
                      {/* Inner dot fill for active/past */}
                      <span className={cn(
                        "absolute inset-[2px] rounded-full transition-all duration-300",
                        isActive ? "bg-white" : isPast ? "bg-white/30" : "bg-transparent"
                      )} />
                      
                      {/* Active pulse ring */}
                      {isActive && (
                        <span className="absolute inset-[-4px] rounded-full border border-white/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                      )}
                    </span>

                    {/* Label with 3D bulge transform + section coordinate */}
                    <span
                      className={cn(
                        "font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-500 ease-[cubic-bezier(0.17,0.67,0.22,1.2)]",
                        opacityClass,
                        "group-hover:text-white"
                      )}
                      style={{
                        transform: `translate3d(${xOffset}px, 0, 0) scale(${scale})`,
                        transformOrigin: "left center"
                      }}
                    >
                      <span className="text-accent-ember/60 mr-2 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {link.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

      </div>

      {/* ─── Mobile: Floating hamburger button (bottom-left) ─── */}
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((prev) => !prev)}
        className={cn(
          "md:hidden fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full",
          "bg-white/[0.07] backdrop-blur-xl border border-white/10",
          "flex items-center justify-center",
          "text-text-primary hover:bg-white/[0.12]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember",
          "transition-all duration-200",
          mobileOpen && "bg-white/[0.15]"
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {mobileOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="15" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </>
          )}
        </svg>
      </button>

      {/* ─── Mobile: Full-screen overlay menu ─── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-2xl flex flex-col justify-center px-8">
          {/* Origin label */}
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted/50 mb-6">
            [ Portfolio ]
          </p>

          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "flex items-center gap-3 py-2 transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember rounded"
                    )}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0 transition-all",
                        isActive
                          ? "bg-white scale-125"
                          : "bg-white/20"
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "font-mono text-sm tracking-wider uppercase",
                        isActive ? "text-text-primary" : "text-text-muted/60"
                      )}
                    >
                      <span className="text-accent-ember/60 mr-2 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {link.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
