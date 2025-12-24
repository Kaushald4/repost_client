import { USER_ENDPOINT } from "@/endpoint";
import { serverFetch } from "@/lib/serverFetch";
import { ProfileFormDataWithoutFiles } from "@/types/profileTypes";
import { TUserResponseWrapper } from "@/types/register";
import { UserAPI } from "./profile.api";

export class ProfileServerService {
  static readonly baseURL = process.env.API_BASE_URL;

  static updateProfile = async (data: ProfileFormDataWithoutFiles) => {
    const response = await serverFetch(USER_ENDPOINT.UPDATE_PROFILE, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const updatedData = await response.json();
    return updatedData;
  };

  static getProfile = async (): Promise<TUserResponseWrapper> => {
    const response = await serverFetch(`${ProfileServerService.baseURL}${UserAPI.getProfile}`, {
      cache: "no-store",
    });
    const userData = await response.json();
    return userData as TUserResponseWrapper;
  };
}
