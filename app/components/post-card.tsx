// Post Card Component
"use client";

import Link from "next/link";
import { Post } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePostStore } from "@/stores/post.store";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const { votePost, toggleSavePost } = usePostStore();

  const score = post.upvotes - post.downvotes;

  const handleVote = (voteType: "up" | "down") => {
    const newVote = post.userVote === voteType ? null : voteType;
    votePost(post.id, newVote);
  };

  const handleSave = () => {
    toggleSavePost(post.id);
  };

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <div className="flex gap-2">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-1 bg-muted/50 p-2 w-12">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              post.userVote === "up" && "text-orange-500"
            )}
            onClick={() => handleVote("up")}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
          <span
            className={cn(
              "text-sm font-semibold",
              post.userVote === "up" && "text-orange-500",
              post.userVote === "down" && "text-blue-500"
            )}
          >
            {score >= 1000 ? `${(score / 1000).toFixed(1)}k` : score}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              post.userVote === "down" && "text-blue-500"
            )}
            onClick={() => handleVote("down")}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Link
              href={`/r/${post.community.name}`}
              className="flex items-center gap-2 hover:underline"
            >
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">
                  {post.community.icon ||
                    post.community.displayName.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">
                r/{post.community.name}
              </span>
            </Link>

            <span className="text-muted-foreground text-xs">•</span>

            <Link
              href={`/u/${post.author.username}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              u/{post.author.username}
            </Link>

            <span className="text-muted-foreground text-xs">•</span>

            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>

            {post.flair && (
              <>
                <span className="text-muted-foreground text-xs">•</span>
                <Badge variant="secondary" className="text-xs">
                  {post.flair}
                </Badge>
              </>
            )}
          </div>

          {/* Title */}
          <Link href={`/post/${post.id}`}>
            <h3 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer line-clamp-2">
              {post.title}
            </h3>
          </Link>

          {/* Content Preview */}
          {!compact && post.content && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {post.content}
            </p>
          )}

          {/* Images */}
          {!compact && post.images && post.images.length > 0 && (
            <div className="relative w-full h-64 mb-3 rounded-lg overflow-hidden">
              <Image
                src={post.images[0]}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Poll */}
          {!compact && post.poll && (
            <div className="space-y-2 mb-3">
              {post.poll.options.map((option) => {
                const percentage =
                  post.poll!.totalVotes > 0
                    ? (option.votes / post.poll!.totalVotes) * 100
                    : 0;
                const isSelected = post.poll!.userVoted === option.id;

                return (
                  <div
                    key={option.id}
                    className={cn(
                      "p-3 rounded-lg border relative overflow-hidden",
                      isSelected && "border-primary"
                    )}
                  >
                    <div className="relative z-10 flex justify-between items-center">
                      <span className="text-sm font-medium">{option.text}</span>
                      <span className="text-xs text-muted-foreground">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={percentage} className="mt-2 h-1" />
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground text-center">
                {post.poll.totalVotes.toLocaleString()} votes
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link href={`/post/${post.id}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">
                  {post.commentCount} {compact ? "" : "Comments"}
                </span>
              </Button>
            </Link>

            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Share</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn("gap-2", post.isSaved && "text-primary")}
              onClick={handleSave}
            >
              <Bookmark
                className={cn("h-4 w-4", post.isSaved && "fill-current")}
              />
              <span className="text-xs hidden sm:inline">
                {post.isSaved ? "Saved" : "Save"}
              </span>
            </Button>

            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Eye className="h-4 w-4" />
              <span>
                {post.views >= 1000
                  ? `${(post.views / 1000).toFixed(1)}k`
                  : post.views}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Hide post</DropdownMenuItem>
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}
