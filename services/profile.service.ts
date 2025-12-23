import { USER_ENDPOINT } from "@/endpoint";
import axiosInstance from "@/lib/axios";
import { ProfileFormDataWithoutFiles } from "@/types/profileTypes";

export class ProfileService {
  static updateProfile = async (data: ProfileFormDataWithoutFiles) => {
    const response = await axiosInstance.patch(
      USER_ENDPOINT.UPDATE_PROFILE,
      data
    );
    return response.data;
  };
}
