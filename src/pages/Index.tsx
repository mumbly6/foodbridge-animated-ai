import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, MapPin, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJoc2woMTQyIDc2JSAzNiUgLyAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground animate-fade-in md:text-7xl">
              Connect Food.
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Save Lives.</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground animate-fade-in md:text-2xl" style={{ animationDelay: "0.1s" }}>
              Smart FoodBridge links surplus food with those who need it most. Join our community making a real impact.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/auth">
                <Button size="lg" className="group w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/map">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <MapPin className="mr-2 h-5 w-5" />
                  View Map
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mx-auto mt-20 grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="rounded-xl border bg-card p-6 text-center shadow-soft transition-all hover:shadow-medium animate-scale-in">
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Meals Saved</div>
            </div>
            <div className="rounded-xl border bg-card p-6 text-center shadow-soft transition-all hover:shadow-medium animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="rounded-xl border bg-card p-6 text-center shadow-soft transition-all hover:shadow-medium animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div className="text-3xl font-bold text-foreground">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold text-foreground">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Simple, fast, and impactful - connecting communities one meal at a time
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            <div className="group rounded-2xl border bg-card p-8 shadow-soft transition-all hover:shadow-glow">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-foreground">Donate Food</h3>
              <p className="text-muted-foreground">
                Restaurants, stores, and individuals can list surplus food in seconds with our intuitive interface.
              </p>
            </div>

            <div className="group rounded-2xl border bg-card p-8 shadow-soft transition-all hover:shadow-glow">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-secondary text-secondary-foreground">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-foreground">Find Resources</h3>
              <p className="text-muted-foreground">
                View real-time maps of available donations, pantries, and pickup locations near you.
              </p>
            </div>

            <div className="group rounded-2xl border bg-card p-8 shadow-soft transition-all hover:shadow-glow">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-foreground">Make Impact</h3>
              <p className="text-muted-foreground">
                Track your contributions and see the real difference you're making in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold">Ready to Make a Difference?</h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands already fighting food waste and hunger
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="group">
              Join Smart FoodBridge
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
