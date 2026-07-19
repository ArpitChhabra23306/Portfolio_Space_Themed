"use client";

/**
 * Fixed-position "Available for hire" pill with pulsing green dot.
 * Visible across all sections when openToWork is true.
 * Links to #contact section.
 */
export default function AvailableForHirePill() {
  return (
    <a
      href="#contact"
      role="status"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2
                 rounded-full bg-white/5 backdrop-blur-xl border border-white/10
                 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                 text-text-primary text-sm font-medium
                 hover:bg-white/10 transition-colors"
    >
      {/* Pulsing green dot */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
      </span>
      Available for hire
    </a>
  );
}
