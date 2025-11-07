import { useState, useEffect } from "react";
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

const DonationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    foodType: "",
    quantity: "",
    expiryTime: "",
    pickupWindow: "",
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
        toast.error("You must be logged in to create a donation");
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("donations").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        food_type: formData.foodType,
        quantity: formData.quantity,
        expiry_time: formData.expiryTime || null,
        pickup_window: formData.pickupWindow,
        dietary_info: formData.dietaryInfo,
        latitude: location.lat,
        longitude: location.lng,
        status: "available",
      });

      if (error) throw error;

      toast.success("Donation created successfully! 🎉");
      navigate("/map");
    } catch (error) {
      console.error("Error creating donation:", error);
      toast.error("Failed to create donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Create Food Donation</CardTitle>
        <CardDescription>Share your surplus food with those in need</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Donation Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Fresh vegetables from garden"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foodType">Food Type *</Label>
            <Input
              id="foodType"
              placeholder="e.g., Vegetables, Prepared meals, Baked goods"
              value={formData.foodType}
              onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              placeholder="e.g., 5 kg, 20 portions, 10 items"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details about the food..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryTime">Expiry Date & Time</Label>
              <Input
                id="expiryTime"
                type="datetime-local"
                value={formData.expiryTime}
                onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupWindow">Pickup Window</Label>
              <Input
                id="pickupWindow"
                placeholder="e.g., 2-4 PM today"
                value={formData.pickupWindow}
                onChange={(e) => setFormData({ ...formData, pickupWindow: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Dietary Information</Label>
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
                Creating Donation...
              </>
            ) : (
              "Create Donation"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
