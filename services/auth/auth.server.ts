import { AUTH_ENDPOINT } from "@/endpoint";

import {
  TLoginRequest,
  TLoginResponse,
  TRefreshResponse,
  TSignupRequest,
  TSignupResponse,
  TUserResponse,
  TUserResponseWrapper,
} from "@/types/register";
import serverAxios from "@/lib/axios/server";

class AuthService {
  async register(data: TSignupRequest): Promise<TSignupResponse> {
    const response = await serverAxios.post<TSignupResponse>(
      AUTH_ENDPOINT.REGISTER,
      data
    );
    return response.data;
  }

  async login(data: TLoginRequest): Promise<TLoginResponse> {
    const response = await serverAxios.post<TLoginResponse>(
      AUTH_ENDPOINT.LOGIN,
      data
    );
    return response.data;
  }

  async verify(): Promise<TUserResponse | null> {
    try {
      const response = await serverAxios.get<TUserResponseWrapper>(
        AUTH_ENDPOINT.USER_INFO
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(data: {
    refreshToken: string;
    refreshTokenId: string;
  }): Promise<TRefreshResponse> {
    const response = await serverAxios.post(AUTH_ENDPOINT.REFRESH, data);
    return response.data;
  }
}

export const authService = new AuthService();
