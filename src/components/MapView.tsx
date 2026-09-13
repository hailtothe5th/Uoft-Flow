import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  lat: number;
  lng: number;
  name: string;
  building: string;
  floorNote: string;
  type: 'toilet' | 'fountain';
}

export default function MapView({ lat, lng, name, building, floorNote, type }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([lat, lng], 18);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add marker
    const icon = L.divIcon({
      html: `<div style="font-size: 2rem;">${type === 'toilet' ? '🚻' : '🚰'}</div>`,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif;">
          <strong style="font-size: 14px;">${name}</strong><br/>
          <span style="color: #666; font-size: 12px;">${building}</span><br/>
          <span style="color: #888; font-size: 11px;">${floorNote}</span>
        </div>
      `);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, name, building, floorNote, type]);

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
