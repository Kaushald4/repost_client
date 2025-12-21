// Notification Store - Manages notification state
import { create } from "zustand";
import { Notification } from "@/types";
import { NotificationService } from "@/services/notification.service";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const notifications = await NotificationService.getNotifications();
      set({ notifications, isLoading: false });
      get().fetchUnreadCount();
    } catch {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const unreadCount = await NotificationService.getUnreadCount();
      set({ unreadCount });
    } catch {
      // Silent fail
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
      get().fetchUnreadCount();
    } catch {
      // Silent fail
    }
  },

  markAllAsRead: async () => {
    try {
      await NotificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch {
      // Silent fail
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      set((state) => ({
        notifications: state.notifications.filter(
          (n) => n.id !== notificationId
        ),
      }));
      get().fetchUnreadCount();
    } catch {
      // Silent fail
    }
  },
}));
