// Explore Page - Discover Communities
"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCommunityStore } from "@/stores/community.store";
import { Community } from "@/types";
import { Search, Users, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExplorePage() {
  const {
    communities,
    joinedCommunities,
    fetchCommunities,
    joinCommunity,
    leaveCommunity,
    isLoading,
  } = useCommunityStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const filteredCommunities = useMemo(() => {
    if (!searchQuery) return communities;
    return communities.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, communities]);

  const handleJoinToggle = async (community: Community) => {
    if (community.isJoined) {
      await leaveCommunity(community.id);
    } else {
      await joinCommunity(community.id);
    }
  };

  const CommunityCard = ({ community }: { community: Community }) => (
    <Card className="p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-lg">
              {community.icon || community.displayName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/r/${community.name}`}>
              <h3 className="font-semibold text-lg hover:text-primary">r/{community.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              {community.memberCount.toLocaleString()} members
            </p>
          </div>
        </div>
        <Button
          variant={community.isJoined ? "outline" : "default"}
          size="sm"
          onClick={() => handleJoinToggle(community)}
        >
          {community.isJoined ? "Joined" : "Join"}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{community.description}</p>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          Health Score: {community.healthScore}
        </Badge>
      </div>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Explore Communities</h1>
        <p className="text-muted-foreground">Discover and join communities that interest you</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            <TrendingUp className="mr-2 h-4 w-4" />
            All Communities
          </TabsTrigger>
          <TabsTrigger value="joined">
            <Users className="mr-2 h-4 w-4" />
            Joined ({joinedCommunities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No communities found matching your search</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="joined" className="space-y-4">
          {joinedCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {joinedCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven&apos;t joined any communities yet
              </p>
              <Button
                onClick={() => document.querySelector<HTMLButtonElement>('[value="all"]')?.click()}
              >
                Explore Communities
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
