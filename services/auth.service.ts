import axiosInstance from "@/lib/axios";
import { AUTH_ENDPOINT } from "@/endpoint";
import { cookieHelper } from "@/lib/cookieHelper";
import {
  TLoginRequest,
  TLoginResponse,
  TRefreshResponse,
  TSignupRequest,
  TSignupResponse,
  TUserResponse,
  TUserResponseWrapper,
} from "@/types/register";

class AuthService {
  async register(data: TSignupRequest): Promise<TSignupResponse> {
    const response = await axiosInstance.post<TSignupResponse>(
      AUTH_ENDPOINT.REGISTER,
      data
    );
    return response.data;
  }

  async login(data: TLoginRequest): Promise<TLoginResponse> {
    const response = await axiosInstance.post<TLoginResponse>(
      AUTH_ENDPOINT.LOGIN,
      data
    );
    return response.data;
  }

  async verify(): Promise<TUserResponse | null> {
    const token = cookieHelper.get("access_token");
    if (!token) {
      return null;
    }
    try {
      const response = await axiosInstance.get<TUserResponseWrapper>(
        AUTH_ENDPOINT.USER_INFO
      );
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  async refreshToken(data: {
    refreshToken: string;
    refreshTokenId: string;
  }): Promise<TRefreshResponse> {
    const response = await axiosInstance.post(AUTH_ENDPOINT.REFRESH, data);
    return response.data;
  }
}

export const authService = new AuthService();
