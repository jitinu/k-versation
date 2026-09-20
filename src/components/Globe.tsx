"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import { feature } from "topojson-client";
import type { FeatureCollection } from "geojson";
import topology from "world-atlas/countries-110m.json";
import { getCountryCoords } from "@/lib/countryCoords";
import type { CountryMembers } from "@/lib/supabase/types";

const GlobeImpl = dynamic(() => import("react-globe.gl"), { ssr: false });

type Point = CountryMembers & { lat: number; lng: number; size: number };

const RED = "#cd2e3a";
const BLUE = "#0047a0";
const WHITE = "#ffffff";
const BLACK = "#0b0a09";

const aliases: Record<string, string[]> = {
  "United States": ["United States of America"],
  "South Korea": ["South Korea", "Republic of Korea"],
  "United Arab Emirates": ["United Arab Emirates", "UAE"],
  UAE: ["United Arab Emirates", "UAE"],
  "United Kingdom": ["United Kingdom"],
  Taiwan: ["Taiwan"],
  China: ["China"],
  Japan: ["Japan"],
};

function matchesCountry(name: string, country: string) {
  const normalized = name.toLowerCase();
  return [country, ...(aliases[country] ?? [])].some(
    (candidate) => candidate.toLowerCase() === normalized,
  );
}

export default function Globe({ members }: { members: CountryMembers[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<object | null>(null);
  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: BLACK,
        emissive: "#050505",
        specular: "#1c1c1c",
        shininess: 14,
      }),
    [],
  );
  const countries = useMemo(() => {
    const collection = feature(
      topology as never,
      (topology as never as { objects: { countries: unknown } }).objects.countries as never,
    ) as unknown as FeatureCollection;
    return collection.features.filter(
      (country) => country.properties?.name?.toString().toLowerCase() !== "north korea",
    );
  }, []);
  const points = useMemo(
    () =>
      members
        .map((row) => {
          const coords = getCountryCoords(row.country_code);
          return coords
            ? {
                ...row,
                lat: coords[0],
                lng: coords[1],
                size: 0.6 + Math.sqrt(row.members) * 0.35,
              }
            : null;
        })
        .filter((point): point is Point => point !== null),
    [members],
  );
  const memberNames = useMemo(() => members.map((member) => member.country_name), [members]);
  useEffect(() => {
    const unmatched = memberNames.filter(
      (memberName) =>
        !countries.some((country) =>
          matchesCountry(String(country.properties?.name ?? ""), memberName),
        ),
    );
    if (unmatched.length) {
      console.warn("Globe member countries missing from world-atlas:", unmatched);
    }
  }, [countries, memberNames]);
  const arcs = useMemo(() => {
    const hub = points.find((point) => point.country_code.toUpperCase() === "KR") ?? points[0];
    if (!hub) return [];
    const hubArcs = points
      .filter((point) => point !== hub)
      .map((point) => ({
        startLat: point.lat,
        startLng: point.lng,
        endLat: hub.lat,
        endLng: hub.lng,
      }));
    const consecutiveArcs = points.slice(1).map((point, index) => ({
      startLat: points[index].lat,
      startLng: points[index].lng,
      endLat: point.lat,
      endLng: point.lng,
    }));
    return [...hubArcs, ...consecutiveArcs];
  }, [points]);

  const applyGlobeView = useCallback(() => {
    const globe = globeRef.current;
    const controls = globe?.controls?.();
    if (!globe || !controls) return false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    globe.pointOfView({ lat: 25, lng: 105, altitude: 1.55 });
    return true;
  }, []);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setDimensions({
        width: Math.floor(entry.contentRect.width),
        height: Math.floor(entry.contentRect.height),
      });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    let frame = 0;
    const sync = () => {
      if (!applyGlobeView()) frame = requestAnimationFrame(sync);
    };
    sync();
    return () => cancelAnimationFrame(frame);
  }, [applyGlobeView, dimensions]);

  return (
    <div
      ref={wrapperRef}
      className="bg-surface relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-media)] lg:aspect-square"
    >
      {dimensions.width > 0 && dimensions.height > 0 ? (
        <GlobeImpl
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor={BLUE}
          atmosphereAltitude={0.12}
          onGlobeReady={applyGlobeView}
          hexPolygonsData={countries}
          hexPolygonResolution={3}
          hexPolygonMargin={0.68}
          hexPolygonUseDots
          hexPolygonAltitude={(polygon) => {
            const name = String(
              (polygon as { properties?: { name?: string } }).properties?.name ?? "",
            );
            return memberNames.some((country) => matchesCountry(name, country)) ? 0.006 : 0.001;
          }}
          hexPolygonColor={(polygon) => {
            const name = String(
              (polygon as { properties?: { name?: string } }).properties?.name ?? "",
            );
            const active = memberNames.some((country) => matchesCountry(name, country));
            if (polygon === hoveredCountry) return "rgba(255,255,255,0.72)";
            if (!active) return "rgba(255,255,255,0.10)";
            const southKorea = ["south korea", "republic of korea"].includes(name.toLowerCase());
            return southKorea ? RED : BLUE;
          }}
          onHexPolygonHover={(polygon) => setHoveredCountry(polygon)}
          pointsData={points}
          pointsMerge={false}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={(point) => 0.02 + Math.sqrt((point as Point).members) * 0.012}
          pointRadius={(point) => 0.18 + Math.sqrt((point as Point).members) * 0.08}
          pointColor={() => WHITE}
          ringsData={points}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => (t: number) => `rgba(205,46,58,${(1 - t) * 0.8})`}
          ringMaxRadius={(point) => 2.5 + Math.sqrt((point as Point).members) * 0.9}
          ringPropagationSpeed={1.1}
          ringRepeatPeriod={2600}
          arcsData={arcs}
          arcColor={() => ["rgba(255,255,255,0)", RED, "rgba(255,255,255,0)"]}
          arcStroke={0.28}
          arcAltitudeAutoScale={0.4}
          arcDashLength={0.3}
          arcDashGap={1.2}
          arcDashInitialGap={() => Math.random() * 2}
          arcDashAnimateTime={3200}
          labelsData={points}
          labelLat="lat"
          labelLng="lng"
          labelText="country_name"
          labelSize={1.1}
          labelDotRadius={0}
          labelColor={() => "rgba(255,255,255,0.85)"}
          labelResolution={2}
          labelAltitude={0.045}
          pointLabel={(point) => {
            const row = point as Point;
            return `${row.country_name}: ${row.members}`;
          }}
          enablePointerInteraction
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,71,160,.08)_0%,transparent_38%,rgba(8,8,7,.5)_100%)]" />
    </div>
  );
}
