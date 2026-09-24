import { useEffect, useMemo, useRef, useState } from "react";
import type { GlobeInstance } from "globe.gl";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { PageView } from "@/lib/analytics";
import atlasUrl from "world-atlas/countries-110m.json?url";
import { globePalette, styleGlobeSurface } from "@/lib/globeTheme";

type LocationGroup = {
  kind: "visit";
  key: string;
  countryCode: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  visits: number;
  visitors: Set<string>;
};

type CountryProperties = { name?: string };
type CountryFeature = Feature<Geometry, CountryProperties>;
type WorldTopology = Topology<{ countries: GeometryCollection<CountryProperties> }>;

type TrafficArc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  location: LocationGroup;
};

const FRANCE_CENTER = { lat: 46.6, lng: 1.9 };

const countryNames = typeof Intl !== "undefined" && Intl.DisplayNames
  ? new Intl.DisplayNames(["fr"], { type: "region" })
  : null;

function formatCountry(code: string) {
  try {
    return countryNames?.of(code) || code;
  } catch {
    return code;
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
  })[character] || character);
}

function pointTooltip(point: object) {
  const item = point as LocationGroup;
  const visits = `${item.visits} visite${item.visits > 1 ? "s" : ""}`;
  return `<div class="globe-tooltip"><strong>${escapeHtml(item.city)}</strong><span>${escapeHtml(item.country)} · ${visits}</span></div>`;
}

function countryTooltip(country: object) {
  const name = (country as CountryFeature).properties?.name;
  return name ? `<div class="globe-tooltip"><strong>${escapeHtml(name)}</strong></div>` : "";
}

