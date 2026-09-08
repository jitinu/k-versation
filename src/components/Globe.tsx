"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";
import { getCountryCoords } from "@/lib/countryCoords";
import type { CountryMembers } from "@/lib/supabase/types";

const GlobeImpl = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function Globe({ members }: { members: CountryMembers[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [width, setWidth] = useState(0);
  const globeMaterial = useMemo(() => new MeshPhongMaterial({ color: "#141414" }), []);
  const points = useMemo(
    () =>
      members
        .map((row) => {
          const coords = getCountryCoords(row.country_code);
          return coords
            ? { ...row, lat: coords[0], lng: coords[1], size: Math.sqrt(row.members) / 30 }
            : null;
        })
        .filter((point): point is NonNullable<typeof point> => point !== null)
        .sort((a, b) => b.members - a.members),
    [members],
  );
  const arcs = useMemo(() => {
    const top = points[0];
    if (!top) return [];
    const network = points.slice(1).map((point) => ({
      startLat: top.lat,
      startLng: top.lng,
      endLat: point.lat,
      endLng: point.lng,
    }));
    return points.slice(1).reduce((result, point, index) => {
      const next = points[index + 2];
      if (next) {
        result.push({
          startLat: point.lat,
          startLng: point.lng,
          endLat: next.lat,
          endLng: next.lng,
        });
      }
      return result;
    }, network);
  }, [points]);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controls = globeRef.current?.controls();
    if (!controls) return;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
  }, [width]);

  return (
    <div ref={wrapperRef} className="h-[520px] w-full">
      {width > 0 ? (
        <GlobeImpl
          ref={globeRef}
          width={width}
          height={520}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor="#ff1a00"
          atmosphereAltitude={0.04}
          pointsData={points}
          pointsMerge={false}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={0.01}
          pointRadius="size"
          pointColor={() => "#ff1a00"}
          ringsData={points}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => "#ff1a00"}
          ringMaxRadius={2}
          ringPropagationSpeed={1}
          ringRepeatPeriod={1800}
          arcsData={arcs}
          arcColor={() => "#ff1a00"}
          arcDashLength={0.4}
          arcDashGap={1}
          arcDashAnimateTime={1800}
          enablePointerInteraction
        />
      ) : null}
    </div>
  );
}
