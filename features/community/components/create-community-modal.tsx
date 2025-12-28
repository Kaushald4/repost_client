"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { communityFormSchema, CommunityFormValues } from "../schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommunityAction } from "../services/community.action";
import useUploadMutation from "@/hooks/useUploadMutation";

export function CreateCommunityModal() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      title: "",
      description: "",
      visibility: "PUBLIC",
      icon: {
        fileId: "",
        url: "",
        previewUrl: "",
      },
      banner: {
        fileId: "",
        url: "",
        previewUrl: "",
      },
    },
  });

  const { isUploading, uploadMediaAsync } = useUploadMutation();

  const { mutate: createCommunity, isPending: isCreating } = useMutation({
    mutationFn: async (data: CommunityFormValues) => createCommunityAction(data),
    onSuccess: (data) => {
      toast.success(`r/ created successfully`);
      queryClient.invalidateQueries({ queryKey: ["all-communities"] });
      setIconFile(null);
      setBannerFile(null);
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.log(error, error instanceof Error, "ERROR");
      if (error instanceof Error && error.message) {
        toast.error(error.message);
        return;
      }
      toast.error("Failed to create community");
    },
  });

  async function onSubmit(values: CommunityFormValues) {
    const { banner, icon, ...otherValues } = values;
    const dataToCreate: Partial<CommunityFormValues> = { ...otherValues };

    // Handle File Uploads
    if (iconFile) {
      const res = await uploadMediaAsync({ file: iconFile, folder: "repost_communities/icons" });
      if (res) {
        dataToCreate["icon"] = {
          fileId: res.data.publicId,
          url: res.data.url,
        };
      }
    }
    if (bannerFile) {
      const res = await uploadMediaAsync({
        file: bannerFile,
        folder: "repost_communities/banners",
      });
      if (res) {
        dataToCreate["banner"] = {
          fileId: res.data.publicId,
          url: res.data.url,
        };
      }
    }

    createCommunity(dataToCreate as CommunityFormValues);
  }

  const isPending = isCreating || isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Community</DialogTitle>
          <DialogDescription>Build a new home for your interests.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">r/</span>
                      <Input className="pl-7" placeholder="community_name" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Community names including capitalization cannot be changed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Community Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your community"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select community visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public - Anyone can join</SelectItem>
                      <SelectItem value="RESTRICTED">
                        Restricted - Visible, join requires approval
                      </SelectItem>
                      <SelectItem value="PRIVATE">Private - Invite only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Control who can view and join your community</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setIconFile(file);
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                </FormControl>
                {iconFile && (
                  <p className="text-xs text-muted-foreground truncate">{iconFile.name}</p>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Banner</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setBannerFile(file);
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                </FormControl>
                {bannerFile && (
                  <p className="text-xs text-muted-foreground truncate">{bannerFile.name}</p>
                )}
              </FormItem>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Community
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
