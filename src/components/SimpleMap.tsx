import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { supabase } from "@/integrations/supabase/client";

interface Donation {
  id: string;
  title: string;
  latitude: number | string;
  longitude: number | string;
  food_type: string;
}

const SimpleMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const { data } = await supabase
      .from('donations')
      .select('id, title, latitude, longitude, food_type')
      .eq('status', 'available');
    
    if (data) setDonations(data);
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Fix Leaflet's default icon paths for Vite builds
    // (otherwise markers can be invisible even though they're "there")
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([40.7128, -74.006], 12);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Ensure correct render size after mount
    window.setTimeout(() => map.invalidateSize(), 250);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    if (donations.length === 0) return;

    // Add markers for donations
    const bounds = L.latLngBounds([]);

    donations.forEach((donation) => {
      const lat = typeof donation.latitude === "string" ? parseFloat(donation.latitude) : donation.latitude;
      const lng = typeof donation.longitude === "string" ? parseFloat(donation.longitude) : donation.longitude;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      L.marker([lat, lng])
        .addTo(mapRef.current!)
        .bindPopup(`<strong>${donation.title}</strong><br/>${donation.food_type}`);

      bounds.extend([lat, lng]);
    });

    // Fit map to show all markers
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [donations]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '600px' }} />;
};

export default SimpleMap;
