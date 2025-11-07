import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { MapPin, Loader2 } from "lucide-react";

const RequestForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    foodType: "",
    quantity: "",
    urgency: "",
    dietaryInfo: [] as string[],
  });

  const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Halal", "Kosher"];

  const getLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGettingLocation(false);
          toast.success("Location captured successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Please enable location services.");
          setGettingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setGettingLocation(false);
    }
  };

  const handleDietaryChange = (option: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, dietaryInfo: [...formData.dietaryInfo, option] });
    } else {
      setFormData({
        ...formData,
        dietaryInfo: formData.dietaryInfo.filter((item) => item !== option),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      toast.error("Please capture your location first!");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a request");
        navigate("/auth");
        return;
      }

      // Store request as a donation with status "requested" (we'll use the same table for simplicity)
      const { error } = await supabase.from("donations").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        food_type: formData.foodType,
        quantity: formData.quantity,
        pickup_window: formData.urgency,
        dietary_info: formData.dietaryInfo,
        latitude: location.lat,
        longitude: location.lng,
        status: "available", // We can add a "type" column later to differentiate
      });

      if (error) throw error;

      toast.success("Request created successfully! 🙏");
      navigate("/map");
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error("Failed to create request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Request Food Assistance</CardTitle>
        <CardDescription>Let the community know what you need</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Request Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Need groceries for family"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foodType">Food Type Needed *</Label>
            <Input
              id="foodType"
              placeholder="e.g., Vegetables, Prepared meals, Non-perishables"
              value={formData.foodType}
              onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity Needed *</Label>
            <Input
              id="quantity"
              placeholder="e.g., 3 days worth, 10 portions"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Details</Label>
            <Textarea
              id="description"
              placeholder="Tell us more about your situation..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency / Timeline</Label>
            <Input
              id="urgency"
              placeholder="e.g., Needed by tomorrow, Ongoing weekly need"
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <Label>Dietary Preferences</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dietaryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={formData.dietaryInfo.includes(option)}
                    onCheckedChange={(checked) => handleDietaryChange(option, checked as boolean)}
                  />
                  <label
                    htmlFor={option}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Location *</Label>
            {location ? (
              <div className="p-4 bg-muted rounded-lg border border-border">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
            ) : (
              <Button
                type="button"
                onClick={getLocation}
                disabled={gettingLocation}
                variant="outline"
                className="w-full"
              >
                {gettingLocation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Capture Current Location
                  </>
                )}
              </Button>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading || !location}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Request...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RequestForm;
