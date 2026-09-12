import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with webpack/vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  lat: number;
  lng: number;
  name: string;
  building: string;
  floorNote: string;
  type: 'toilet' | 'fountain';
}

// Component to update map center when props change
function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 17);
  }, [lat, lng, map]);
  return null;
}

export default function MapView({ lat, lng, name, building, floorNote, type }: MapViewProps) {
  const emoji = type === 'toilet' ? '🚻' : '🚰';
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden card-shadow border border-slate-200 dark:border-slate-700">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          Location Map
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {building} • {floorNote}
        </p>
      </div>

      <div className="relative h-64 sm:h-80 md:h-96">
        <MapContainer
          center={[lat, lng]}
          zoom={17}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          dragging={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater lat={lat} lng={lng} />
          <Marker position={[lat, lng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{name}</p>
                <p className="text-gray-600">{building}</p>
                <p className="text-gray-500 text-xs">{floorNote}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2.5 bg-uoft-blue text-white rounded-xl text-sm font-semibold hover:bg-uoft-blue-light transition-colors text-center flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Get Directions
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${lat}, ${lng}`);
            alert('Location copied to clipboard!');
          }}
          className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-center flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Location
        </button>
      </div>
    </div>
  );
}
