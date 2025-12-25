import { serverFetch } from "@/lib/serverFetch";
import { TUserResponseWrapper } from "@/types/register";
import { UserAPI } from "./profile.api";

export class ProfileServerService {
  static readonly baseURL = process.env.API_BASE_URL;

  static getProfile = async (): Promise<TUserResponseWrapper> => {
    const response = await serverFetch(`${ProfileServerService.baseURL}${UserAPI.getProfile}`, {
      cache: "no-store",
    });
    const userData = await response.json();
    return userData as TUserResponseWrapper;
  };
}
