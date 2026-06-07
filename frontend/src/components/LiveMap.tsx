'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

const points = [
  { name: 'Triveni Sangam', type: 'Primary ghat', pos: [25.429, 81.885] as [number, number] },
  { name: 'Sector 4 Medical Camp', type: 'Health node', pos: [25.432, 81.892] as [number, number] },
  { name: 'Central Lost and Found', type: 'Support', pos: [25.425, 81.891] as [number, number] },
  { name: 'Police Response Post', type: 'Security', pos: [25.427, 81.879] as [number, number] },
  { name: 'Pontoon Bridge 12', type: 'Forward route', pos: [25.431, 81.882] as [number, number] },
  { name: 'Pontoon Bridge 18', type: 'Return route', pos: [25.423, 81.884] as [number, number] },
];

export default function LiveMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;

    const map = L.map(mapRef.current, {
      center: [25.4284, 81.8894],
      zoom: 14,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    leafletRef.current = map;
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const icon = L.divIcon({
      className: 'kumbh-map-pin',
      html: '<span></span>',
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    points.forEach((point) => {
      L.marker(point.pos, { icon })
        .addTo(map)
        .bindPopup(`<strong>${point.name}</strong><br/>${point.type}`);
    });

    const forwardRoute: [number, number][] = [
      [25.424, 81.894],
      [25.426, 81.89],
      [25.429, 81.885],
      [25.431, 81.882],
    ];

    const exitRoute: [number, number][] = [
      [25.429, 81.885],
      [25.426, 81.882],
      [25.423, 81.884],
      [25.421, 81.889],
    ];

    L.polyline(forwardRoute, {
      color: '#f97316',
      weight: 5,
      opacity: 0.9,
    }).addTo(map);

    L.polyline(exitRoute, {
      color: '#0ea5e9',
      weight: 4,
      dashArray: '8 8',
      opacity: 0.9,
    }).addTo(map);

    L.circle([25.4284, 81.8894], {
      radius: 420,
      color: '#f43f5e',
      fillColor: '#f43f5e',
      fillOpacity: 0.1,
      weight: 2,
    }).addTo(map);

    return () => {
      map.remove();
      leafletRef.current = null;
    };
  }, []);

  return <div className="map-container" ref={mapRef} />;
}
