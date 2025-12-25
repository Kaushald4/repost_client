"use client";

import { uploadMediaAction } from "@/features/mediaUploads";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUploadMutation = () => {
  const { isPending, mutate, mutateAsync } = useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder: string }) =>
      uploadMediaAction(file, folder),
    onError: (error) => {
      toast.error("Failed to upload media");
      console.log(error);
    },
  });

  const uploadMedia = ({ file, folder }: { file: File; folder: string }) => {
    mutate({ file, folder });
  };
  const uploadMediaAsync = async ({ file, folder }: { file: File; folder: string }) => {
    return await mutateAsync({ file, folder });
  };
  return {
    isUploading: isPending,
    uploadMedia,
    uploadMediaAsync,
  };
};
export default useUploadMutation;
