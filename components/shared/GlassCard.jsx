import { cn } from "@/lib/utils";
import NoiseOverlay from "./NoiseOverlay";

/**
 * Glass surface with noise overlay and optional hover glow.
 * @param {{ children: React.ReactNode, className?: string, hover?: boolean }} props
 */
export default function GlassCard({ children, className, hover = true }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]",
        hover &&
          "hover:shadow-[0_0_60px_-20px_rgba(232,116,60,0.35)] transition-shadow",
        className
      )}
    >
      <NoiseOverlay />
      <div className="relative">{children}</div>
    </div>
  );
}
