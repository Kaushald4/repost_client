"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Shield,
  Users,
  MessageCircle,
  Bookmark,
  Settings,
  UserPlus,
  Bell
} from "lucide-react";
import { CommunityPage, ViewerContext } from "../../types";

interface CommunityInfoSidebarProps {
  community: CommunityPage;
  viewerContext: ViewerContext;
}

export const CommunityInfoSidebar = ({
  community,
  viewerContext
}: CommunityInfoSidebarProps) => {
  return (
    <div className="space-y-4">
      {/* Community Stats */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Community Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Members</span>
            <span className="font-medium">{community.counts.members}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Online</span>
            <span className="font-medium">24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Posts</span>
            <span className="font-medium">1.2k</span>
          </div>
        </div>
      </Card>

      {/* Community Rules */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Community Rules
        </h3>
        <div className="space-y-2">
          {community.rules && community.rules.length > 0 ? (
            community.rules.map((rule, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{index + 1}.</span>{" "}
                <span className="text-muted-foreground">{rule}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No rules defined for this community
            </p>
          )}
        </div>
      </Card>

      {/* Moderators */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Moderators
        </h3>
        <div className="space-y-2">
          {community.moderators && community.moderators.length > 0 ? (
            community.moderators.slice(0, 5).map((modId, index) => (
              <div key={index} className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {modId.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">Moderator {index + 1}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No moderators defined for this community
            </p>
          )}
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Actions</h3>
        <div className="space-y-2">
          <Button className="w-full" variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button className="w-full" variant="outline">
            <Bookmark className="h-4 w-4 mr-2" />
            Save Community
          </Button>
          {viewerContext.role === 'OWNER' && (
            <Button className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Manage Community
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
