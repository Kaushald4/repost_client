// Post Service - Handles all post-related operations
import { Post, FeedFilter } from "@/types";
import { mockPosts } from "@/data/mock-data";

export class PostService {
  private static posts = mockPosts;

  static async getPosts(filter: FeedFilter): Promise<Post[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredPosts = [...this.posts];

    // Filter by community
    if (filter.communityId) {
      filteredPosts = filteredPosts.filter(
        (post) => post.community.id === filter.communityId
      );
    }

    // Sort posts
    switch (filter.sort) {
      case "hot":
        filteredPosts.sort((a, b) => {
          const scoreA = a.upvotes - a.downvotes;
          const scoreB = b.upvotes - b.downvotes;
          const timeFactorA = Math.log(Date.now() - a.createdAt.getTime());
          const timeFactorB = Math.log(Date.now() - b.createdAt.getTime());
          return scoreB / timeFactorB - scoreA / timeFactorA;
        });
        break;
      case "new":
        filteredPosts.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        break;
      case "top":
        filteredPosts.sort(
          (a, b) => b.upvotes - a.upvotes - (a.downvotes - b.downvotes)
        );
        break;
      case "trending":
        filteredPosts.sort((a, b) => b.views - a.views);
        break;
    }

    return filteredPosts;
  }

  static async getPostById(id: string): Promise<Post | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.posts.find((post) => post.id === id) || null;
  }

  static async searchPosts(query: string): Promise<Post[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    return this.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery)
    );
  }

  static async createPost(postData: Partial<Post>): Promise<Post> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newPost: Post = {
      id: Date.now().toString(),
      ...postData,
    } as Post;
    this.posts.unshift(newPost);
    return newPost;
  }

  static async votePost(
    postId: string,
    voteType: "up" | "down" | null
  ): Promise<Post> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");

    // Remove previous vote
    if (post.userVote === "up") post.upvotes--;
    if (post.userVote === "down") post.downvotes--;

    // Apply new vote
    if (voteType === "up") post.upvotes++;
    if (voteType === "down") post.downvotes++;

    post.userVote = voteType;
    return post;
  }

  static async toggleSavePost(postId: string): Promise<Post> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");
    post.isSaved = !post.isSaved;
    return post;
  }

  static async deletePost(postId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.posts = this.posts.filter((p) => p.id !== postId);
  }
}
