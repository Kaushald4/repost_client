// Notification Service - Handles all notification-related operations
import { Notification } from "@/types";
import { mockNotifications } from "@/data/mock-data";

export class NotificationService {
  private static notifications = mockNotifications;

  static async getNotifications(): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...this.notifications].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  static async getUnreadCount(): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.notifications.filter((n) => !n.read).length;
  }

  static async markAsRead(notificationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.read = true;
    }
  }

  static async markAllAsRead(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.notifications.forEach((n) => (n.read = true));
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.notifications = this.notifications.filter(
      (n) => n.id !== notificationId
    );
  }
}
