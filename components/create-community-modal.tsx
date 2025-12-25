"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useCommunityStore } from "@/stores/community.store";
import { toast } from "sonner";
import { Loader2, Plus, Upload } from "lucide-react";
// import { MediaService } from "@/services/media/media.action";

const communityFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(21, "Name must be at most 21 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Name can only contain letters, numbers, and underscores"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  icon: z.string().optional(),
  banner: z.string().optional(),
});

export function CreateCommunityModal() {
  const router = useRouter();
  const { createCommunity } = useCommunityStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof communityFormSchema>>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      title: "",
      description: "",
      icon: "",
      banner: "",
    },
  });

  async function onSubmit(values: z.infer<typeof communityFormSchema>) {
    setIsLoading(true);
    // try {
    //   let iconUrl = values.icon;
    //   let bannerUrl = values.banner;

    //   if (iconFile) {
    //     const res = await MediaService.upload(iconFile, "repost_communities/icons");
    //     if (res.success) {
    //       iconUrl = res.url;
    //     } else {
    //       toast.error("Failed to upload icon");
    //       return;
    //     }
    //   }

    //   if (bannerFile) {
    //     const res = await MediaService.upload(bannerFile, "repost_communities/banners");
    //     if (res.success) {
    //       bannerUrl = res.url;
    //     } else {
    //       toast.error("Failed to upload banner");
    //       return;
    //     }
    //   }

    //   await createCommunity({
    //     name: values.name,
    //     title: values.title,
    //     description: values.description,
    //     displayName: values.title,
    //     icon: iconUrl,
    //     banner: bannerUrl,
    //   });
    //   toast.success(`r/${values.name} created successfully`);
    //   setIsOpen(false);
    //   form.reset();
    //   setIconFile(null);
    //   setBannerFile(null);
    //   router.push(`/r/${values.name}`);
    // } catch {
    //   toast.error("Failed to create community");
    // } finally {
    //   setIsLoading(false);
    // }
  }

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
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Community
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
