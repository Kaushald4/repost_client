// Post Detail Page with Comments
"use client";

import { use, useEffect, useState, useCallback } from "react";
import { AppLayout } from "@/components/app-layout";
import { PostCard } from "@/components/post-card";
import { CommentItem } from "@/components/comment-item";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePostStore } from "@/stores/post.store";
import { CommentService } from "@/services/comment.service";
import { Comment } from "@/types";
import { Loader2, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  const { currentPost, fetchPostById, isLoading } = usePostStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadComments = useCallback(async () => {
    const loadedComments = await CommentService.getCommentsByPostId(postId);
    setComments(loadedComments);
  }, [postId]);

  useEffect(() => {
    fetchPostById(postId);
    loadComments();
  }, [postId, fetchPostById, loadComments]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await CommentService.createComment(postId, newComment);
      setNewComment("");
      await loadComments();
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteComment = async (
    commentId: string,
    voteType: "up" | "down" | null
  ) => {
    try {
      await CommentService.voteComment(commentId, postId, voteType);
      await loadComments();
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    try {
      await CommentService.createComment(postId, content, parentId);
      await loadComments();
    } catch (error) {
      console.error("Failed to reply:", error);
    }
  };

  if (isLoading || !currentPost) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Post */}
        <PostCard post={currentPost} />

        {/* Comments Section */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              {currentPost.commentCount} Comments
            </h2>
          </div>

          <Separator className="mb-6" />

          {/* New Comment Form */}
          <div className="space-y-3 mb-8">
            <Textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-24"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCommentSubmit}
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Comment"
                )}
              </Button>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onVote={handleVoteComment}
                  onReply={handleReply}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
