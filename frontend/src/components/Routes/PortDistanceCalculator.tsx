"use client";
import styles from "@/src/styles/Detailpage.module.css";
import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icons
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

interface PortDistanceCalculatorProps {
  departurePort: string;
  destinationPort: string;
}

async function geocodePort(portName: string): Promise<[number, number] | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        portName
      )} &limit=1`
    );
    const data = await response.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return null;
}

const calculateMaritimeRoute = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const steps = 50;
  const route: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const lat = lat1 + (lat2 - lat1) * f;
    let lon = lon1 + (lon2 - lon1) * f;

    const latMid = (lat1 + lat2) / 2;
    const lonDiff = Math.abs(lon2 - lon1);
    if (lonDiff > 20 && Math.abs(lat - latMid) < 10) {
      lon += Math.sin((f - 0.5) * Math.PI) * lonDiff * 0.1;
    }

    route.push([lat, lon]);
  }

  return { route };
};

const PortDistanceCalculator: React.FC<PortDistanceCalculatorProps> = ({
  departurePort,
  destinationPort,
}) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fixLeafletIcon();

      const mapInstance = L.map("map").setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance);

      setMap(mapInstance);

      return () => {
        mapInstance.remove();
      };
    }
  }, []);

  useEffect(() => {
    const calculateRoute = async () => {
      if (!map || !departurePort || !destinationPort) return;

      setLoading(true);
      setError(null);

      try {
        const start = await geocodePort(departurePort);
        const end = await geocodePort(destinationPort);

        if (!start || !end) {
          throw new Error(
            "Unable to geocode one or both ports. Please check the port names."
          );
        }

        const { route: newRoute } = calculateMaritimeRoute(
          start[0],
          start[1],
          end[0],
          end[1]
        );

        setRoute(newRoute);

        // Clear existing layers
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });

        const startMarker = L.marker(start)
          .addTo(map)
          .bindPopup(`Departure: ${departurePort}`)
          .openPopup();
        const endMarker = L.marker(end)
          .addTo(map)
          .bindPopup(`Destination: ${destinationPort}`)
          .openPopup();
        L.polyline(newRoute, { color: "red" }).addTo(map);
        map.fitBounds(L.latLngBounds(newRoute));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (map) {
      calculateRoute();
    }
  }, [departurePort, destinationPort, map]);

  return (
    <div>
      <div
        id="map"
        style={{ height: "400px", maxWidth: "800px" }}
        className="mb-4"
      ></div>
      {loading && <p>Loading route...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default PortDistanceCalculator;
