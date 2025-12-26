"use client";

import { TAllCommunityResponse } from "@/features/community/types";
import { useQuery } from "@tanstack/react-query";

type Props = {
  initialData: TAllCommunityResponse["data"];
};

const SidebarCommunitiesList = ({ initialData }: Props) => {
  const { data } = useQuery({ queryKey: ["all-communities"], initialData });
  console.log(data);
  return (
    <div>
      <div className="space-y-1">
        {/* {joinedCommunities.map((community) => (
              <Link key={community.id} href={`/r/${community.name}`}>
                <Button
                  variant={pathname === `/r/${community.name}` ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs">
                      {community.icon || community.displayName.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">r/{community.name}</span>
                </Button>
              </Link>
            ))} */}
      </div>

      {/* {joinedCommunities.length === 0 && (
            <div className="px-3 py-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">No communities yet</p>
              <Link href="/explore">
                <Button variant="outline" size="sm">
                  Explore Communities
                </Button>
              </Link>
            </div>
          )} */}
    </div>
  );
};

export default SidebarCommunitiesList;
