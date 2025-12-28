"use client";

import { useState, useCallback } from "react";
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
import { Loader2, Settings } from "lucide-react";
import { updateCommunitySchema, UpdateCommunityFormValues } from "../schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommunityAction } from "../services/community.action";
import useUploadMutation from "@/hooks/useUploadMutation";
import { CommunityPage } from "../types";

import {
  UpdateCommunityModalProps,
  MediaState,
  MEDIA_ACTIONS,
} from "./update-community-modal/types";
import { getDefaultValues, createInitialMediaState } from "./update-community-modal/utils";
import { MediaSection } from "./update-community-modal/MediaSection";

export function UpdateCommunityModal({ community, trigger }: UpdateCommunityModalProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [iconState, setIconState] = useState<MediaState>(() =>
    createInitialMediaState(!!community.icon?.url),
  );
  const [bannerState, setBannerState] = useState<MediaState>(() =>
    createInitialMediaState(!!community.banner?.url),
  );

  const form = useForm<UpdateCommunityFormValues>({
    resolver: zodResolver(updateCommunitySchema),
    defaultValues: getDefaultValues(community),
  });

  const { isUploading, uploadMediaAsync } = useUploadMutation();

  const { mutate: updateCommunity, isPending: isUpdating } = useMutation({
    mutationFn: async (data: UpdateCommunityFormValues) =>
      updateCommunityAction(community.id, data),
    onSuccess: () => {
      toast.success("Community updated successfully");
      queryClient.invalidateQueries({ queryKey: ["community-info"] });
      queryClient.invalidateQueries({ queryKey: ["all-communities"] });
      setIsOpen(false);
    },
    onError: (error) => {
      if (error instanceof Error && error.message) {
        toast.error(error.message);
        return;
      }
      toast.error("Failed to update community");
    },
  });

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        const defaultValues = getDefaultValues(community);
        form.reset(defaultValues);
        setIconState(
          createInitialMediaState(
            !!defaultValues.icon?.url && defaultValues.icon?.action === MEDIA_ACTIONS.KEEP,
          ),
        );
        setBannerState(
          createInitialMediaState(
            !!defaultValues.banner?.url && defaultValues.banner?.action === MEDIA_ACTIONS.KEEP,
          ),
        );
      }
      setIsOpen(open);
    },
    [community, form],
  );

  async function onSubmit(values: UpdateCommunityFormValues) {
    const dataToUpdate: UpdateCommunityFormValues = {
      title: values.title,
      description: values.description,
      visibility: values.visibility,
      icon: { action: iconState.action },
      banner: { action: bannerState.action },
    };

    // Handle Icon
    if (iconState.action === MEDIA_ACTIONS.UPDATE && iconState.file) {
      const res = await uploadMediaAsync({
        file: iconState.file,
        folder: "repost_communities/icons",
      });
      if (res) {
        dataToUpdate.icon = {
          action: MEDIA_ACTIONS.UPDATE,
          fileId: res.data.publicId,
          url: res.data.url,
        };
      }
    }

    // Handle Banner
    if (bannerState.action === MEDIA_ACTIONS.UPDATE && bannerState.file) {
      const res = await uploadMediaAsync({
        file: bannerState.file,
        folder: "repost_communities/banners",
      });
      if (res) {
        dataToUpdate.banner = {
          action: MEDIA_ACTIONS.UPDATE,
          fileId: res.data.publicId,
          url: res.data.url,
        };
      }
    }

    updateCommunity(dataToUpdate);
  }

  const isPending = isUpdating || isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-131.25 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Community</DialogTitle>
          <DialogDescription>Make changes to your community settings.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      rows={4}
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

            <div className="space-y-6 pt-4 border-t">
              <h3 className="text-sm font-medium">Media Settings</h3>

              <MediaSection
                type="icon"
                mediaState={iconState}
                setMediaState={setIconState}
                existingUrl={community.icon?.url}
                hasExistingMedia={!!community.icon?.url}
              />

              <MediaSection
                type="banner"
                mediaState={bannerState}
                setMediaState={setBannerState}
                existingUrl={community.banner?.url}
                hasExistingMedia={!!community.banner?.url}
              />
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
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
