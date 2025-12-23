import axiosInstance from "@/lib/axios";

export interface TUploadResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TUploadData;
  timestamp: string;
}

export interface TUploadData {
  url: string;
  publicId: string;
  success: boolean;
  message: string;
}

export const MediaService = {
  upload: async (
    file: File,
    folder: string = "communities"
  ): Promise<TUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await axiosInstance.post<TUploadResponse>(
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
