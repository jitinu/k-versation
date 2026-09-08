"use client";

import { useEffect, useRef, useState } from "react";
import { countryCoordinates } from "@/lib/countries";
import type { CountryCount } from "@/lib/types";

function project(
  latitude: number,
  longitude: number,
  rotation: number,
  radius: number,
) {
  const lat = (latitude * Math.PI) / 180;
  const lon = ((longitude + rotation) * Math.PI) / 180;
  return {
    x: radius * Math.cos(lat) * Math.sin(lon),
    y: -radius * Math.sin(lat),
    z: Math.cos(lat) * Math.cos(lon),
  };
}

export function Globe({ countries }: { countries: CountryCount[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(-128);
  const drag = useRef<{ x: number; rotation: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ratio = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    context.scale(ratio, ratio);
    context.clearRect(0, 0, size, size);

    const radius = size * 0.39;
    const center = size / 2;
    const gradient = context.createRadialGradient(
      center - radius * 0.4,
      center - radius * 0.45,
      radius * 0.1,
      center,
      center,
      radius,
    );
    gradient.addColorStop(0, "#2f4b6d");
    gradient.addColorStop(0.65, "#1a3049");
    gradient.addColorStop(1, "#0b1727");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.fill();

    context.save();
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.clip();
    context.strokeStyle = "rgba(212,163,95,.22)";
    context.lineWidth = 1;
    for (let lat = -60; lat <= 60; lat += 30) {
      context.beginPath();
      for (let lon = -180; lon <= 180; lon += 3) {
        const point = project(lat, lon, rotation, radius);
        if (point.z < 0) continue;
        const x = center + point.x;
        const y = center + point.y;
        if (lon === -180) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }
    for (let lon = -180; lon < 180; lon += 30) {
      context.beginPath();
      let started = false;
      for (let lat = -90; lat <= 90; lat += 2) {
        const point = project(lat, lon, rotation, radius);
        if (point.z < 0) {
          started = false;
          continue;
        }
        const x = center + point.x;
        const y = center + point.y;
        if (!started) context.moveTo(x, y);
        else context.lineTo(x, y);
        started = true;
      }
      context.stroke();
    }
    context.restore();

    const visible = countries
      .map((country) => {
        const coordinates = countryCoordinates[country.countryCode];
        if (!coordinates) return null;
        return {
          ...country,
          point: project(coordinates[0], coordinates[1], rotation, radius),
        };
      })
      .filter((country) => country && country.point.z > 0);

    context.strokeStyle = "rgba(236,208,166,.45)";
    visible.forEach((country, index) => {
      if (!country || index === 0) return;
      const previous = visible[index - 1];
      if (!previous) return;
      context.beginPath();
      context.moveTo(center + previous.point.x, center + previous.point.y);
      context.quadraticCurveTo(
        center,
        center - radius * 0.35,
        center + country.point.x,
        center + country.point.y,
      );
      context.stroke();
    });

    const maxCount = Math.max(1, ...countries.map((country) => country.count));
    visible.forEach((country) => {
      if (!country) return;
      const markerRadius = 4 + Math.sqrt(country.count / maxCount) * 10;
      context.fillStyle = "#d4a35f";
      context.beginPath();
      context.arc(
        center + country.point.x,
        center + country.point.y,
        markerRadius,
        0,
        Math.PI * 2,
      );
      context.fill();
      context.strokeStyle = "rgba(247,242,232,.85)";
      context.stroke();
    });
  }, [countries, rotation]);

  return (
    <div className="globe-wrap">
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        aria-label={
          countries.length
            ? `Interactive globe showing members in ${countries.length} countries`
            : "Interactive globe awaiting member country data"
        }
        role="img"
        onPointerDown={(event) => {
          drag.current = { x: event.clientX, rotation };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          setRotation(
            drag.current.rotation + (event.clientX - drag.current.x) * 0.4,
          );
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      />
      <p className="globe-caption">
        {countries.length
          ? "Drag the globe to explore the community."
          : "Country markers appear as the community grows."}
      </p>
    </div>
  );
}
