"use client";

import { UpdateProfileDialog } from "@/components/profile/update-profile-dialog";
import { MediaService } from "@/services/media/media.client";
import {
  ProfileFormData,
  ProfileFormDataWithoutFiles,
} from "@/types/profileTypes";
import { TUserResponseWrapper } from "@/types/register";

type UpdateProfileFormProps = {
  user: TUserResponseWrapper["data"];
};
const UpdateProfileForm = ({ user }: UpdateProfileFormProps) => {
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

    // ProfileService.updateProfile(dataToUpdate as ProfileFormDataWithoutFiles)
    //   .then(() => {
    //     console.log("Profile updated successfully");
    //   })
    //   .catch((error) => {
    //     console.error("Error updating profile:", error);
    //   });
  };

  return (
    <UpdateProfileDialog
      username={user.username}
      displayName={user.displayName}
      avatar={user.avatar}
      banner={user.avatar}
      bio={user.bio}
      isPrivate={user.isPrivate}
      darkMode={false} // Assuming default
      allowDMs={true} // Assuming default
      onSave={(data) => handleSave(data)}
    />
  );
};

export default UpdateProfileForm;
