// Comment Component
"use client";

import { Comment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentItemProps {
  comment: Comment;
  onVote: (commentId: string, voteType: "up" | "down" | null) => void;
  onReply: (commentId: string, content: string) => void;
  depth?: number;
}

export function CommentItem({
  comment,
  onVote,
  onReply,
  depth = 0,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const score = comment.upvotes - comment.downvotes;

  const handleVote = (voteType: "up" | "down") => {
    const newVote = comment.userVote === voteType ? null : voteType;
    onVote(comment.id, newVote);
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  if (comment.isDeleted) {
    return (
      <div className={cn("pl-4 border-l-2", depth > 0 && "ml-6")}>
        <p className="text-sm text-muted-foreground italic py-2">[deleted]</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", depth > 0 && "ml-6 pl-4 border-l-2")}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            {comment.author.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Comment Header */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold">
              {comment.author.displayName}
            </span>
            <span className="text-xs text-muted-foreground">
              u/{comment.author.username}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Comment Content */}
          <p className="text-sm mb-2 whitespace-pre-wrap">{comment.content}</p>

          {/* Comment Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2",
                comment.userVote === "up" && "text-orange-500"
              )}
              onClick={() => handleVote("up")}
            >
              <ArrowUp className="h-3 w-3 mr-1" />
              {score}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2",
                comment.userVote === "down" && "text-blue-500"
              )}
              onClick={() => handleVote("down")}
            >
              <ArrowDown className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => setIsReplying(!isReplying)}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Reply
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-20"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply}>
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onVote={onVote}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
