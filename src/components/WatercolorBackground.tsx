import { useId } from "react";

type WatercolorBackgroundProps = {
  seed?: string | number;
  className?: string;
};

function numericSeed(seed: string | number) {
  if (typeof seed === "number") return Math.abs(Math.round(seed)) || 1;

  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return (hash % 997) + 1;
}

export default function WatercolorBackground({ seed = 1, className = "" }: WatercolorBackgroundProps) {
  const reactId = useId().replace(/:/g, "");
  const filterId = `watercolor-filter-${reactId}`;
  const gradientId = `watercolor-gradient-${reactId}`;
  const value = numericSeed(seed);

  return (
    <svg
      className={`watercolor-background ${className}`}
      viewBox="0 0 600 760"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--watercolor-base)" />
          <stop offset="0.48" stopColor="var(--watercolor-soft)" />
          <stop offset="1" stopColor="var(--watercolor-base)" />
        </linearGradient>
        <filter id={filterId} x="-14%" y="-14%" width="128%" height="128%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009 0.018"
            numOctaves="2"
            seed={value}
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" result="monochromeNoise" />
          <feDisplacementMap in="SourceGraphic" in2="monochromeNoise" scale="54" xChannelSelector="R" yChannelSelector="G" result="warped" />
          <feGaussianBlur in="warped" stdDeviation="8" result="soft" />
          <feComponentTransfer in="monochromeNoise" result="texture">
            <feFuncA type="linear" slope="0.1" />
          </feComponentTransfer>
          <feBlend in="soft" in2="texture" mode="soft-light" />
        </filter>
      </defs>

      <rect width="600" height="760" fill={`url(#${gradientId})`} />
      <g filter={`url(#${filterId})`} opacity="0.94">
        <ellipse cx="105" cy="130" rx="235" ry="215" fill="var(--watercolor-one)" />
        <ellipse cx="515" cy="310" rx="275" ry="245" fill="var(--watercolor-two)" />
        <ellipse cx="205" cy="675" rx="315" ry="260" fill="var(--watercolor-three)" />
      </g>
    </svg>
  );
}
