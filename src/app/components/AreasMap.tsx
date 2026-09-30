import { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Area {
  name: string;
  lat: number;
  lng: number;
}

const serviceAreas: Area[] = [
  { name: 'Raleigh', lat: 35.7796, lng: -78.6382 },
  { name: 'Cary', lat: 35.7915, lng: -78.7811 },
  { name: 'Apex', lat: 35.7321, lng: -78.8503 },
  { name: 'East Raleigh', lat: 35.8015, lng: -78.572 },
  { name: 'West Raleigh', lat: 35.7874, lng: -78.711 },
  { name: 'Garner', lat: 35.7107, lng: -78.6138 },
];

const LAUNDROMAT: Area = { name: 'Maytag Laundry', lat: 35.7856, lng: -78.7209 };

/** OpenFreeMap Positron — free, no API key, no usage limits, commercial use allowed (OSM data). */
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron';

function createMarkerElement(variant: 'store' | 'area') {
  const el = document.createElement('div');
  el.className = 'relative cursor-default';
  const dot = document.createElement('div');
  dot.className =
    variant === 'store'
      ? 'relative h-4 w-4 rounded-full border-2 border-white bg-neutral-900 shadow-lg'
      : 'relative h-4 w-4 rounded-full border-2 border-white bg-[#00bfb3] shadow-lg';
  el.appendChild(dot);
  return el;
}

export function AreasMap({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('maplibre-gl').Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    let cancelled = false;
    const markers: import('maplibre-gl').Marker[] = [];

    (async () => {
      const maplibregl = await import('maplibre-gl');

      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: [LAUNDROMAT.lng, LAUNDROMAT.lat],
        zoom: 10,
        // Ctrl/⌘ + scroll to zoom on desktop, two fingers on touch — so the page still scrolls normally
        cooperativeGestures: true,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        minZoom: 8,
        maxZoom: 16,
        attributionControl: true,
        fadeDuration: 0,
      });

      map.touchZoomRotate.disableRotation();
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

      mapRef.current = map;

      map.on('load', () => {
        if (cancelled) return;

        const bounds = new maplibregl.LngLatBounds();

        markers.push(
          new maplibregl.Marker({ element: createMarkerElement('store') })
            .setLngLat([LAUNDROMAT.lng, LAUNDROMAT.lat])
            .addTo(map),
        );
        bounds.extend([LAUNDROMAT.lng, LAUNDROMAT.lat]);

        serviceAreas.forEach((area) => {
          markers.push(
            new maplibregl.Marker({ element: createMarkerElement('area') })
              .setLngLat([area.lng, area.lat])
              .addTo(map),
          );
          bounds.extend([area.lng, area.lat]);
        });

        map.fitBounds(bounds, { padding: 48, maxZoom: 11, duration: 0 });
      });
    })();

    return () => {
      cancelled = true;
      markers.forEach((marker) => marker.remove());
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`areas-map isolate ${className ?? ''}`}
      role="region"
      aria-label="Map of Maytag Laundry and service areas in the Triangle"
    >
      <div ref={containerRef} className="h-full w-full" />
      <style>{`
        .areas-map .maplibregl-ctrl-attrib {
          font-size: 10px;
          line-height: 1.3;
          background: rgba(255, 255, 255, 0.85) !important;
        }
        .areas-map .maplibregl-ctrl-bottom-right {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
