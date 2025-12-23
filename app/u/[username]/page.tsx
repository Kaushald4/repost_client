"use client";

import { use } from "react";
import { AppLayout } from "@/components/app-layout";
import { PostCard } from "@/components/post-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers, mockPosts } from "@/data/mock-data";
import { MessageSquare, Cake, Award, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { UpdateProfileDialog } from "@/components/profile/update-profile-dialog";
import {
  ProfileFormData,
  ProfileFormDataWithoutFiles,
} from "@/types/profileTypes";
import { MediaService } from "@/services/media.service";
import { ProfileService } from "@/services/profile.service";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  // Find user by username
  const user = mockUsers.find((u) => u.username === username) || mockUsers[0];
  const userPosts = mockPosts.filter((p) => p.author.id === user.id);

  const handleSave = async (data: ProfileFormData) => {
    const { avatar, banner, ...otherData } = data;

    const dataToUpdate: Record<string, unknown> = { ...otherData };

    if (data.avatar.file && data.banner.file) {
      const responses = await Promise.all([
        MediaService.upload(data.avatar.file, "avatars"),
        MediaService.upload(data.banner.file, "banners"),
      ]);
      dataToUpdate["avatar"] = {
        fileId: responses[0].data.publicId,
        url: responses[0].data.url,
      };
      dataToUpdate["banner"] = {
        fileId: responses[1].data.publicId,
        url: responses[1].data.url,
      };
    } else if (data.avatar.file) {
      const response = await MediaService.upload(data.avatar.file, "avatars");
      dataToUpdate["avatar"] = {
        fileId: response.data.publicId,
        url: response.data.url,
      };
    } else if (data.banner.file) {
      const response = await MediaService.upload(data.banner.file, "banners");
      dataToUpdate["banner"] = {
        fileId: response.data.publicId,
        url: response.data.url,
      };
    }

    ProfileService.updateProfile(dataToUpdate as ProfileFormDataWithoutFiles)
      .then(() => {
        console.log("Profile updated successfully");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-linear-to-r from-primary/20 to-primary/10" />

          <div className="p-6">
            <div className="flex items-start gap-6 -mt-16 mb-4">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={user.avatar.url} />
                <AvatarFallback className="text-2xl">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 mt-12">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">{user.displayName}</h1>
                      {user.isVerified && (
                        <Badge variant="secondary">✓ Verified</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">u/{user.username}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    <UpdateProfileDialog
                      username={user.username}
                      displayName={user.displayName}
                      avatar={user.avatar}
                      banner={user.banner}
                      bio={user.bio}
                      isPrivate={user.isPrivate}
                      darkMode={false} // Assuming default
                      allowDMs={true} // Assuming default
                      onSave={(data) => handleSave(data)}
                    />
                  </div>
                </div>

                {user.bio && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {user.bio}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Cake className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold text-foreground">
                      {user.karma.toLocaleString()}
                    </span>
                    <span>karma</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="posts">
              <TabsList className="w-full">
                <TabsTrigger value="posts" className="flex-1">
                  Posts
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex-1">
                  Comments
                </TabsTrigger>
                <TabsTrigger value="about" className="flex-1">
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4 mt-4">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">No posts yet</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No comments yet</p>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="mt-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">About</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bio</p>
                      <p className="text-sm">{user.bio || "No bio yet"}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Account Created
                      </p>
                      <p className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats Card */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Statistics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Karma</span>
                    <span className="font-semibold">
                      {user.karma.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Level</span>
                    <Badge variant="secondary">{user.level}</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reputation Card */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Reputation</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Helper</span>
                    <span className="text-sm font-semibold">
                      {user.stats.helper}
                    </span>
                  </div>
                  <Progress value={user.stats.helper} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Debate</span>
                    <span className="text-sm font-semibold">
                      {user.stats.debate}
                    </span>
                  </div>
                  <Progress value={user.stats.debate} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Creative</span>
                    <span className="text-sm font-semibold">
                      {user.stats.creative}
                    </span>
                  </div>
                  <Progress value={user.stats.creative} />
                </div>
              </div>
            </Card>

            {/* Badges Card */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <Badge key={badge.id} variant="outline">
                    {badge.badgeName}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
