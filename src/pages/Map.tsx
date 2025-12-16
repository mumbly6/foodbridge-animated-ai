import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SimpleMap from "@/components/SimpleMap";

interface Donation {
  id: string;
  title: string;
  description: string;
  food_type: string;
  quantity: string;
  latitude: number | string;
  longitude: number | string;
  dietary_info: string[];
  pickup_window: string;
  status: string;
  created_at: string;
}

const Map = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('donations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donations'
        },
        () => {
          fetchDonations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Food Donation Map</h1>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-2 rounded-2xl border bg-card shadow-medium overflow-hidden h-[600px]">
            <SimpleMap />
          </div>

          {/* Donations List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Available Donations ({donations.length})
            </h2>
            
            {loading ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">Loading donations...</p>
                </CardContent>
              </Card>
            ) : donations.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">No donations available yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {donations.map((donation) => (
                  <Card key={donation.id} className="hover:shadow-lg transition-shadow animate-fade-in">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{donation.title}</CardTitle>
                        <Badge variant="default" className="bg-primary">
                          {donation.status}
                        </Badge>
                      </div>
                      <CardDescription>{donation.food_type}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {donation.description && (
                        <p className="text-sm text-muted-foreground">{donation.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Quantity:</span>
                        <span className="text-muted-foreground">{donation.quantity}</span>
                      </div>
                      {donation.pickup_window && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Pickup:</span>
                          <span className="text-muted-foreground">{donation.pickup_window}</span>
                        </div>
                      )}
                      {donation.dietary_info && donation.dietary_info.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {donation.dietary_info.map((info) => (
                            <Badge key={info} variant="secondary" className="text-xs">
                              {info}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {Number(donation.latitude).toFixed(4)}, {Number(donation.longitude).toFixed(4)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
