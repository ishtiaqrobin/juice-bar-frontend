import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { cookies } from "next/headers";

export const sessionService = {
  /**
   * Get session (Server Side Only)
   */
  getSession: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(API_ENDPOINTS.AUTH.SESSION, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok)
        return { data: null, error: { message: "Failed to fetch session" } };

      const session = await res.json();

      if (session === null) {
        return {
          data: null,
          error: {
            message: "No active session",
          },
        };
      }

      return {
        data: session,
        error: null,
      };
    } catch (err) {
      console.error("Error fetching session:", err);
      return {
        data: null,
        error: {
          message: "Error fetching session",
        },
      };
    }
  },
};
