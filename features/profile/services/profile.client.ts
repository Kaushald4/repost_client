"use client";
import { TUserResponseWrapper } from "@/types/register";
import { UserAPI } from "./profile.api";

export class ProfileClientService {
  static baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  static async getProfile(): Promise<TUserResponseWrapper["data"]> {
    const res = await fetch(
      `${ProfileClientService.baseURL}${UserAPI.getProfile}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Unauthorized");
    }
    const json = await res.json();
    return json.data as TUserResponseWrapper["data"];
  }
}
