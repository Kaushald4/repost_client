import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ENDPOINT } from "./endpoint";
import setCookieParser from "set-cookie-parser";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-current-path",
    request.nextUrl.pathname + request.nextUrl.search
  );
  const cookieStore = request.cookies;
  const refreshTokenId = cookieStore.get("refresh_token_id")?.value;

  if (refreshTokenId && !request.nextUrl.pathname.includes("/login")) {
    const authRes = await fetch(
      `${process.env.API_BASE_URL}${AUTH_ENDPOINT.REFRESH}`,
      {
        method: "POST",

        body: JSON.stringify({ refreshTokenId }),
        headers: {
          cookie: request.headers.get("cookie") || "",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const res = NextResponse.next();

    // this is getting used in the login action to set cookies aslo
    // TDOD: refactor to avoid duplication
    const setCookies =
      authRes.headers.getSetCookie?.() ??
      (authRes.headers.get("set-cookie")
        ? [authRes.headers.get("set-cookie")!]
        : []);
    const parsed = setCookieParser.parse(setCookies);

    for (const c of parsed) {
      res.cookies.set(c.name, c.value, {
        httpOnly: c.httpOnly,
        secure: c.secure,
        sameSite: c.sameSite?.toLowerCase() as "lax" | "strict" | "none",
        path: c.path,
        domain: c.domain,
        maxAge: c.maxAge,
        expires: c.expires,
      });
    }

    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - /api/* (API routes)
     * - /_next/* (Next.js internals)
     * - /favicon.ico, /robots.txt, etc. (static files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
