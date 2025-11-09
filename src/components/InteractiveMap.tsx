import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface Donation {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  food_type: string;
  quantity: string;
}

interface CommunityFridge {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
}

interface DropoffLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  hours: string;
}

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [fridges, setFridges] = useState<CommunityFridge[]>([]);
  const [dropoffs, setDropoffs] = useState<DropoffLocation[]>([]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    fetchData();
    
    const donationsChannel = supabase
      .channel('donations-map')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, () => {
        fetchDonations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(donationsChannel);
    };
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchDonations(), fetchFridges(), fetchDropoffs()]);
  };

  const fetchDonations = async () => {
    const { data } = await supabase
      .from('donations')
      .select('id, title, latitude, longitude, food_type, quantity')
      .eq('status', 'available');
    if (data) setDonations(data);
  };

  const fetchFridges = async () => {
    const { data } = await supabase.from('community_fridges').select('*');
    if (data) setFridges(data);
  };

  const fetchDropoffs = async () => {
    const { data } = await supabase.from('dropoff_locations').select('*');
    if (data) setDropoffs(data);
  };

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.0060, 40.7128],
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    donations.forEach((donation) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background: hsl(var(--primary));
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        animation: pulse 2s infinite;
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([donation.longitude, donation.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${donation.title}</h3>
              <p style="font-size: 12px; color: #666;">${donation.food_type}</p>
              <p style="font-size: 12px; color: #666;">Qty: ${donation.quantity}</p>
            </div>`
          )
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    fridges.forEach((fridge) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background: hsl(var(--secondary));
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      `;
      el.innerHTML = '❄️';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '16px';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([fridge.longitude, fridge.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${fridge.name}</h3>
              <p style="font-size: 12px; color: #666;">${fridge.description}</p>
            </div>`
          )
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    dropoffs.forEach((dropoff) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background: hsl(var(--accent));
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      `;
      el.innerHTML = '📦';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '16px';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([dropoff.longitude, dropoff.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${dropoff.name}</h3>
              <p style="font-size: 12px; color: #666;">${dropoff.hours}</p>
            </div>`
          )
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [donations, fridges, dropoffs]);

  if (!mapboxToken) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <MapPin className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Enter Mapbox Token</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Get your free token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
        </p>
        <Input
          type="text"
          placeholder="Paste your Mapbox public token"
          value={mapboxToken}
          onChange={(e) => setMapboxToken(e.target.value)}
          className="max-w-md"
        />
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        `}
      </style>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </>
  );
};

export default InteractiveMap;
