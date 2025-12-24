// Feed Filter Component
"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostStore } from "@/stores/post.store";
import { FeedFilter } from "@/types";

export function FeedFilters() {
  const { filter, setFilter } = usePostStore();

  const handleSortChange = (sort: FeedFilter["sort"]) => {
    setFilter({ sort });
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-card">
      <Tabs value={filter.sort} onValueChange={handleSortChange as any}>
        <TabsList>
          <TabsTrigger value="hot">🔥 Hot</TabsTrigger>
          <TabsTrigger value="new">🆕 New</TabsTrigger>
          <TabsTrigger value="top">⭐ Top</TabsTrigger>
          <TabsTrigger value="trending">📈 Trending</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
