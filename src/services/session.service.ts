import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

async function fetchSession(cookieHeader: string, sessionToken?: string) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // if (cookieHeader) {
    //   headers["Cookie"] = cookieHeader;
    // }

    // if (sessionToken) {
    //   headers["Authorization"] = `Bearer ${sessionToken}`;
    // }

    // console.log("Fetching session with cookie header:", cookieHeader);
    // console.log("Fetching session with headers:", headers);
    // console.log("Fetching session with session token:", sessionToken);

    const res = await fetch(API_ENDPOINTS.AUTH.SESSION, {
      // headers,
      headers: {
        Cookie: cookieHeader,
      },
      // credentials: "include",
      cache: "no-store",
    });

    if (!res.ok)
      return { data: null, error: { message: "Failed to fetch session" } };

    const session = await res.json();

    // console.log("Session fetch data :", session);

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
}

export const sessionService = {
  /**
   * Get session from Edge Middleware (proxy.ts).
   * Passes the incoming request's cookie header and session token to the backend.
   * next/headers cookies() does NOT work in Edge runtime.
   */
  getSessionFromRequest: async function (request: NextRequest) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ?? "";
    return fetchSession(cookieHeader, sessionToken);
  },

  /**
   * Get session from Server Components / Server Actions / Route Handlers.
   * Uses next/headers cookies() which is available in Node.js runtime.
   */
  getSession: async function () {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const sessionToken =
      cookieStore.get("better-auth.session_token")?.value ?? "";
    return fetchSession(cookieHeader, sessionToken);
  },
};
