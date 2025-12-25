"use server";

import { serverFetch } from "@/lib/serverFetch";

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

export const uploadMediaAction = async (file: File, folder: string = "communities") => {
  // try {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const response = await serverFetch(`${process.env.API_BASE_URL}${"/media/upload"}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await response.json();
  return data;
  // return { success: true, data };
  // } catch (error) {
  //   return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  // }
};
