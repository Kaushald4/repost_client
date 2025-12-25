import { AUTH_ENDPOINT, USER_ENDPOINT } from "@/endpoint";

export const UserAPI = {
  getProfile: AUTH_ENDPOINT.USER_INFO,
  updateProfile: USER_ENDPOINT.UPDATE_PROFILE,
};
