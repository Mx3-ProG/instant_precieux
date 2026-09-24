import type { GlobeInstance } from "globe.gl";

/** Couleurs du globe (dashboard et page « Où nous trouver ») selon le thème du site. */
export function globePalette(dark: boolean) {
  return {
    accent: dark ? "#c9ad7c" : "#ad9362",
    cap: dark ? "rgba(91, 73, 56, 0.72)" : "rgba(193, 166, 119, 0.58)",
    side: dark ? "rgba(41, 31, 24, 0.72)" : "rgba(92, 71, 48, 0.46)",
    stroke: dark ? "rgba(244, 231, 207, 0.62)" : "rgba(255, 249, 237, 0.86)",
  };
}

/** Sphère brun profond, légèrement translucide, et halo doré. */
export function styleGlobeSurface(globe: GlobeInstance, dark: boolean) {
  const material = globe.globeMaterial() as unknown as {
    color: { set: (color: string) => void };
    emissive: { set: (color: string) => void };
    emissiveIntensity: number;
    opacity: number;
    transparent: boolean;
    shininess?: number;
  };
  material.color.set(dark ? "#171310" : "#3a3029");
  material.emissive.set(dark ? "#120e0b" : "#1d1712");
  material.emissiveIntensity = dark ? 0.34 : 0.22;
  material.opacity = dark ? 0.96 : 0.94;
  material.transparent = true;
  if (typeof material.shininess === "number") material.shininess = 12;
  globe.atmosphereColor(globePalette(dark).accent);
}
