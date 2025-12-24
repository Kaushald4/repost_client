// Notifications Page
"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {@/components/ui/avatar
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { useNotificationStore } from "@/stores/notification.store";
import { Notification } from "@/types";
import { Bell, MessageSquare, ArrowUp, AtSign, X, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "reply":
      return MessageSquare;
    case "comment":
      return MessageSquare;
    case "mention":
      return AtSign;
    case "upvote":
      return ArrowUp;
    case "message":
      return MessageSquare;
    case "community":
      return Bell;
    default:
      return Bell;
  }
};

export default function NotificationsPage() {
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your activity
          </p>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <Link
                key={notification.id}
                href={notification.link}
                onClick={() => handleNotificationClick(notification)}
              >
                <Card
                  className={cn(
                    "p-4 hover:bg-accent/50 transition-colors cursor-pointer",
                    !notification.read && "bg-primary/5 border-primary/20"
                  )}
                >
                  <div className="flex gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        !notification.read
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm">
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.content}
                      </p>

                      {notification.actor && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={notification.actor.avatar} />
                            <AvatarFallback className="text-xs">
                              {notification.actor.username
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            u/{notification.actor.username}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              You&apos;re all caught up! Check back later for updates.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
