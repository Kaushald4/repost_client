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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Settings, X, Upload } from "lucide-react";
import { updateCommunitySchema, UpdateCommunityFormValues } from "../schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommunityAction } from "../services/community.action";
import useUploadMutation from "@/hooks/useUploadMutation";
import { CommunityPage } from "../types";
import Image from "next/image";

interface UpdateCommunityModalProps {
  community: CommunityPage;
  trigger?: React.ReactNode;
}

const MEDIA_ACTIONS = {
  KEEP: "keep" as const,
  UPDATE: "update" as const,
  DELETE: "delete" as const,
} as const;

type MediaActionType = "keep" | "update" | "delete";

interface MediaState {
  action: MediaActionType;
  file: File | null;
}

function getValidVisibility(visibility: string): "PUBLIC" | "RESTRICTED" | "PRIVATE" {
  if (visibility === "PUBLIC" || visibility === "RESTRICTED" || visibility === "PRIVATE") {
    return visibility;
  }
  return "PUBLIC";
}

function getDefaultValues(community: CommunityPage): UpdateCommunityFormValues {
  return {
    title: community.title || "",
    description: community.description || "",
    visibility: getValidVisibility(community.visibility || "PUBLIC"),
    icon: {
      action: community.icon?.url ? MEDIA_ACTIONS.KEEP : MEDIA_ACTIONS.UPDATE,
      url: community.icon?.url || "",
      fileId: community.icon?.fileId || "",
      previewUrl: community.icon?.url || "",
    },
    banner: {
      action: community.banner?.url ? MEDIA_ACTIONS.KEEP : MEDIA_ACTIONS.UPDATE,
      url: community.banner?.url || "",
      fileId: community.banner?.fileId || "",
      previewUrl: community.banner?.url || "",
    },
  };
}

interface MediaSectionProps {
  type: "icon" | "banner";
  mediaState: MediaState;
  setMediaState: React.Dispatch<React.SetStateAction<MediaState>>;
  existingUrl?: string;
  hasExistingMedia: boolean;
}

function MediaSection({
  type,
  mediaState,
  setMediaState,
  existingUrl,
  hasExistingMedia,
}: MediaSectionProps) {
  const { action, file } = mediaState;

  // Determine what to show:
  // - If action is DELETE, show nothing (removed)
  // - If there's a new file uploaded, show the file preview
  // - If there's existing media and action is KEEP, show existing media
  // - If no existing media, show upload area
  const shouldShowPreview = action !== MEDIA_ACTIONS.DELETE && (file || existingUrl);
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;
  const isRemoved = action === MEDIA_ACTIONS.DELETE;

  const handleFileChange = useCallback(
    (newFile: File | null) => {
      if (newFile) {
        setMediaState({ action: MEDIA_ACTIONS.UPDATE, file: newFile });
      }
    },
    [setMediaState],
  );

  const handleRemove = useCallback(() => {
    setMediaState({ action: MEDIA_ACTIONS.DELETE, file: null });
  }, [setMediaState]);

  return (
    <div className="space-y-3">
      <FormLabel className="capitalize">{type}</FormLabel>

      {/* Preview with remove button */}
      {shouldShowPreview && (
        <div
          className={`relative ${type === "banner" ? "h-32" : "w-20 h-20"} rounded-lg overflow-hidden bg-muted border group`}
        >
          <Image
            fill
            src={previewUrl ?? ""}
            alt={`${type} preview`}
            className={`w-full h-full object-cover ${type === "banner" ? "" : "rounded-full"}`}
          />
          {/* Remove button overlay */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-background/90 hover:bg-background rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            title={`Remove ${type}`}
          >
            <X className="h-4 w-4 text-destructive" />
          </button>
        </div>
      )}

      {/* Upload area - always show when no preview or after removal */}
      {!shouldShowPreview && (
        <div className="flex items-center gap-2">
          <Label
            htmlFor={`${type}-upload`}
            className="flex items-center gap-2 cursor-pointer px-4 py-2 border-2 border-dashed border-border hover:border-primary rounded-lg transition-colors"
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isRemoved ? `Upload new ${type}` : `Upload ${type}`}
            </span>
          </Label>
          <Input
            id={`${type}-upload`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileChange(selectedFile);
            }}
          />
        </div>
      )}

      {/* Show filename when file is uploaded but not removed */}
      {file && action === MEDIA_ACTIONS.UPDATE && (
        <p className="text-xs text-muted-foreground">Selected: {file.name}</p>
      )}

      {/* Show message when media was removed */}
      {isRemoved && hasExistingMedia && (
        <p className="text-xs text-destructive">{type} will be removed on save</p>
      )}
    </div>
  );
}

export function UpdateCommunityModal({ community, trigger }: UpdateCommunityModalProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [iconState, setIconState] = useState<MediaState>(() => ({
    action: community.icon?.url ? MEDIA_ACTIONS.KEEP : MEDIA_ACTIONS.UPDATE,
    file: null,
  }));
  const [bannerState, setBannerState] = useState<MediaState>(() => ({
    action: community.banner?.url ? MEDIA_ACTIONS.KEEP : MEDIA_ACTIONS.UPDATE,
    file: null,
  }));

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
        setIconState({
          action: defaultValues.icon?.action || MEDIA_ACTIONS.UPDATE,
          file: null,
        });
        setBannerState({
          action: defaultValues.banner?.action || MEDIA_ACTIONS.UPDATE,
          file: null,
        });
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
