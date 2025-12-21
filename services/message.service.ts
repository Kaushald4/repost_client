// Message Service - Handles all messaging-related operations
import { Conversation, Message } from "@/types";
import { mockConversations, mockUsers } from "@/data/mock-data";

export class MessageService {
  private static conversations = mockConversations;
  private static messages: Record<string, Message[]> = {};

  static async getConversations(): Promise<Conversation[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...this.conversations].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  static async getMessages(conversationId: string): Promise<Message[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.messages[conversationId] || [];
  }

  static async sendMessage(
    conversationId: string,
    content: string
  ): Promise<Message> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newMessage: Message = {
      id: `m${Date.now()}`,
      content,
      sender: mockUsers[0], // Current user
      recipientId: "2",
      conversationId,
      createdAt: new Date(),
      read: false,
      type: "text",
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(newMessage);

    // Update conversation
    const conversation = this.conversations.find(
      (c) => c.id === conversationId
    );
    if (conversation) {
      conversation.lastMessage = newMessage;
      conversation.updatedAt = new Date();
    }

    return newMessage;
  }

  static async markConversationAsRead(conversationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const conversation = this.conversations.find(
      (c) => c.id === conversationId
    );
    if (conversation) {
      conversation.unreadCount = 0;
    }
  }

  static async getTotalUnreadCount(): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  }
}
