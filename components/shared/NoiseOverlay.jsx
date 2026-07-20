/**
 * Film-grain noise overlay.
 *
 * The grain is baked once into a static, tiled SVG data-URI used as a CSS
 * background-image. The browser rasterizes and caches this single texture and
 * reuses it across every card — unlike a live inline <feTurbulence> filter,
 * which the browser re-computes per element and re-rasterizes on repaint
 * (a major scroll-jank source when many cards are on screen).
 *
 * Visually identical to the previous per-card filter, at a fraction of the cost.
 */
const NOISE_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] opacity-[0.04]"
      aria-hidden="true"
      style={{
        backgroundImage: `url("${NOISE_URI}")`,
        backgroundSize: "160px 160px",
      }}
    />
  );
}
