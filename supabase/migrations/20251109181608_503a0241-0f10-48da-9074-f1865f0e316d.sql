-- Create gamification tables
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  donations_count INTEGER NOT NULL DEFAULT 0,
  requests_fulfilled INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  points_required INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS public.community_fridges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dropoff_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  hours TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_fridges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dropoff_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view user stats" ON public.user_stats FOR SELECT USING (true);
CREATE POLICY "Users can update their own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stats" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Anyone can view user badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view community fridges" ON public.community_fridges FOR SELECT USING (true);
CREATE POLICY "Anyone can view dropoff locations" ON public.dropoff_locations FOR SELECT USING (true);

-- Insert default badges
INSERT INTO public.badges (name, description, icon, points_required) VALUES
  ('First Donation', 'Make your first food donation', '🎁', 0),
  ('Helpful Hero', 'Complete 5 donations', '⭐', 50),
  ('Community Champion', 'Complete 20 donations', '🏆', 200),
  ('Food Guardian', 'Complete 50 donations', '👑', 500);

-- Insert sample community fridges
INSERT INTO public.community_fridges (name, address, latitude, longitude, description) VALUES
  ('Downtown Community Fridge', '123 Main St', 40.7128, -74.0060, 'Open 24/7'),
  ('Northside Sharing Fridge', '456 Oak Ave', 40.7589, -73.9851, 'Restocked daily');

-- Insert sample dropoff locations
INSERT INTO public.dropoff_locations (name, address, latitude, longitude, hours, description) VALUES
  ('Central Food Bank', '789 Elm St', 40.7282, -73.9942, '9 AM - 5 PM', 'Main distribution center'),
  ('Community Center', '321 Pine St', 40.7489, -73.9680, '8 AM - 8 PM', 'Accepts all non-perishables');

-- Trigger for updated_at
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_badges;