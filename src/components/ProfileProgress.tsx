import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Circle } from "lucide-react";

interface ProfileData {
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: string;
}

const ProfileProgress = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile(data);
      calculateProgress(data);
    }
  };

  const calculateProgress = (data: ProfileData) => {
    let completed = 0;
    const total = 4;

    if (data.full_name) completed++;
    if (data.avatar_url) completed++;
    if (data.phone) completed++;
    if (data.role) completed++;

    setProgress((completed / total) * 100);
  };

  if (!profile) return null;

  const items = [
    { label: 'Name', completed: !!profile.full_name },
    { label: 'Avatar', completed: !!profile.avatar_url },
    { label: 'Phone', completed: !!profile.phone },
    { label: 'Role', completed: !!profile.role },
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback>{profile.full_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{profile.full_name}</p>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={progress} className="flex-1 h-2" />
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          {items.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center gap-2 p-2 rounded animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={item.completed ? 'text-foreground' : 'text-muted-foreground'}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileProgress;
