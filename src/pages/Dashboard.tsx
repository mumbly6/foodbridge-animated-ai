import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Plus, MapPin, Package, Users } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session?.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const userRole = user?.user_metadata?.role || "donor";

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Smart FoodBridge
          </h1>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userRole === "donor" ? "Donor" : "Recipient"}!
          </h2>
          <p className="text-muted-foreground">
            {userRole === "donor" 
              ? "Ready to share food and make a difference?"
              : "Discover available donations near you"}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="group hover:shadow-glow transition-all cursor-pointer animate-scale-in">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                {userRole === "donor" ? <Plus className="h-6 w-6" /> : <Package className="h-6 w-6" />}
              </div>
              <CardTitle>
                {userRole === "donor" ? "Create Donation" : "Browse Donations"}
              </CardTitle>
              <CardDescription>
                {userRole === "donor" 
                  ? "List available food items"
                  : "Find food available near you"}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-glow transition-all cursor-pointer animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-secondary text-secondary-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <CardTitle>View Map</CardTitle>
              <CardDescription>
                See all donations and locations nearby
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-glow transition-all cursor-pointer animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle>Community</CardTitle>
              <CardDescription>
                Connect with other members
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Overview */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Your Impact</CardTitle>
            <CardDescription>See the difference you're making</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-foreground">0</div>
                <div className="text-sm text-muted-foreground">
                  {userRole === "donor" ? "Items Donated" : "Items Received"}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-foreground">0</div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-foreground">0</div>
                <div className="text-sm text-muted-foreground">Community Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