export default function AdminTrafficGlobe({ views }: { views: PageView[] }) {
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [globeError, setGlobeError] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const locations = useMemo(() => {
    const groups = new Map<string, LocationGroup>();
    for (const view of views) {
      const lat = Number(view.latitude);
      const lng = Number(view.longitude);
      if (!view.country_code || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      const city = view.city?.trim() || view.region?.trim() || "Localisation non précisée";
      const key = `${view.country_code}-${city}-${lat}-${lng}`;
      const existing = groups.get(key);
      if (existing) {
        existing.visits += 1;
        existing.visitors.add(view.visitor_id);
      } else {
        groups.set(key, {
          kind: "visit",
          key,
          countryCode: view.country_code,
          country: formatCountry(view.country_code),
          city,
          lat,
          lng,
          visits: 1,
          visitors: new Set([view.visitor_id]),
        });
      }
    }
    return [...groups.values()].sort((a, b) => b.visits - a.visits);
  }, [views]);

  useEffect(() => {
    const container = globeContainerRef.current;
    if (!container) return;
    let cancelled = false;
    let globe: GlobeInstance | null = null;

    const setup = async () => {
      try {
        const [{ default: Globe }, { feature }, atlasResponse] = await Promise.all([
          import("globe.gl"),
          import("topojson-client"),
          fetch(atlasUrl),
        ]);
        if (!atlasResponse.ok) throw new Error(`Atlas indisponible (${atlasResponse.status})`);
        const topology = await atlasResponse.json() as WorldTopology;
        const countries = (feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry, CountryProperties>).features;
        if (cancelled) return;

        const visibleLocations = locations.slice(0, 80);
        const arcs: TrafficArc[] = locations.slice(0, 24).map((location) => ({
          startLat: FRANCE_CENTER.lat,
          startLng: FRANCE_CENTER.lng,
          endLat: location.lat,
          endLng: location.lng,
          location,
        }));
        globe = new Globe(container, { rendererConfig: { alpha: true, antialias: true } });
        globeRef.current = globe;

        const resize = () => {
          if (!globe) return;
          globe.width(Math.max(280, container.clientWidth));
          globe.height(Math.max(300, container.clientHeight));
        };

        globe
          .backgroundColor("rgba(0,0,0,0)")
          .showGlobe(true)
          .showGraticules(true)
          .showAtmosphere(true)
          .atmosphereAltitude(0.18)
          .globeCurvatureResolution(5)
          .polygonsData(countries)
          .polygonGeoJsonGeometry("geometry")
          .polygonAltitude(0.008)
          .polygonCapCurvatureResolution(4)
          .polygonLabel(countryTooltip)
          .pointsData(visibleLocations)
          .pointLat((point) => (point as LocationGroup).lat)
          .pointLng((point) => (point as LocationGroup).lng)
          .pointRadius((point) => Math.min(0.72, 0.34 + (point as LocationGroup).visits * 0.035))
          .pointAltitude((point) => Math.min(0.09, 0.035 + (point as LocationGroup).visits * 0.004))
          .pointResolution(5)
          .pointsTransitionDuration(800)
          .pointLabel(pointTooltip)
          .ringsData(visibleLocations.slice(0, 40))
          .ringLat((point) => (point as LocationGroup).lat)
          .ringLng((point) => (point as LocationGroup).lng)
          .ringMaxRadius((point) => Math.min(5, 2.5 + (point as LocationGroup).visits * 0.18))
          .ringPropagationSpeed(1.15)
          .ringRepeatPeriod(1500)
          .arcsData(arcs)
          .arcStartLat((arc) => (arc as TrafficArc).startLat)
          .arcStartLng((arc) => (arc as TrafficArc).startLng)
          .arcEndLat((arc) => (arc as TrafficArc).endLat)
          .arcEndLng((arc) => (arc as TrafficArc).endLng)
          .arcAltitudeAutoScale(0.26)
          .arcStroke(0.18)
          .arcDashLength(0.42)
          .arcDashGap(0.18)
          .arcDashAnimateTime(2800)
          .arcLabel((arc) => pointTooltip((arc as TrafficArc).location))
          .onPointClick((point) => {
            const location = point as LocationGroup;
            if (!globe) return;
            setSelectedKey(location.key);
            globe.controls().autoRotate = false;
            globe.pointOfView({ lat: location.lat, lng: location.lng, altitude: 1.6 }, 700);
          })
          .pointOfView({ lat: 25, lng: 5, altitude: 2.15 });

        const controls = globe.controls();
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        controls.autoRotate = !reduceMotion;
        controls.autoRotateSpeed = 0.42;
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        // Souris : glisser + molette. Doigt : un doigt pour tourner, deux doigts pour zoomer.
        controls.enableZoom = true;
        controls.enableRotate = true;
        controls.enablePan = false;
        // Dès qu'on manipule le globe, il arrête de tourner seul pour ne pas perdre la ville visée.
        controls.addEventListener("start", () => { controls.autoRotate = false; });

        const applyPalette = () => {
          if (!globe) return;
          const dark = document.documentElement.dataset.theme === "dark";
          const { accent, cap, side, stroke } = globePalette(dark);
          styleGlobeSurface(globe, dark);
          globe
            .polygonCapColor(() => cap)
            .polygonSideColor(() => side)
            .polygonStrokeColor(() => stroke)
            .pointColor(() => "#fff3d2")
            .ringColor(() => [accent, "rgba(201,173,124,0)"])
            .arcColor(() => ["rgba(201,173,124,0.08)", accent]);
        };

        applyPalette();
        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        const themeObserver = new MutationObserver(applyPalette);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        const visibilityObserver = new IntersectionObserver(([entry]) => {
          if (!globe) return;
          if (entry.isIntersecting) globe.resumeAnimation();
          else globe.pauseAnimation();
        }, { rootMargin: "120px" });
        visibilityObserver.observe(container);

        return () => {
          resizeObserver.disconnect();
          themeObserver.disconnect();
          visibilityObserver.disconnect();
        };
      } catch (error) {
        console.error("Impossible d'initialiser le globe WebGL", error);
        if (!cancelled) setGlobeError(true);
      }
    };

    let disconnectObservers: (() => void) | undefined;
    void setup().then((cleanup) => { disconnectObservers = cleanup; });
    return () => {
      cancelled = true;
      disconnectObservers?.();
      globeRef.current = null;
      globe?._destructor();
      container.replaceChildren();
    };
  }, [locations]);

  const locatedVisits = locations.reduce((total, location) => total + location.visits, 0);
  const countries = new Set(locations.map((location) => location.countryCode)).size;
  const uniqueVisitors = new Set(locations.flatMap((location) => [...location.visitors])).size;
  const selectedLocation = locations.find((location) => location.key === selectedKey);

  const focusLocation = (location: LocationGroup) => {
    setSelectedKey(location.key);
    if (globeRef.current) globeRef.current.controls().autoRotate = false;
    globeRef.current?.pointOfView({ lat: location.lat, lng: location.lng, altitude: 1.6 }, 700);
  };

  return <article className="dashboard-panel traffic-globe-panel">
    <div className="panel-head traffic-globe-head">
      <div>
        <span className="eyebrow">Audience internationale</span>
        <h2>Origine des connexions</h2>
        <p>Chaque point correspond à une ville d’où le site a été consulté. Sélectionnez-en un pour l’explorer.</p>
      </div>
      <span className="live-chip">Données réelles</span>
    </div>
    <div className="traffic-globe-layout">
      <div className="traffic-globe-visual">
        <div
          ref={globeContainerRef}
          className="traffic-globe-canvas"
          role="img"
          aria-label={`${locatedVisits} visites géolocalisées dans ${countries} pays. Globe interactif manipulable à la souris ou au toucher.`}
        />
        <span className="traffic-globe-hint traffic-globe-hint-mouse" aria-hidden="true">↔ Glisser pour explorer · molette pour zoomer</span>
        <span className="traffic-globe-hint traffic-globe-hint-touch" aria-hidden="true">↔ Glisser pour tourner · pincer pour zoomer</span>
        {selectedLocation && <div className="traffic-globe-selection" aria-live="polite">
          <strong>{selectedLocation.city}</strong>
          <span>{selectedLocation.country} · {selectedLocation.visits} visite{selectedLocation.visits > 1 ? "s" : ""}</span>
        </div>}
        {globeError && <div className="traffic-globe-error">Le rendu 3D n’est pas disponible sur ce navigateur.</div>}
      </div>
      <div className="traffic-globe-data">
        <div className="traffic-globe-stats">
          <div><strong>{locatedVisits}</strong><span>visites localisées</span></div>
          <div><strong>{uniqueVisitors}</strong><span>visiteurs</span></div>
          <div><strong>{countries}</strong><span>pays</span></div>
        </div>
        {locations.length ? <div className="traffic-locations" aria-label="Principales localisations">
          {locations.slice(0, 5).map((location) => <button
            type="button"
            className={selectedKey === location.key ? "traffic-location active" : "traffic-location"}
            key={location.key}
            onClick={() => focusLocation(location)}
          >
            <span className="traffic-location-marker" aria-hidden="true" />
            <span className="traffic-location-copy"><strong>{location.city}</strong><span>{location.country}</span></span>
            <b>{location.visits}</b>
          </button>)}
        </div> : <div className="traffic-globe-empty">
          <strong>En attente des prochaines visites</strong>
          <span>Le globe est opérationnel. Les points apparaîtront dès que de nouvelles visites auront été géolocalisées.</span>
        </div>}
      </div>
    </div>
  </article>;
}
