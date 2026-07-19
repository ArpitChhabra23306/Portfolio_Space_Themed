import { cn } from "@/lib/utils";

const variants = {
  nav: "px-4 py-1.5 text-sm text-text-primary hover:bg-white/10 transition-colors",
  cta: "px-5 py-2 text-sm font-medium text-text-primary hover:shadow-[0_0_30px_-10px_rgba(232,116,60,0.4)] transition-shadow",
  chip: "px-3 py-1 text-xs text-text-muted",
  badge: "px-3 py-1 text-xs font-medium text-accent-ember",
};

/**
 * Glass pill for nav items, CTAs, chips, and badges.
 * @param {{ children: React.ReactNode, variant?: 'nav'|'cta'|'chip'|'badge', className?: string }} props
 */
export default function Pill({ children, variant = "chip", className, ...rest }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/5 border border-white/10",
        variants[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
