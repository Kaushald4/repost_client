"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { PostCard } from "@/components/post-card";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostService } from "@/services/post.service";
import { CommunityService } from "@/services/community.service";
import { Post, Community } from "@/types";
import { Loader2, Search as SearchIcon, Users } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setIsLoading(true);
      try {
        const [foundPosts, foundCommunities] = await Promise.all([
          PostService.searchPosts(query),
          CommunityService.searchCommunities(query),
        ]);
        setPosts(foundPosts);
        setCommunities(foundCommunities);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Search results for "{query}"</h1>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
          <TabsTrigger value="communities">Communities ({communities.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No posts found matching "{query}"</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="communities">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : communities.length > 0 ? (
            <div className="grid gap-4">
              {communities.map((community) => (
                <Card key={community.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={community.icon} />
                      <AvatarFallback>{community.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/r/${community.name}`} className="font-semibold hover:underline">
                        r/{community.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {community.memberCount.toLocaleString()} members
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {community.description}
                      </p>
                    </div>
                  </div>
                  <Link href={`/r/${community.name}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No communities found matching "{query}"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
