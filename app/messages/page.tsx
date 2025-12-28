"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageService } from "@/services/message.service";
import { Conversation, Message } from "@/types";
import { MessageSquare, Send, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadConversations = async () => {
    const convs = await MessageService.getConversations();
    setConversations(convs);
    if (convs.length > 0 && !selectedConversation) {
      setSelectedConversation(convs[0]);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const msgs = await MessageService.getMessages(conversationId);
    setMessages(msgs);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      MessageService.markConversationAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await MessageService.sendMessage(selectedConversation.id, newMessage);
      setNewMessage("");
      await loadMessages(selectedConversation.id);
      await loadConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some(
      (p) =>
        p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  const otherParticipant = selectedConversation?.participants[1];

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <Card className="w-80 border-r rounded-none flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => {
              const otherUser = conversation.participants[1];
              return (
                <Button
                  key={conversation.id}
                  variant={selectedConversation?.id === conversation.id ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex gap-3 w-full items-start">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          typeof otherUser.avatar === "string"
                            ? otherUser.avatar
                            : otherUser.avatar?.url || ""
                        }
                      />
                      <AvatarFallback>
                        {otherUser.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm truncate">
                          {otherUser.displayName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge className="h-5 px-1.5 text-xs">{conversation.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </Card>

      {/* Messages View */}
      {selectedConversation && otherParticipant ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={
                    typeof otherParticipant.avatar === "string"
                      ? otherParticipant.avatar
                      : otherParticipant.avatar?.url || ""
                  }
                />
                <AvatarFallback>
                  {otherParticipant.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{otherParticipant.displayName}</h3>
                <p className="text-sm text-muted-foreground">u/{otherParticipant.username}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => {
                  const isOwn = message.sender.id === "1"; // Current user
                  return (
                    <div key={message.id} className={cn("flex gap-3", isOwn && "flex-row-reverse")}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            typeof message.sender.avatar === "string"
                              ? message.sender.avatar
                              : message.sender.avatar?.url || ""
                          }
                        />
                        <AvatarFallback className="text-xs">
                          {message.sender.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className={cn("flex flex-col max-w-[70%]", isOwn && "items-end")}>
                        <div
                          className={cn(
                            "rounded-lg p-3",
                            isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
            <p className="text-muted-foreground">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
