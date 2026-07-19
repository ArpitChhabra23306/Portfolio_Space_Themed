import { cn } from "@/lib/utils";

/**
 * Asymmetric CSS grid layout for bento-style sections.
 * @param {{ children: React.ReactNode, cols?: number, className?: string }} props
 */
export default function BentoGrid({ children, cols = 3, className }) {
  const colsMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid gap-4",
        colsMap[cols] || colsMap[3],
        className
      )}
    >
      {children}
    </div>
  );
}
