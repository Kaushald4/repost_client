"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostStore } from "@/stores/post.store";
import { useCommunityStore } from "@/stores/community.store";
import { useUserStore } from "@/stores/user.store";
import {
  FileText,
  Image as ImageIcon,
  BarChart3,
  Loader2,
  Plus,
} from "lucide-react";
import { Post } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreatePostModalProps {
  children?: React.ReactNode;
  defaultCommunityId?: string;
}

export function CreatePostModal({
  children,
  defaultCommunityId,
}: CreatePostModalProps) {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { joinedCommunities, fetchJoinedCommunities } = useCommunityStore();
  const { createPost } = usePostStore();

  const [isOpen, setIsOpen] = useState(false);
  const [postType, setPostType] = useState<"text" | "image" | "poll">("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [communityId, setCommunityId] = useState(defaultCommunityId || "");
  const [flair, setFlair] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Poll specific
  const [pollOptions, setPollOptions] = useState(["", ""]);

  useEffect(() => {
    if (isOpen) {
      fetchJoinedCommunities();
      if (defaultCommunityId) {
        setCommunityId(defaultCommunityId);
      }
    }
  }, [isOpen, fetchJoinedCommunities, defaultCommunityId]);

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCommunityId("");
    setFlair("");
    setIsAnonymous(false);
    setPostType("text");
    setPollOptions(["", ""]);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !communityId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (postType === "text" && !content.trim()) {
      toast.error("Please add content to your post");
      return;
    }

    if (postType === "poll" && pollOptions.filter((o) => o.trim()).length < 2) {
      toast.error("Please add at least 2 poll options");
      return;
    }

    setIsSubmitting(true);

    try {
      const community = joinedCommunities.find((c) => c.id === communityId);
      if (!community || !currentUser) return;

      const postData: Partial<Post> = {
        title,
        content: postType === "text" ? content : "",
        type: postType,
        author: currentUser,
        community,
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        views: 0,
        createdAt: new Date(),
        isAnonymous,
        flair,
      };

      if (postType === "poll") {
        postData.poll = {
          options: pollOptions
            .filter((o) => o.trim())
            .map((text, id) => ({ id, text, votes: 0 })),
          totalVotes: 0,
        };
      }

      await createPost(postData);
      toast.success("Post created successfully");
      setIsOpen(false);
      resetForm();
      router.push("/");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>
            Share your thoughts with the community.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6 pt-2">
          <div className="space-y-6">
            {/* Community Selection */}
            <div className="space-y-2">
              <Label htmlFor="community">Choose a community *</Label>
              <Select value={communityId} onValueChange={setCommunityId}>
                <SelectTrigger id="community">
                  <SelectValue placeholder="Select a community" />
                </SelectTrigger>
                <SelectContent>
                  {joinedCommunities.map((community) => (
                    <SelectItem key={community.id} value={community.id}>
                      r/{community.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Post Type Tabs */}
            <Tabs value={postType} onValueChange={(v: any) => setPostType(v)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">
                  <FileText className="mr-2 h-4 w-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="image">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="poll">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Poll
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="An interesting title for your post"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {title.length}/300
                  </p>
                </div>

                {/* Text Post */}
                <TabsContent value="text" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      placeholder="Share your thoughts..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-40"
                    />
                  </div>
                </TabsContent>

                {/* Image Post */}
                <TabsContent value="image" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label>Upload Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-12 text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop or click to upload
                      </p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageCaption">Caption (optional)</Label>
                    <Textarea
                      id="imageCaption"
                      placeholder="Add a caption to your image..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-20"
                    />
                  </div>
                </TabsContent>

                {/* Poll Post */}
                <TabsContent value="poll" className="space-y-4 mt-0">
                  <div className="space-y-3">
                    <Label>Poll Options *</Label>
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) =>
                            handlePollOptionChange(index, e.target.value)
                          }
                        />
                        {pollOptions.length > 2 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemovePollOption(index)}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 6 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddPollOption}
                      >
                        Add Option
                      </Button>
                    )}
                  </div>
                </TabsContent>

                {/* Flair */}
                <div className="space-y-2">
                  <Label htmlFor="flair">Flair (optional)</Label>
                  <Select value={flair} onValueChange={setFlair}>
                    <SelectTrigger id="flair">
                      <SelectValue placeholder="Select a flair" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Discussion">Discussion</SelectItem>
                      <SelectItem value="Question">Question</SelectItem>
                      <SelectItem value="Showcase">Showcase</SelectItem>
                      <SelectItem value="Tutorial">Tutorial</SelectItem>
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Debate">Debate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Post Anonymously</Label>
                    <p className="text-xs text-muted-foreground">
                      Hide your username on this post
                    </p>
                  </div>
                  <Switch
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>
              </div>
            </Tabs>
          </div>
        </ScrollArea>

        <div className="p-6 pt-2 border-t flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
