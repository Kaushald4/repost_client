import React from "react";

export const CommunityHeader = () => {
  return (
    <div>
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
      {/* <div className="relative -mt-20 mb-6">
        <div className="flex items-end gap-4 mb-4">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarFallback className="text-3xl">
              {currentCommunity.icon || currentCommunity.displayName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-bold mb-1">{currentCommunity.displayName}</h1>
            <p className="text-muted-foreground">r/{currentCommunity.name}</p>
          </div>
          <div className="pb-2 flex gap-2">
            <Button onClick={handleJoinToggle}>
              {currentCommunity.isJoined ? "Joined" : "Join Community"}
            </Button>
            {currentCommunity.isJoined && (
              <CreatePostModal defaultCommunityId={currentCommunity.id}>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </CreatePostModal>
            )}
          </div>
        </div>

        <p className="text-muted-foreground mb-4">{currentCommunity.description}</p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="font-semibold">{currentCommunity.memberCount.toLocaleString()}</span>
            <span className="text-muted-foreground">members</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="text-muted-foreground">
              Created {new Date(currentCommunity.createdAt).toLocaleDateString()}
            </span>
          </div>
          <Badge variant="secondary">Health Score: {currentCommunity.healthScore}</Badge>
        </div>
      </div> */}
    </div>
  );
};
