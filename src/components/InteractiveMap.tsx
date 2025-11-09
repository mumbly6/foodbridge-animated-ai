import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";

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

// Custom marker icons
const donationIcon = new L.DivIcon({
  html: `<div style="
    width: 32px;
    height: 32px;
    background: hsl(var(--primary));
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    animation: pulse 2s infinite;
  ">🍎</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const fridgeIcon = new L.DivIcon({
  html: `<div style="
    width: 32px;
    height: 32px;
    background: hsl(var(--secondary));
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  ">❄️</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const dropoffIcon = new L.DivIcon({
  html: `<div style="
    width: 32px;
    height: 32px;
    background: hsl(var(--accent));
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  ">📦</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

function MapUpdater({ donations, fridges, dropoffs }: { 
  donations: Donation[]; 
  fridges: CommunityFridge[];
  dropoffs: DropoffLocation[];
}) {
  const map = useMap();

  useEffect(() => {
    if (donations.length > 0 || fridges.length > 0 || dropoffs.length > 0) {
      const allPoints = [
        ...donations.map(d => [d.latitude, d.longitude] as [number, number]),
        ...fridges.map(f => [f.latitude, f.longitude] as [number, number]),
        ...dropoffs.map(d => [d.latitude, d.longitude] as [number, number]),
      ];
      
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [donations, fridges, dropoffs, map]);

  return null;
}

const InteractiveMap = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [fridges, setFridges] = useState<CommunityFridge[]>([]);
  const [dropoffs, setDropoffs] = useState<DropoffLocation[]>([]);

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


  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          .leaflet-container {
            height: 100%;
            width: 100%;
            border-radius: 0.5rem;
          }
        `}
      </style>
      <MapContainer 
        center={[40.7128, -74.0060]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater donations={donations} fridges={fridges} dropoffs={dropoffs} />

        {donations.map((donation) => (
          <Marker
            key={donation.id}
            position={[donation.latitude, donation.longitude]}
            icon={donationIcon}
          >
            <Popup>
              <div style={{ padding: '8px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{donation.title}</h3>
                <p style={{ fontSize: '12px', color: '#666' }}>{donation.food_type}</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Qty: {donation.quantity}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {fridges.map((fridge) => (
          <Marker
            key={fridge.id}
            position={[fridge.latitude, fridge.longitude]}
            icon={fridgeIcon}
          >
            <Popup>
              <div style={{ padding: '8px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{fridge.name}</h3>
                <p style={{ fontSize: '12px', color: '#666' }}>{fridge.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {dropoffs.map((dropoff) => (
          <Marker
            key={dropoff.id}
            position={[dropoff.latitude, dropoff.longitude]}
            icon={dropoffIcon}
          >
            <Popup>
              <div style={{ padding: '8px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{dropoff.name}</h3>
                <p style={{ fontSize: '12px', color: '#666' }}>{dropoff.hours}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default InteractiveMap;
