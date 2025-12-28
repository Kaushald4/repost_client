"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TabType = "posts" | "about" | "members" | "moderation";

interface CommunityInfoTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  showModerationTab?: boolean;
}

export const CommunityInfoTabs = ({
  activeTab,
  onTabChange,
  showModerationTab = false,
}: CommunityInfoTabsProps) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: "posts", label: "Posts" },
    { id: "about", label: "About" },
    { id: "members", label: "Members" },
  ];

  // Only add moderation tab if showModerationTab is true
  if (showModerationTab) {
    tabs.push({ id: "moderation", label: "Moderation" });
  }

  return (
    <div className="border-b">
      <div className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={cn(
              "py-3 px-1 border-b-2 border-transparent text-muted-foreground whitespace-nowrap",
              activeTab === tab.id && "border-primary text-primary",
            )}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
