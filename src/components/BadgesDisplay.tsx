import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_required: number;
}

interface UserBadge {
  badge_id: string;
  earned_at: string;
}

const BadgesDisplay = () => {
  const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    fetchBadges();
    fetchUserBadges();
  }, []);

  const fetchBadges = async () => {
    const { data } = await supabase.from('badges').select('*').order('points_required');
    if (data) setAllBadges(data);
  };

  const fetchUserBadges = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: badges } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at')
      .eq('user_id', user.id);

    const { data: stats } = await supabase
      .from('user_stats')
      .select('points')
      .eq('user_id', user.id)
      .single();

    if (badges) setEarnedBadges(badges);
    if (stats) setUserPoints(stats.points);
  };

  const hasBadge = (badgeId: string) => earnedBadges.some(b => b.badge_id === badgeId);
  const canEarn = (pointsRequired: number) => userPoints >= pointsRequired;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Your Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allBadges.map((badge) => {
            const earned = hasBadge(badge.id);
            const unlockable = canEarn(badge.points_required);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  earned
                    ? 'border-primary bg-primary/10 animate-scale-in'
                    : unlockable
                    ? 'border-dashed border-muted-foreground/50'
                    : 'border-muted opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h4 className="font-semibold text-sm">{badge.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                <Badge variant={earned ? 'default' : 'secondary'} className="mt-2 text-xs">
                  {earned ? 'Earned!' : `${badge.points_required} pts`}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesDisplay;
