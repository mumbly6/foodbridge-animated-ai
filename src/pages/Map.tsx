import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Map = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Food Donation Map</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-medium">
          <div className="flex flex-col items-center justify-center space-y-4 text-center min-h-[500px]">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground animate-pulse-glow">
              <MapPin className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Interactive Map Coming Soon</h2>
            <p className="text-muted-foreground max-w-md">
              We're building an amazing real-time map to show all available food donations, 
              community fridges, and drop-off locations near you.
            </p>
            <div className="grid gap-2 pt-4 w-full max-w-md">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span>Available Donations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-3 w-3 rounded-full bg-secondary"></div>
                <span>Community Fridges</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-3 w-3 rounded-full bg-accent"></div>
                <span>Drop-off Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
