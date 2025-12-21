// Post Store - Manages post state and feed
import { create } from "zustand";
import { Post, FeedFilter } from "@/types";
import { PostService } from "@/services/post.service";

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  filter: FeedFilter;
  isLoading: boolean;
  error: string | null;

  fetchPosts: () => Promise<void>;
  fetchPostById: (id: string) => Promise<void>;
  setFilter: (filter: Partial<FeedFilter>) => void;
  votePost: (postId: string, voteType: "up" | "down" | null) => Promise<void>;
  toggleSavePost: (postId: string) => Promise<void>;
  createPost: (postData: Partial<Post>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  currentPost: null,
  filter: { sort: "hot" },
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const posts = await PostService.getPosts(get().filter);
      set({ posts, isLoading: false });
    } catch {
      set({ error: "Failed to fetch posts", isLoading: false });
    }
  },

  fetchPostById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const post = await PostService.getPostById(id);
      set({ currentPost: post, isLoading: false });
    } catch {
      set({ error: "Failed to fetch post", isLoading: false });
    }
  },

  setFilter: (newFilter: Partial<FeedFilter>) => {
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    }));
    get().fetchPosts();
  },

  votePost: async (postId: string, voteType: "up" | "down" | null) => {
    try {
      const updatedPost = await PostService.votePost(postId, voteType);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === postId ? updatedPost : p)),
        currentPost:
          state.currentPost?.id === postId ? updatedPost : state.currentPost,
      }));
    } catch {
      set({ error: "Failed to vote" });
    }
  },

  toggleSavePost: async (postId: string) => {
    try {
      const updatedPost = await PostService.toggleSavePost(postId);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === postId ? updatedPost : p)),
        currentPost:
          state.currentPost?.id === postId ? updatedPost : state.currentPost,
      }));
    } catch {
      set({ error: "Failed to save post" });
    }
  },

  createPost: async (postData: Partial<Post>) => {
    set({ isLoading: true, error: null });
    try {
      await PostService.createPost(postData);
      await get().fetchPosts();
    } catch {
      set({ error: "Failed to create post", isLoading: false });
    }
  },

  deletePost: async (postId: string) => {
    try {
      await PostService.deletePost(postId);
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== postId),
      }));
    } catch {
      set({ error: "Failed to delete post" });
    }
  },
}));
