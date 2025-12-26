"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, TrendingUp, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCommunityStore } from "@/stores/community.store";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreateCommunityModal } from "@/features/community/components/create-community-modal";
import SidebarCommunitiesList from "@/components/global/SidebarCommunitiesList";
import { TAllCommunityResponse } from "@/features/community/types";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

type Props = {
  initialData: TAllCommunityResponse["data"];
};

const SidebarShell = ({ initialData }: Props) => {
  const pathname = usePathname();
  const { joinedCommunities, fetchJoinedCommunities } = useCommunityStore();

  useEffect(() => {
    fetchJoinedCommunities();
  }, [fetchJoinedCommunities]);

  return (
    <div className="flex h-full flex-col border-r bg-background">
      {/* <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            R
          </div>
          <span className="font-bold text-xl">Repost</span>
        </Link>
      </div> */}

      <ScrollArea className="flex-1 px-3 pt-6">
        <div className="space-y-1 pb-4">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="pb-4">
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Your Communities</h3>
            <CreateCommunityModal />
          </div>

          <SidebarCommunitiesList initialData={initialData} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="h-5 w-5" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SidebarShell;
