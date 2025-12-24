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

export class MediaService {
  static baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  static upload = async (
    file: File,
    folder: string = "communities"
  ): Promise<TUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/media/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = await response.json();
    return data;
  };
}
