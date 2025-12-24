"use server";

import axios from "axios";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const serverAxios = axios.create({
  baseURL: process.env.API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

serverAxios.interceptors.request.use(
  async (config) => {
    const cookieHelper = await cookies();
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

// serverAxios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const cookieHelper = await cookies();
//     const refreshToken = cookieHelper.get("refresh_token");
//     const refreshTokenId = cookieHelper.get("refresh_token_id");
//     const headerStore = await headers();
//     const currentPath = headerStore.get("x-current-path");

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (!refreshToken || !refreshTokenId) {
//         throw new Error("No refresh token available");
//       }

//       if(refreshToken) {
//         redirect(
//         `/api/auth/refresh?callbackUrl=${encodeURIComponent(currentPath!)}`
//       );
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default serverAxios;
