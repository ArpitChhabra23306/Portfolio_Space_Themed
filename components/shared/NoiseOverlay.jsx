import { useId } from "react";

/**
 * Film-grain SVG noise overlay.
 * Renders at low opacity, pointer-events-none, absolute positioned.
 */
export default function NoiseOverlay() {
  const id = useId();
  const filterId = `noise-${id}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]"
      aria-hidden="true"
    >
      <svg className="w-full h-full opacity-[0.04]">
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.80"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>
    </div>
  );
}
