import axios from "axios";
import { cookieHelper } from "./cookieHelper";
import { AUTH_ENDPOINT } from "@/endpoint";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookieHelper.get("access_token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== AUTH_ENDPOINT.LOGIN &&
      originalRequest.url !== AUTH_ENDPOINT.REFRESH
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = cookieHelper.get<string>("refresh_token");
        const refreshTokenId = cookieHelper.get<string>("refresh_token_id");

        if (!refreshToken || !refreshTokenId) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${AUTH_ENDPOINT.REFRESH}`,
          {
            refreshToken,
            refreshTokenId,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        cookieHelper.set("access_token", accessToken);
        if (newRefreshToken) {
          cookieHelper.set("refresh_token", newRefreshToken);
        }

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        cookieHelper.remove("access_token");
        cookieHelper.remove("refresh_token");
        cookieHelper.remove("refresh_token_id");
        cookieHelper.remove("user_data");

        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
