"use client";

import { useEffect } from "react";
import { PostCard } from "@/components/post-card";
import { FeedFilters } from "@/components/feed-filters";
import { usePostStore } from "@/stores/post.store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { CreatePostModal } from "@/components/create-post-modal";

export default function Home() {
  const { posts, isLoading, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Main Feed */}
      <div className="lg:col-span-2 space-y-4">
        <FeedFilters />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No posts to show. Join some communities to see content!
            </p>
            <Link href="/explore">
              <Button>Explore Communities</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block space-y-4">
        {/* Create Post Card */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Create Post</h3>
          <CreatePostModal>
            <Button className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </CreatePostModal>
        </Card>

        {/* Quick Stats */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Today&apos;s Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span className="text-muted-foreground">Trending Posts</span>
              </div>
              <span className="font-semibold">847</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">Active Users</span>
              </div>
              <span className="font-semibold">12.4k</span>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Welcome to Repost</h3>
          <p className="text-sm text-muted-foreground mb-4">
            A modern social platform for meaningful discussions and community
            engagement.
          </p>
          <div className="space-y-2">
            <Link href="/about">
              <Button variant="outline" size="sm" className="w-full">
                About Us
              </Button>
            </Link>
            <Link href="/guidelines">
              <Button variant="outline" size="sm" className="w-full">
                Community Guidelines
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer Links */}
        <div className="text-xs text-muted-foreground space-y-1 px-2">
          <div className="flex flex-wrap gap-2">
            <Link href="/help" className="hover:underline">
              Help
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
          </div>
          <p>© 2025 Repost. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
