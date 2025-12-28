"use client";

import { TAllCommunityResponse, CommunityInfoData } from "../types";
import { CommunityAPI } from "./community.api";

export class CommunityClientService {
  static baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  static async getAllCommunities(): Promise<TAllCommunityResponse["data"]> {
    const res = await fetch(`${CommunityClientService.baseURL}${CommunityAPI.getAllCommunities}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Unauthorized");
    }
    const json = await res.json();
    return json.data as TAllCommunityResponse["data"];
  }

  static async getCommunityInfo(communityName: string): Promise<CommunityInfoData> {
    const res = await fetch(
      `${CommunityClientService.baseURL}${CommunityAPI.getCommunityInfo}/${communityName}`,
      {
        credentials: "include",
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch community info");
    }
    const json = await res.json();
    return json.data as CommunityInfoData;
  }

  static async updateCommunity(
    communityId: string,
    data: {
      title?: string;
      description?: string;
      visibility?: string;
      icon?: {
        action: "keep" | "update" | "delete";
        url?: string;
        fileId?: string;
        previewUrl?: string;
      };
      banner?: {
        action: "keep" | "update" | "delete";
        url?: string;
        fileId?: string;
        previewUrl?: string;
      };
    },
  ): Promise<{ success: boolean; message?: string; data?: CommunityInfoData }> {
    const res = await fetch(
      `${CommunityClientService.baseURL}${CommunityAPI.updateCommunity}/${communityId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to update community");
    }
    const json = await res.json();
    return json;
  }
}
