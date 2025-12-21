// Comment Service - Handles all comment-related operations
import { Comment } from "@/types";
import { mockComments, mockUsers } from "@/data/mock-data";

export class CommentService {
  private static comments = mockComments;

  static async getCommentsByPostId(postId: string): Promise<Comment[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.comments[postId] || [];
  }

  static async createComment(
    postId: string,
    content: string,
    parentId?: string
  ): Promise<Comment> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newComment: Comment = {
      id: `c${Date.now()}`,
      content,
      author: mockUsers[0], // Current user
      postId,
      parentId,
      upvotes: 0,
      downvotes: 0,
      replies: [],
      createdAt: new Date(),
      userVote: null,
    };

    if (!this.comments[postId]) {
      this.comments[postId] = [];
    }

    if (parentId) {
      // Find parent comment and add reply
      const addReply = (comments: Comment[]): boolean => {
        for (const comment of comments) {
          if (comment.id === parentId) {
            comment.replies.push(newComment);
            return true;
          }
          if (addReply(comment.replies)) {
            return true;
          }
        }
        return false;
      };
      addReply(this.comments[postId]);
    } else {
      this.comments[postId].push(newComment);
    }

    return newComment;
  }

  static async voteComment(
    commentId: string,
    postId: string,
    voteType: "up" | "down" | null
  ): Promise<Comment> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const findAndVote = (comments: Comment[]): Comment | null => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          // Remove previous vote
          if (comment.userVote === "up") comment.upvotes--;
          if (comment.userVote === "down") comment.downvotes--;

          // Apply new vote
          if (voteType === "up") comment.upvotes++;
          if (voteType === "down") comment.downvotes++;

          comment.userVote = voteType;
          return comment;
        }
        const result = findAndVote(comment.replies);
        if (result) return result;
      }
      return null;
    };

    const comment = findAndVote(this.comments[postId] || []);
    if (!comment) throw new Error("Comment not found");
    return comment;
  }

  static async deleteComment(commentId: string, postId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const deleteFromArray = (comments: Comment[]): boolean => {
      const index = comments.findIndex((c) => c.id === commentId);
      if (index !== -1) {
        comments.splice(index, 1);
        return true;
      }
      for (const comment of comments) {
        if (deleteFromArray(comment.replies)) {
          return true;
        }
      }
      return false;
    };

    deleteFromArray(this.comments[postId] || []);
  }
}
