import { cn } from "@/lib/utils";

/**
 * Dashboard-style numeric display with optional ring indicator.
 * @param {{ value: string|number, label: string, ring?: number, className?: string }} props
 */
export default function KPI({ value, label, ring, className }) {
  const circumference = 2 * Math.PI * 36; // radius = 36
  const strokeDashoffset = ring != null
    ? circumference - (ring / 100) * circumference
    : circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      {ring != null && (
        <div className="relative w-20 h-20">
          {/* Background ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#E8743C"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          {/* Value inside ring */}
          <span className="absolute inset-0 flex items-center justify-center font-mono text-lg text-text-primary">
            {value}
          </span>
        </div>
      )}
      {ring == null && (
        <span className="font-mono text-3xl text-text-primary drop-shadow-[0_0_12px_rgba(232,116,60,0.4)]">
          {value}
        </span>
      )}
      <span className="text-sm text-text-muted">{label}</span>
    </div>
  );
}
