"use server";

import { cookies } from "next/headers";
import { refreshSession } from "./auth";

export async function withAuth<R>(action: () => Promise<R>) {
  return async () => {
    const cookieStore = await cookies();

    try {
      return await action();
    } catch (error: unknown) {
      const isUnauthorized =
        error instanceof Error &&
        (error as { response?: { status?: number } }).response?.status === 401;

      if (isUnauthorized) {
        const refreshResult = await refreshSession();

        if (refreshResult.success) {
          try {
            return await action();
          } catch (retryError) {
            console.log(retryError);
            throw retryError;
          }
        } else {
          throw new Error("Session expired. Please log in again.");
        }
      }

      throw error;
    }
  };
}

// export async function withAuth<Args extends unknown[], R>(
//   action: (...args: Args) => Promise<R>
// ) {
//   return async (...args: Args): Promise<R | { error: string }> => {
//     const cookieStore = await cookies();

//     try {
//       return await action(...args);
//     } catch (error: unknown) {
//       const isUnauthorized =
//         error instanceof Error &&
//         (error as { response?: { status?: number } }).response?.status === 401;

//       if (isUnauthorized) {
//         const refreshResult = await refreshSession();

//         if (refreshResult.success) {
//           try {
//             return await action(...args);
//           } catch (retryError) {
//             console.log(retryError);
//             throw retryError;
//           }
//         } else {
//           cookieStore.delete("access_token");
//           cookieStore.delete("refresh_token");
//           cookieStore.delete("refresh_token_id");
//           cookieStore.delete("user_data");
//           throw new Error("Session expired. Please log in again.");
//         }
//       }

//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";
//       throw new Error(errorMessage);
//     }
//   };
// }
