"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 600);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "instant" : "smooth",
    });
  }

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full
        bg-white/5 backdrop-blur-xl border border-white/10
        shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
        hover:shadow-[0_0_40px_-12px_rgba(232,116,60,0.4)]
        text-text-muted hover:text-text-primary
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember
        transition-all duration-300 cursor-pointer"
    >
      <ChevronUp size={20} />
    </button>
  );
}
