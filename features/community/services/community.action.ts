"use server";

import { serverFetch } from "@/lib/serverFetch";
import { CommunityFormValues } from "../schema";
import { CommunityAPI } from "./community.api";

export const createCommunityAction = async (data: CommunityFormValues) => {
  const resposne = await serverFetch(`${process.env.API_BASE_URL}${CommunityAPI.createCommunity}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  const responseData = await resposne.json();
  return responseData;
};
