import { PostCard } from "@/components/post-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers, mockPosts } from "@/data/mock-data";
import { Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

import ProfileCard from "../../../features/profile/components/ProfileCard";
import { getServerCachedProfile } from "@/features/profile/services/profile.cache";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const username = (await params).username;

  const userData = await getServerCachedProfile();
  // Find user by username
  const user = mockUsers.find((u) => u.username === username) || mockUsers[0];
  const userPosts = mockPosts.filter((p) => p.author.id === user.id);

  if (!userData || !userData.success) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-muted-foreground">You need to be logged in to view profiles.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden py-0">
        <ProfileCard initialData={userData.data} />
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
                userPosts.map((post) => <PostCard key={post.id} post={post} />)
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
                    <p className="text-sm text-muted-foreground mb-1">Account Created</p>
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
                  <span className="font-semibold">{user.karma.toLocaleString()}</span>
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
                  <span className="text-sm font-semibold">{user.stats?.helper || 0}</span>
                </div>
                <Progress value={user.stats?.helper || 0} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Debate</span>
                  <span className="text-sm font-semibold">{user.stats?.debate || 0}</span>
                </div>
                <Progress value={user.stats?.debate || 0} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Creative</span>
                  <span className="text-sm font-semibold">{user.stats?.creative || 0}</span>
                </div>
                <Progress value={user.stats?.creative || 0} />
              </div>
            </div>
          </Card>

          {/* Badges Card */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {user.badges?.map((badge) => (
                <Badge key={badge.badgeName} variant="outline">
                  {badge.badgeName}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
