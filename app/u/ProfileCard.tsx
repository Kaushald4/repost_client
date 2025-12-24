"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Cake, MessageSquare, TrendingUp } from "lucide-react";
import UpdateProfileForm from "./UpdateProfileForm";
import { ProfileClientService } from "@/services/profile/profile.client";
import { TUserResponseWrapper } from "@/types/register";
import { Badge } from "@/components/ui/badge";

type ProfileCardProps = {
  initialData: TUserResponseWrapper["data"];
};

const ProfileCard = ({ initialData }: ProfileCardProps) => {
  const { data: user } = useQuery({
    queryKey: ["profile"],
    initialData: initialData,
    queryFn: () => ProfileClientService.getProfile(),
  });
  return (
    <div className="p-6">
      <div className="flex items-start gap-6 -mt-16 mb-4">
        <Avatar className="h-24 w-24 border-4 border-background">
          <AvatarImage src={user?.avatar.url} />
          <AvatarFallback className="text-2xl">
            {user?.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 mt-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{user?.displayName}</h1>
                {user.isVerified && (
                  <Badge variant="secondary">✓ Verified</Badge>
                )}
              </div>
              <p className="text-muted-foreground">u/{user.username}</p>
            </div>

            <div className="flex gap-2">
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <UpdateProfileForm user={user} />
            </div>
          </div>

          {user.bio && (
            <p className="text-sm text-muted-foreground mt-3">{user.bio}</p>
          )}

          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Cake className="h-4 w-4" />
              <span>
                Joined{" "}
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold text-foreground">
                {user.karma.toLocaleString()}
              </span>
              <span>karma</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
