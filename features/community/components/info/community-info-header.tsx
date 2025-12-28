"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, Eye, Lock, Globe, MoreHorizontal, Settings } from "lucide-react";
import { CommunityPage, ViewerContext } from "../../types";
import Image from "next/image";

interface CommunityInfoHeaderProps {
  community: CommunityPage;
  viewerContext: ViewerContext;
  onJoinToggle: () => void;
  onLeaveToggle: () => void;
}

export const CommunityInfoHeader = ({
  community,
  viewerContext,
  onJoinToggle,
  onLeaveToggle,
}: CommunityInfoHeaderProps) => {
  const handleJoinLeave = () => {
    if (viewerContext.isMember) {
      onLeaveToggle();
    } else {
      onJoinToggle();
    }
  };

  const getVisibilityIcon = () => {
    switch (community.visibility) {
      case "PUBLIC":
        return <Globe className="h-4 w-4" />;
      case "RESTRICTED":
        return <Eye className="h-4 w-4" />;
      case "PRIVATE":
        return <Lock className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getVisibilityLabel = () => {
    switch (community.visibility) {
      case "PUBLIC":
        return "Public";
      case "RESTRICTED":
        return "Restricted";
      case "PRIVATE":
        return "Private";
      default:
        return "Public";
    }
  };

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-40 w-full bg-linear-to-r from-primary to-primary/80 rounded-t-lg overflow-hidden relative">
        {community.banner?.url && (
          <Image
            fill
            src={community.banner.url}
            alt={`${community.name} banner`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content container */}
      <div className="px-4 md:px-6 pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Avatar positioned over the banner */}
          <div className="relative z-10 flex items-center">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
              {community.icon?.url ? (
                <AvatarImage src={community.icon.url} alt={community.name} />
              ) : (
                <AvatarFallback className="text-xl">
                  {community.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          {/* Community Info */}
          <div className="flex-1 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{community.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-muted-foreground">@{community.name}</span>
                  {community.visibility && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getVisibilityIcon()}
                      {getVisibilityLabel()}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {viewerContext.role === "OWNER" && (
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                )}
                {viewerContext.isLoggedIn && (
                  <Button
                    variant={viewerContext.isMember ? "outline" : "default"}
                    size="sm"
                    onClick={handleJoinLeave}
                  >
                    {viewerContext.isMember ? "Joined" : "Join"}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="mt-3 text-muted-foreground max-w-2xl">
              {community.description || "No description provided"}
            </p>

            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{community.counts.members} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
