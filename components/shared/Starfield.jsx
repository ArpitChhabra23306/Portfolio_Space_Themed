import { cn } from "@/lib/utils";

// Tiled star layers built from small radial-gradient dots. Brighter + denser
// so they read clearly against the near-black background.
const STAR_LAYER_1 =
  "radial-gradient(1.4px 1.4px at 20px 30px, rgba(255,255,255,0.95), transparent)," +
  "radial-gradient(1.2px 1.2px at 70px 90px, rgba(255,255,255,0.8), transparent)," +
  "radial-gradient(1.6px 1.6px at 130px 50px, rgba(255,255,255,0.9), transparent)," +
  "radial-gradient(1.2px 1.2px at 170px 120px, rgba(200,210,255,0.85), transparent)," +
  "radial-gradient(1.3px 1.3px at 50px 160px, rgba(255,255,255,0.85), transparent)," +
  "radial-gradient(1.1px 1.1px at 110px 190px, rgba(255,255,255,0.7), transparent)";

const STAR_LAYER_2 =
  "radial-gradient(1.2px 1.2px at 60px 20px, rgba(210,215,255,0.85), transparent)," +
  "radial-gradient(1.8px 1.8px at 200px 90px, rgba(255,255,255,0.9), transparent)," +
  "radial-gradient(1.4px 1.4px at 250px 200px, rgba(255,235,215,0.9), transparent)," +
  "radial-gradient(1.2px 1.2px at 120px 240px, rgba(255,255,255,0.75), transparent)," +
  "radial-gradient(1.5px 1.5px at 300px 140px, rgba(255,255,255,0.85), transparent)";

// A few larger, glowing "beacon" stars.
const STAR_LAYER_3 =
  "radial-gradient(2.5px 2.5px at 90px 60px, rgba(255,255,255,1), transparent)," +
  "radial-gradient(2.2px 2.2px at 260px 180px, rgba(180,200,255,0.95), transparent)," +
  "radial-gradient(2.4px 2.4px at 380px 80px, rgba(255,220,200,0.95), transparent)";

/**
 * Space-themed decorative backdrop: soft nebula glows + tiled twinkling stars.
 * Purely decorative and non-interactive.
 */
export default function Starfield({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Nebula glows */}
      <div className="absolute -top-24 left-[12%] h-[36rem] w-[36rem] rounded-full bg-accent-violet/15 blur-[130px]" />
      <div className="absolute bottom-[-6rem] right-[8%] h-[30rem] w-[30rem] rounded-full bg-accent-ember/12 blur-[130px]" />

      {/* Star fields */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: STAR_LAYER_1, backgroundSize: "200px 200px", opacity: 0.9 }}
      />
      <div
        className="absolute inset-0 animate-pulse"
        style={{ backgroundImage: STAR_LAYER_2, backgroundSize: "300px 300px", opacity: 0.8 }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: STAR_LAYER_3, backgroundSize: "420px 420px", opacity: 0.9 }}
      />

      {/* Vignette to keep edges soft */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950/50" />
    </div>
  );
}
