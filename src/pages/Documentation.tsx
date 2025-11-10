import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Book, Home, MapPin, Trophy, Zap, Users, 
  Heart, Leaf, TrendingUp, Shield, Rocket, Star 
} from "lucide-react";

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Book className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">Smart FoodBridge Documentation</h1>
              <p className="text-muted-foreground mt-2">Complete guide for hackathon judges & community</p>
            </div>
          </div>
          <Link to="/dashboard">
            <Button variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="usage">User Guide</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-primary" />
                  Project Mission
                </CardTitle>
                <CardDescription>
                  Transforming surplus food into shared abundance through technology and community collaboration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-bold text-lg mb-2">The Problem</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 40% of food goes to waste globally</li>
                      <li>• 1 in 8 people face food insecurity</li>
                      <li>• Lack of coordination systems</li>
                      <li>• No real-time visibility</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Our Solution</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Real-time food mapping</li>
                      <li>• AI-powered matching</li>
                      <li>• Gamified engagement</li>
                      <li>• Smart notifications</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">The Impact</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 30% reduction in food waste</li>
                      <li>• 1000+ meals in 6 months</li>
                      <li>• Community building</li>
                      <li>• Environmental benefits</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hackathon Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-secondary" />
                      Innovation
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✓ AI-powered donation matching using Gemini 2.5</li>
                      <li>✓ Free real-time mapping (Leaflet + OpenStreetMap)</li>
                      <li>✓ Gamification for sustained engagement</li>
                      <li>✓ Edge computing for scalability</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Technical Excellence
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✓ Type-safe TypeScript codebase</li>
                      <li>✓ Responsive & accessible design</li>
                      <li>✓ Row-level security on all data</li>
                      <li>✓ Performance optimized with lazy loading</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Interactive Real-Time Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Live visualization of the food donation ecosystem powered by Leaflet and OpenStreetMap.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="secondary">🍎 Live Donations</Badge>
                    <Badge variant="secondary">❄️ Community Fridges</Badge>
                    <Badge variant="secondary">📦 Drop-off Locations</Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Animated custom markers</li>
                    <li>• Auto-zoom to fit all points</li>
                    <li>• Popup details on click</li>
                    <li>• Real-time updates via Supabase</li>
                    <li>• 100% free (no API keys needed)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-secondary" />
                    AI Donation Concierge
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Intelligent matching powered by Google Gemini 2.5 Flash via Lovable AI Gateway.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Dietary restrictions matching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Urgency-based prioritization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Geographic proximity ranking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Volume & quantity matching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Historical pattern learning</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-secondary" />
                    Gamification System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Motivate community participation with points, badges, and leaderboards.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Badge Achievements</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>🦸 Food Hero (10 pts)</div>
                        <div>🎁 Generous Giver (50 pts)</div>
                        <div>👑 Community Champion (100 pts)</div>
                        <div>⚔️ Hunger Warrior (250 pts)</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Leaderboards</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Top Donors</Badge>
                        <Badge>Top Organizers</Badge>
                        <Badge>Top Helpers</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Smart Profile System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Personalized experience with progress tracking and achievements.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Animated progress bars</li>
                    <li>• Custom avatar system</li>
                    <li>• Achievement showcase</li>
                    <li>• Milestone celebrations</li>
                    <li>• Activity history tracking</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tech Stack Tab */}
          <TabsContent value="tech" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Frontend</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• React 18.3.1 + TypeScript</li>
                      <li>• Vite (build tool)</li>
                      <li>• Tailwind CSS (styling)</li>
                      <li>• Shadcn UI (components)</li>
                      <li>• Leaflet + React-Leaflet (mapping)</li>
                      <li>• React Query (state management)</li>
                      <li>• React Router (routing)</li>
                      <li>• React Hook Form + Zod (forms)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Backend (Lovable Cloud)</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• PostgreSQL (database)</li>
                      <li>• Supabase Auth (authentication)</li>
                      <li>• Supabase Realtime (live updates)</li>
                      <li>• Edge Functions (serverless)</li>
                      <li>• Lovable AI Gateway (Gemini 2.5)</li>
                      <li>• Row-level security (RLS)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded">
                    <h4 className="font-semibold mb-2">donations</h4>
                    <p className="text-xs text-muted-foreground">Food donation listings with location, dietary info, and status</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <h4 className="font-semibold mb-2">profiles</h4>
                    <p className="text-xs text-muted-foreground">User information and role management</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <h4 className="font-semibold mb-2">user_stats</h4>
                    <p className="text-xs text-muted-foreground">Points, donations count, requests fulfilled</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <h4 className="font-semibold mb-2">badges</h4>
                    <p className="text-xs text-muted-foreground">Achievement definitions and requirements</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <h4 className="font-semibold mb-2">community_fridges</h4>
                    <p className="text-xs text-muted-foreground">Public fridge locations across the city</p>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <h4 className="font-semibold mb-2">notifications</h4>
                    <p className="text-xs text-muted-foreground">In-app alerts for users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Metrics We Track
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Total donations made</li>
                      <li>• Active donors count</li>
                      <li>• Estimated meals distributed</li>
                      <li>• Geographic coverage</li>
                      <li>• Community engagement rate</li>
                      <li>• Food waste reduction</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      Environmental Impact
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Lower carbon emissions</li>
                      <li>• Reduced landfill burden</li>
                      <li>• Promoted sustainable practices</li>
                      <li>• Circular economy approach</li>
                      <li>• Resource conservation</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold mb-2">UN Sustainable Development Goals</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline">SDG #2: Zero Hunger</Badge>
                    <Badge variant="outline">SDG #12: Responsible Consumption</Badge>
                    <Badge variant="outline">SDG #11: Sustainable Cities</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Expected Outcomes (6 months)</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold text-primary">30%</div>
                      <div className="text-xs text-muted-foreground mt-1">Food Waste Reduction</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold text-primary">1000+</div>
                      <div className="text-xs text-muted-foreground mt-1">People Fed</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold text-primary">500+</div>
                      <div className="text-xs text-muted-foreground mt-1">Active Users</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold text-primary">50+</div>
                      <div className="text-xs text-muted-foreground mt-1">Locations</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>For Donors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">1. Sign Up</h4>
                    <p className="text-sm text-muted-foreground">Create account and complete profile (+20 points)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">2. Make Donation</h4>
                    <p className="text-sm text-muted-foreground">Fill form with food details, location, and pickup time (+10 points)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">3. Track Impact</h4>
                    <p className="text-sm text-muted-foreground">View stats, earn badges, climb leaderboard</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>For Recipients</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">1. Browse Map</h4>
                    <p className="text-sm text-muted-foreground">View live donations, fridges, and drop-offs</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">2. Submit Request</h4>
                    <p className="text-sm text-muted-foreground">Describe needs, dietary requirements, urgency</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">3. Get AI Matches</h4>
                    <p className="text-sm text-muted-foreground">AI recommends best donations based on your needs</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Installation</h4>
                    <pre className="bg-muted p-3 rounded overflow-x-auto">
                      <code>{`npm install\nnpm run dev`}</code>
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Environment</h4>
                    <p className="text-muted-foreground">No manual setup needed - Lovable Cloud auto-configures all environment variables</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Deployment</h4>
                    <p className="text-muted-foreground">Click "Publish" in Lovable editor - frontend and backend deploy automatically</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer CTA */}
        <Card className="mt-8 bg-gradient-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Make an Impact?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Join our community and help fight hunger while reducing food waste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Link to="/dashboard">
                <Button variant="secondary" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  View Live Map
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;
