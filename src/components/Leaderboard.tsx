import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  user_id: string;
  points: number;
  donations_count: number;
  full_name: string;
  avatar_url: string | null;
}

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel('leaderboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_stats' }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('user_stats')
      .select(`
        user_id,
        points,
        donations_count,
        profiles!inner(full_name, avatar_url)
      `)
      .order('points', { ascending: false })
      .limit(10);

    if (data) {
      const formatted = data.map((entry: any) => ({
        user_id: entry.user_id,
        points: entry.points,
        donations_count: entry.donations_count,
        full_name: entry.profiles.full_name,
        avatar_url: entry.profiles.avatar_url,
      }));
      setLeaders(formatted);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-muted-foreground font-bold">#{index + 1}</span>;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Top Contributors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaders.map((leader, index) => (
          <div
            key={leader.user_id}
            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex-shrink-0 w-8 flex justify-center">
              {getRankIcon(index)}
            </div>
            <Avatar>
              <AvatarImage src={leader.avatar_url || undefined} />
              <AvatarFallback>{leader.full_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{leader.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {leader.donations_count} donations
              </p>
            </div>
            <Badge variant="secondary" className="font-bold">
              {leader.points} pts
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
