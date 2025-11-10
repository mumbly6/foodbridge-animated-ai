import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';

interface Donation {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
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

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([40.7128, -74.0060], 12);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || donations.length === 0) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add markers for donations
    const bounds = L.latLngBounds([]);
    
    donations.forEach((donation) => {
      const marker = L.marker([donation.latitude, donation.longitude])
        .addTo(mapRef.current!)
        .bindPopup(`<strong>${donation.title}</strong><br/>${donation.food_type}`);
      
      bounds.extend([donation.latitude, donation.longitude]);
    });

    // Fit map to show all markers
    if (donations.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [donations]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '600px' }} />;
};

export default SimpleMap;
