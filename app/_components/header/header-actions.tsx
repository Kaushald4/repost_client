import Link from "next/link";
import { Bell, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { useNotificationStore } from "@/stores/notification.store";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/global/theme-toggle";
import { CreatePostModal } from "@/components/create-post-modal";
import UserNav from "./user-nav";
import { Skeleton } from "@/components/ui/skeleton";

function UserNavSkeleton() {
  return <Skeleton className="h-8 w-8 rounded-full" />;
}

export function HeaderActions() {
  // const { unreadCount, fetchUnreadCount } = useNotificationStore();

  // useEffect(() => {
  //   fetchUnreadCount();
  // }, [fetchUnreadCount]);

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Search className="h-5 w-5" />
      </Button>

      <CreatePostModal />

      <Link href="/messages">
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            2
          </Badge>
        </Button>
      </Link>

      <Link href="/notifications">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {/* {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )} */}
        </Button>
      </Link>

      <ThemeToggle />

      <Suspense fallback={<UserNavSkeleton />}>
        <UserNav />
      </Suspense>
    </div>
  );
}
