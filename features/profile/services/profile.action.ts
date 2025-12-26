"use server";
import { UserAPI } from "./profile.api";
import { serverFetch } from "@/lib/serverFetch";
import { revalidatePath } from "next/cache";
import { ProfileFormDataWithoutFiles } from "../types";

export const updateProfileAction = async (data: ProfileFormDataWithoutFiles) => {
  const response = await serverFetch(`${process.env.API_BASE_URL}${UserAPI.updateProfile}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const updatedData = await response.json();
  revalidatePath("/", "layout");

  return updatedData;
};
