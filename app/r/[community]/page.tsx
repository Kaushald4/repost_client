// Community Page - Individual Community View
"use client";

import { use, useEffect } from "react";
import { PostCard } from "@/components/post-card";
import { FeedFilters } from "@/components/feed-filters";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCommunityStore } from "@/stores/community.store";
import { usePostStore } from "@/stores/post.store";
import { Loader2, Users, Calendar, Shield, Plus } from "lucide-react";
import Link from "next/link";
import { CreatePostModal } from "@/components/create-post-modal";

interface CommunityPageProps {
  params: Promise<{ community: string }>;
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const resolvedParams = use(params);
  const communityName = resolvedParams.community;

  const {
    currentCommunity,
    fetchCommunityById,
    joinCommunity,
    leaveCommunity,
    isLoading,
  } = useCommunityStore();
  const { posts, fetchPosts, setFilter } = usePostStore();

  useEffect(() => {
    // Find community by name and fetch
    const loadCommunity = async () => {
      // In real app, we'd have a service method to get by name
      // For now, we'll use the communities from the store
      const { communities } = useCommunityStore.getState();
      const community = communities.find((c) => c.name === communityName);
      if (community) {
        await fetchCommunityById(community.id);
        setFilter({ communityId: community.id });
      }
    };
    loadCommunity();
  }, [communityName, fetchCommunityById, setFilter]);

  const handleJoinToggle = async () => {
    if (!currentCommunity) return;
    if (currentCommunity.isJoined) {
      await leaveCommunity(currentCommunity.id);
    } else {
      await joinCommunity(currentCommunity.id);
    }
  };

  if (isLoading || !currentCommunity) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Community Header Banner */}
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />

      {/* Community Info */}
      <div className="container mx-auto px-6">
        <div className="relative -mt-20 mb-6">
          <div className="flex items-end gap-4 mb-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarFallback className="text-3xl">
                {currentCommunity.icon ||
                  currentCommunity.displayName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold mb-1">
                {currentCommunity.displayName}
              </h1>
              <p className="text-muted-foreground">r/{currentCommunity.name}</p>
            </div>
            <div className="pb-2 flex gap-2">
              <Button onClick={handleJoinToggle}>
                {currentCommunity.isJoined ? "Joined" : "Join Community"}
              </Button>
              {currentCommunity.isJoined && (
                <CreatePostModal defaultCommunityId={currentCommunity.id}>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                </CreatePostModal>
              )}
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            {currentCommunity.description}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-semibold">
                {currentCommunity.memberCount.toLocaleString()}
              </span>
              <span className="text-muted-foreground">members</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="text-muted-foreground">
                Created{" "}
                {new Date(currentCommunity.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Badge variant="secondary">
              Health Score: {currentCommunity.healthScore}
            </Badge>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts Feed */}
          <div className="lg:col-span-2 space-y-4">
            <FeedFilters />
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Community Rules */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Community Rules
              </h3>
              <div className="space-y-2">
                {currentCommunity.rules.map((rule, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{index + 1}.</span>{" "}
                    <span className="text-muted-foreground">{rule}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Moderators */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Moderators</h3>
              <div className="space-y-2">
                {currentCommunity.moderators.slice(0, 3).map((modId) => (
                  <div key={modId} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">M</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Moderator</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
