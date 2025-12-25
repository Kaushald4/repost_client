"use client";

import { UpdateProfileDialog } from "@/components/profile/update-profile-dialog";
import { resolveMediaCommand } from "@/lib/mediaUtils";
import { uploadMediaAction } from "@/services/media/media.action";
import { updateProfileAction } from "@/services/profile/profile.action";
import { UpdateProfileFormProps } from "@/types/mediaTypes";
import { ProfileFormData, ProfileFormDataWithoutFiles } from "@/types/profileTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const UpdateProfileForm = ({ user }: UpdateProfileFormProps) => {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isProfileUpdating } = useMutation({
    mutationFn: async (data: ProfileFormDataWithoutFiles) => updateProfileAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    },
  });

  const { mutateAsync: uploadMedia, isPending: isMediaUploading } = useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder: string }) =>
      uploadMediaAction(file, folder),
    onError: (error) => {
      console.log(error);
      toast.error("Failed to upload media. Please try again.");
    },
  });

  const isPending = isProfileUpdating || isMediaUploading;

  const handleSave = async (data: ProfileFormData) => {
    const { avatar, banner, ...rest } = data;

    const payload: Record<string, unknown> = { ...rest };

    // Avatar
    if (avatar.file) {
      const res = await uploadMedia({ file: avatar.file, folder: "avatars" });
      payload.avatar = {
        action: "upsert",
        fileId: res.data.publicId,
        url: res.data.url,
      };
    } else {
      payload.avatar = resolveMediaCommand(avatar, user.avatar ?? undefined);
    }

    // Banner
    if (banner.file) {
      const res = await uploadMedia({ file: banner.file, folder: "banners" });
      payload.banner = {
        action: "upsert",
        fileId: res.data.publicId,
        url: res.data.url,
      };
    } else {
      payload.banner = resolveMediaCommand(banner, user.banner ?? undefined);
    }
    console.log(payload, "payload");
    updateProfile(payload as ProfileFormDataWithoutFiles);
  };

  return (
    <UpdateProfileDialog
      username={user.username}
      displayName={user.displayName}
      avatar={user.avatar ?? { fileId: "", url: "" }}
      banner={user.banner ?? { fileId: "", url: "" }}
      bio={user.bio}
      isPrivate={user.isPrivate}
      darkMode={false} // TODO: fetch from user settings
      allowDMs={true} // TODO: fetch from user settings
      onSave={(data) => handleSave(data)}
      isPending={isPending}
    />
  );
};

export default UpdateProfileForm;
