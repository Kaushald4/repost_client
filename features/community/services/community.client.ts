"use client";

import { TAllCommunityResponse, TCommunityInfoResponse, CommunityInfoData } from "../types";
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
}
