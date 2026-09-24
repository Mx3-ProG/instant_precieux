import { useEffect, useRef, useState } from "react";
import type { GlobeInstance } from "globe.gl";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import atlasUrl from "world-atlas/countries-110m.json?url";
import { globePalette, styleGlobeSurface } from "@/lib/globeTheme";

type CountryFeature = Feature<Geometry, { name?: string }>;
type WorldTopology = Topology<{ countries: GeometryCollection<{ name?: string }> }>;

const FRANCE = { lat: 46.6, lng: 2.4 };
const METROPOLE = "France métropolitaine";
const isFrance = (country: object) => (country as CountryFeature).properties?.name === METROPOLE;

/** L’atlas regroupe la France et ses territoires d’outre-mer : seule la métropole (et la Corse) est illuminée. */
function splitFrance(countries: CountryFeature[]): CountryFeature[] {
  return countries.flatMap((country) => {
    if (country.properties?.name !== "France" || country.geometry.type !== "MultiPolygon") return [country];
    const inEurope = (polygon: number[][][]) => polygon[0].every(([lng, lat]) => lng > -6 && lng < 10 && lat > 41 && lat < 52);
    const polygons = country.geometry.coordinates as number[][][][];
    const part = (name: string, coordinates: number[][][][]): CountryFeature => ({ ...country, properties: { name }, geometry: { type: "MultiPolygon", coordinates } });
    return [part(METROPOLE, polygons.filter(inEurope)), part("France", polygons.filter((polygon) => !inEurope(polygon)))];
  });
}

/**
 * Globe de la page « Où nous trouver » : le même rendu que le dashboard,
 * avec la France illuminée en bleu et tous les autres pays dans leurs couleurs d’origine.
 */
export default function FranceGlobe({ label, caption }: { label: string; caption: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let globe: GlobeInstance | null = null;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const [{ default: Globe }, { feature }, atlasResponse] = await Promise.all([import("globe.gl"), import("topojson-client"), fetch(atlasUrl)]);
        if (!atlasResponse.ok) throw new Error(`Atlas indisponible (${atlasResponse.status})`);
        const topology = (await atlasResponse.json()) as WorldTopology;
        const countries = splitFrance((feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry, { name?: string }>).features);
        if (cancelled) return;

        globe = new Globe(container, { rendererConfig: { alpha: true, antialias: true } });
        const resize = () => {
          globe?.width(container.clientWidth);
          globe?.height(container.clientHeight);
        };
        globe
          .backgroundColor("rgba(0,0,0,0)")
          .showGraticules(true)
          .showAtmosphere(true)
          .atmosphereAltitude(0.18)
          .globeCurvatureResolution(5)
          .polygonsData(countries)
          .polygonGeoJsonGeometry("geometry")
          .polygonAltitude((country) => (isFrance(country) ? 0.035 : 0.008))
          .polygonCapCurvatureResolution(4)
          .ringsData([FRANCE])
          .ringColor(() => (t: number) => `rgba(86, 156, 255, ${0.85 * (1 - t)})`)
          .ringMaxRadius(7)
          .ringPropagationSpeed(2.2)
          .ringRepeatPeriod(1600)
          .ringAltitude(0.04);

        // Rotation à la souris uniquement : sur mobile, le doigt doit pouvoir faire défiler la page.
        const controls = globe.controls();
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableRotate = window.matchMedia("(pointer: fine)").matches;
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;

        const applyPalette = () => {
          if (!globe) return;
          const dark = document.documentElement.dataset.theme === "dark";
          const { cap, side, stroke } = globePalette(dark);
          styleGlobeSurface(globe, dark);
          globe
            .polygonCapColor((country) => (isFrance(country) ? "rgba(64, 140, 255, 0.95)" : cap))
            .polygonSideColor((country) => (isFrance(country) ? "rgba(38, 104, 230, 0.8)" : side))
            .polygonStrokeColor((country) => (isFrance(country) ? "rgba(200, 225, 255, 0.95)" : stroke));
        };
        applyPalette();
        resize();
        // Centrage après l’initialisation du rendu, sinon globe.gl revient à sa vue par défaut.
        requestAnimationFrame(() => globe?.pointOfView({ lat: FRANCE.lat - 4, lng: FRANCE.lng, altitude: 2.45 }, 0));

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        const themeObserver = new MutationObserver(applyPalette);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        const visibilityObserver = new IntersectionObserver(([entry]) => (entry.isIntersecting ? globe?.resumeAnimation() : globe?.pauseAnimation()), { rootMargin: "120px" });
        visibilityObserver.observe(container);
        cleanup = () => {
          resizeObserver.disconnect();
          themeObserver.disconnect();
          visibilityObserver.disconnect();
        };
      } catch (error) {
        console.error("Impossible d'initialiser le globe WebGL", error);
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
      globe?._destructor();
      container.replaceChildren();
    };
  }, []);

  return (
    <figure className="france-globe">
      <div ref={containerRef} className="france-globe-canvas" role="img" aria-label={label} />
      {failed && <div className="france-globe-fallback" aria-hidden="true" />}
      <figcaption>
        <span className="france-globe-dot" aria-hidden="true" />
        {caption}
      </figcaption>
    </figure>
  );
}
