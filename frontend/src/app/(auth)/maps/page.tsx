'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Dynamically import MapContainer and other Leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

interface PortCoords {
  lat: number;
  lng: number;
}

const PortDistanceMap: React.FC = () => {
  const [port1, setPort1] = useState('');
  const [port2, setPort2] = useState('');
  const [port1Coords, setPort1Coords] = useState<PortCoords | null>(null);
  const [port2Coords, setPort2Coords] = useState<PortCoords | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    // Fix Leaflet marker icon issues with webpack
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const geocodePort = async (portName: string): Promise<PortCoords | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(portName)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const coords1 = await geocodePort(port1);
    const coords2 = await geocodePort(port2);
    setPort1Coords(coords1);
    setPort2Coords(coords2);

    if (coords1 && coords2) {
      const dist = L.latLng(coords1).distanceTo(L.latLng(coords2)) / 1000;
      setDistance(parseFloat(dist.toFixed(2)));
      setMapKey(prev => prev + 1); // Force map re-render
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Port Distance Calculator</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={port1}
          onChange={(e) => setPort1(e.target.value)}
          placeholder="Enter first port name"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={port2}
          onChange={(e) => setPort2(e.target.value)}
          placeholder="Enter second port name"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Show Sea Path</button>
      </form>

      {distance !== null && <p className="mb-4">Approximate sea distance: {distance} km</p>}

      {typeof window !== 'undefined' && (
        <MapContainer key={mapKey} center={[0, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {port1Coords && <Marker position={[port1Coords.lat, port1Coords.lng]} />}
          {port2Coords && <Marker position={[port2Coords.lat, port2Coords.lng]} />}
          {port1Coords && port2Coords && (
            <Polyline positions={[[port1Coords.lat, port1Coords.lng], [port2Coords.lat, port2Coords.lng]]} color="red" />
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default PortDistanceMap;