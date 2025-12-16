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
  description: string | null;
  quantity: string;
  pickup_window: string | null;
  status: string;
}

const SimpleMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    fetchDonations();

    // Set up real-time subscription
    const channel = supabase
      .channel('donations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donations'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchDonations(); // Refresh donations on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDonations = async () => {
    const { data } = await supabase
      .from('donations')
      .select('id, title, latitude, longitude, food_type, description, quantity, pickup_window, status')
      .eq('status', 'available');
    
    if (data) setDonations(data);
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Fix Leaflet's default icon paths for Vite builds
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    // Initialize map with higher default zoom for precision
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([0, 20], 3);
    mapRef.current = map;

    // Add OpenStreetMap tiles with higher max zoom for precise locations
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19, // Maximum detail level
    }).addTo(map);

    // Add zoom control to top-right
    map.zoomControl.setPosition('topright');

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
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (donations.length === 0) return;

    // Add markers for donations with detailed popups
    const bounds = L.latLngBounds([]);

    donations.forEach((donation) => {
      const lat = typeof donation.latitude === "string" ? parseFloat(donation.latitude) : donation.latitude;
      const lng = typeof donation.longitude === "string" ? parseFloat(donation.longitude) : donation.longitude;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      // Create custom icon with pulsing effect
      const customIcon = L.divIcon({
        className: 'custom-donation-marker',
        html: `
          <div style="
            width: 30px;
            height: 30px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
          ">
            <span style="color: white; font-size: 14px;">🍽️</span>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      });

      // Create detailed popup content
      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #166534;">
            ${donation.title}
          </h3>
          <div style="background: #f0fdf4; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #166534;">
              <strong>Type:</strong> ${donation.food_type}
            </p>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #166534;">
              <strong>Quantity:</strong> ${donation.quantity}
            </p>
            ${donation.pickup_window ? `
              <p style="margin: 0; font-size: 12px; color: #166534;">
                <strong>Pickup:</strong> ${donation.pickup_window}
              </p>
            ` : ''}
          </div>
          ${donation.description ? `
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
              ${donation.description}
            </p>
          ` : ''}
          <div style="background: #f5f5f5; padding: 6px; border-radius: 4px; font-family: monospace; font-size: 11px;">
            <strong>📍 Exact Location:</strong><br/>
            Lat: ${lat.toFixed(6)}<br/>
            Lng: ${lng.toFixed(6)}
          </div>
          <button onclick="window.open('https://www.google.com/maps?q=${lat},${lng}', '_blank')" 
            style="margin-top: 8px; width: 100%; padding: 8px; background: #22c55e; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;">
            Open in Google Maps
          </button>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(mapRef.current!)
        .bindPopup(popupContent, { maxWidth: 300 });

      // Click to zoom in for precision
      marker.on('click', () => {
        mapRef.current?.setView([lat, lng], 17, { animate: true });
      });

      markersRef.current.push(marker);
      bounds.extend([lat, lng]);
    });

    // Fit map to show all markers with padding
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [donations]);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 2px 10px rgba(34, 197, 94, 0.4); }
          50% { transform: scale(1.1); box-shadow: 0 2px 20px rgba(34, 197, 94, 0.6); }
          100% { transform: scale(1); box-shadow: 0 2px 10px rgba(34, 197, 94, 0.4); }
        }
        .custom-donation-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
      `}</style>
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%', minHeight: '600px', borderRadius: '12px' }} 
      />
    </>
  );
};

export default SimpleMap;
