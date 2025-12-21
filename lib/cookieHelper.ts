import Cookies, { CookieSetOptions } from "universal-cookie";

class CookieHelper {
  private cookies: Cookies;

  constructor() {
    this.cookies = new Cookies(null, { path: "/" });
  }

  set(name: string, value: unknown, options?: CookieSetOptions) {
    this.cookies.set(name, value, { path: "/", ...options });
  }

  get<T>(name: string): T {
    return this.cookies.get(name) as T;
  }

  remove(name: string, options?: CookieSetOptions) {
    this.cookies.remove(name, { path: "/", ...options });
  }

  setUserData(user: unknown) {
    this.set("user_data", user);
  }

  getUserData<T>() {
    return this.get<T>("user_data");
  }
}

export const cookieHelper = new CookieHelper();
