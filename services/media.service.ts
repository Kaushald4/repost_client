import axiosInstance from "@/lib/axios";

export interface UploadResponse {
  url: string;
  publicId: string;
  success: boolean;
  message: string;
}

export const MediaService = {
  upload: async (
    file: File,
    folder: string = "communities"
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await axiosInstance.post<UploadResponse>(
      "/media/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
