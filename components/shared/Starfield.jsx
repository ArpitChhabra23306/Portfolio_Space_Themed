import { cn } from "@/lib/utils";

// Tiled star layers built from small radial-gradient dots — subtle, so they
// read as a faint field rather than a dominant pattern. Stars only, no nebula.
const STAR_LAYER_1 =
  "radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.7), transparent)," +
  "radial-gradient(1px 1px at 130px 50px, rgba(255,255,255,0.6), transparent)," +
  "radial-gradient(1.2px 1.2px at 170px 120px, rgba(200,210,255,0.55), transparent)," +
  "radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent)," +
  "radial-gradient(1px 1px at 110px 190px, rgba(255,255,255,0.5), transparent)";

const STAR_LAYER_2 =
  "radial-gradient(1px 1px at 60px 20px, rgba(210,215,255,0.55), transparent)," +
  "radial-gradient(1.4px 1.4px at 250px 200px, rgba(255,235,215,0.55), transparent)," +
  "radial-gradient(1px 1px at 120px 240px, rgba(255,255,255,0.45), transparent)," +
  "radial-gradient(1px 1px at 300px 140px, rgba(255,255,255,0.5), transparent)";

/**
 * Section-scoped star field — a subtle, non-interactive backdrop of tiled stars.
 * Place it inside a `relative overflow-hidden` container; keep sibling content in
 * a `relative` wrapper so it renders above the stars.
 */
export default function Starfield({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: STAR_LAYER_1, backgroundSize: "260px 260px", opacity: 0.5 }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: STAR_LAYER_2, backgroundSize: "360px 360px", opacity: 0.4 }}
      />
    </div>
  );
}
