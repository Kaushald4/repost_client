// User Store - Manages user authentication and profile state
import { create } from "zustand";
import { User } from "@/types";
import { mockUsers } from "@/data/mock-data";

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: mockUsers[0], // Simulating logged-in user
  isAuthenticated: true,

  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = mockUsers.find((u) => u.email === email);
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
    } else {
      throw new Error("Invalid credentials");
    }
  },

  signup: async (email: string, password: string, username: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newUser: User = {
      id: Date.now().toString(),
      username,
      displayName: username,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: "New user",
      createdAt: new Date(),
      karma: 0,
      reputation: { helper: 0, debate: 0, creative: 0 },
      badges: [],
      level: 1,
      isVerified: false,
    };
    set({ currentUser: newUser, isAuthenticated: true });
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },

  updateProfile: (updates: Partial<User>) => {
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, ...updates }
        : null,
    }));
  },
}));
