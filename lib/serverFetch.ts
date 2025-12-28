import { cookies } from "next/headers";

export async function serverFetch(input: RequestInfo, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  return fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...init.headers,
      cookie: cookieHeader,
      // "content-type": "application/json",
    },
    cache: "no-store",
  });
}
