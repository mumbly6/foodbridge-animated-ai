import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, MapPin, Package, Users, Heart, TrendingUp, HandHeart } from "lucide-react";
import { toast } from "sonner";
import Leaderboard from "@/components/Leaderboard";
import BadgesDisplay from "@/components/BadgesDisplay";
import ProfileProgress from "@/components/ProfileProgress";
import DonationForm from "@/components/DonationForm";
import RequestForm from "@/components/RequestForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
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
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-lg text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Smart FoodBridge</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}!</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="donate">Give Food</TabsTrigger>
            <TabsTrigger value="request">Request Food</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-primary animate-slide-in-left">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-foreground">127</div>
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Donors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-foreground">45</div>
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Meals Provided</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-foreground">892</div>
                    <TrendingUp className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-foreground">12</div>
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Leaderboard />
              <BadgesDisplay />
            </div>

            <ProfileProgress />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <CardTitle>Food Donation Map</CardTitle>
                  <CardDescription>
                    See all available food donations and drop-off locations near you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/map">
                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      <MapPin className="mr-2 h-4 w-4" />
                      Open Map
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <CardTitle>Community Impact</CardTitle>
                  <CardDescription>
                    Track the positive change we're making together
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Food Saved</span>
                      <span className="font-semibold text-primary">2,145 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">CO₂ Reduced</span>
                      <span className="font-semibold text-secondary">3,218 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">People Helped</span>
                      <span className="font-semibold text-accent">1,234</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-primary text-primary-foreground border-0 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setActiveTab("donate")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Donation
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Share your surplus food with the community
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-secondary text-secondary-foreground border-0 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setActiveTab("request")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HandHeart className="h-5 w-5" />
                    Request Food
                  </CardTitle>
                  <CardDescription className="text-secondary-foreground/80">
                    Let others know what you need
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="donate">
            <DonationForm />
          </TabsContent>

          <TabsContent value="request">
            <RequestForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
