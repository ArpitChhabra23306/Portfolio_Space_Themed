import { cn } from "@/lib/utils";

/**
 * Section wrapper with consistent vertical padding and centered max-width.
 * @param {{ id: string, children: React.ReactNode, className?: string }} props
 */
export default function Section({ id, children, className }) {
  return (
    <section
      id={id}
      className={cn("py-24 md:py-32 max-w-7xl mx-auto px-6", className)}
    >
      {children}
    </section>
  );
}
