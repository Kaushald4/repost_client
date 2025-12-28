"use server";

import { AUTH_ENDPOINT } from "@/endpoint";
import { TLoginRequest } from "@/types/register";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import setCookieParser from "set-cookie-parser";

export const logoutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("refresh_token");
  cookieStore.delete("refresh_token_id");
  cookieStore.delete("access_token");
  revalidatePath("/", "layout");

  return { success: true };
};

export const loginAction = async (data: TLoginRequest) => {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { success: false, error: "Login failed" };
    }
    // this is getting used in the middleware to set cookies aslo
    // TDOD: refactor to avoid duplication
    const setCookieHeader = response.headers.get("set-cookie");

    const cookies = setCookieParser.parse(
      setCookieParser.splitCookiesString(setCookieHeader ?? ""),
    );

    for (const c of cookies) {
      cookieStore.set(c.name, c.value, {
        httpOnly: c.httpOnly,
        secure: c.secure,
        sameSite: c.sameSite?.toLowerCase() as "lax" | "strict" | "none",
        path: c.path,
        domain: c.domain,
        maxAge: c.maxAge,
        expires: c.expires,
      });
    }
    revalidatePath("/", "layout");

    if (response.ok) {
      return { success: true };
    }
  } catch (error) {
    return { success: false, error };
  }
};

export const registerAction = async (data: TLoginRequest) => {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}${AUTH_ENDPOINT.REGISTER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { success: false, error: "Registration failed" };
    }

    if (response.ok) {
      return { success: true };
    }
  } catch (error) {
    return { success: false, error };
  }
};
