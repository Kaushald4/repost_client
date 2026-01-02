"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CommunityInfoHeader } from "./community-info-header";
import { CommunityInfoSidebar } from "./community-info-sidebar";
import { CommunityInfoTabs } from "./community-info-tabs";
import { CommunityInfoAbout } from "./community-info-about";
import {
  useCommunityInfo,
  useJoinCommunity,
  useLeaveCommunity,
} from "@/features/community/hooks/useCommunityInfo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CommunityPage, ViewerContext } from "@/features/community/types";
import { resolveCommunityPermissions } from "../../utils";

export interface CommunityInfoPageClientProps {
  initialCommunity: CommunityPage;
  initialViewerContext: ViewerContext;
  communityName: string;
}

export const CommunityInfoPageClient = ({
  initialCommunity,
  initialViewerContext,
  communityName,
}: CommunityInfoPageClientProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"posts" | "about" | "members" | "moderation">("posts");

  const { data, isError, refetch } = useCommunityInfo(communityName, {
    community: initialCommunity,
    viewerContext: initialViewerContext,
  });

  const joinMutation = useJoinCommunity();
  const leaveMutation = useLeaveCommunity();

  const community = data?.community || initialCommunity;
  const viewerContext = data?.viewerContext || initialViewerContext;

  const mappedViewerContext = resolveCommunityPermissions(viewerContext);

  const isLoggedIn = !!mappedViewerContext.auth.isAuthenticated;
  const isOwner = mappedViewerContext.isOwner;

  const availableTabs = ["posts", "about", "members"];

  if (isOwner) {
    availableTabs.push("moderation");
  }

  const handleJoinCommunity = async () => {
    if (!community || !isLoggedIn) return;

    joinMutation.mutate(
      { communityId: community.id },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  const handleLeaveCommunity = async () => {
    if (!community || !isLoggedIn) return;

    leaveMutation.mutate(
      { communityId: community.id },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h2 className="text-xl font-semibold mb-2">Community Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The community you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Community Header */}
        <Card className="mb-6 overflow-hidden p-0">
          <CommunityInfoHeader
            community={community}
            viewerContext={mappedViewerContext}
            onJoinToggle={handleJoinCommunity}
            onLeaveToggle={handleLeaveCommunity}
            isPending={joinMutation.isPending || leaveMutation.isPending}
          />
        </Card>

        {/* Tabs */}
        <Card className="mb-6">
          <div className="p-4 md:p-6">
            <CommunityInfoTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              showModerationTab={isOwner}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-4 md:p-6">
              {activeTab === "posts" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Recent Posts</h2>
                  <p className="text-muted-foreground">
                    Posts from this community will appear here.
                  </p>
                </div>
              )}

              {activeTab === "about" && <CommunityInfoAbout community={community} />}

              {activeTab === "members" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Members</h2>
                  <p className="text-muted-foreground">Community members will be listed here.</p>
                </div>
              )}

              {activeTab === "moderation" && isOwner && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Moderation</h2>
                  <p className="text-muted-foreground">
                    Moderation tools and settings will be available here.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CommunityInfoSidebar community={community} viewerContext={viewerContext} />
          </div>
        </div>
      </div>
    </div>
  );
};
