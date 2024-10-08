"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface PortCoords {
  lat: number;
  lng: number;
}

interface DynamicMapProps {
  port1Coords: PortCoords | null;
  port2Coords: PortCoords | null;
}

const DynamicMap: React.FC<DynamicMapProps> = ({
  port1Coords,
  port2Coords,
}) => {
  const center = port1Coords || { lat: 0, lng: 0 };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={2}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {port1Coords && <Marker position={[port1Coords.lat, port1Coords.lng]} />}
      {port2Coords && <Marker position={[port2Coords.lat, port2Coords.lng]} />}
      {port1Coords && port2Coords && (
        <Polyline
          positions={[
            [port1Coords.lat, port1Coords.lng],
            [port2Coords.lat, port2Coords.lng],
          ]}
          color="red"
        />
      )}
    </MapContainer>
  );
};

export default DynamicMap;
