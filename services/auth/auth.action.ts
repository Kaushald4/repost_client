"use server";

import { cookies } from "next/headers";

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("refresh_token");
  cookieStore.delete("refresh_token_id");
  cookieStore.delete("access_token");
  return { success: true };
};
