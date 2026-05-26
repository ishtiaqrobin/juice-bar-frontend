import { env } from "@/env";
// import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// const AUTH_URL = env.NEXT_PUBLIC_AUTH_URL;

async function fetchSession(cookieHeader: string, sessionToken?: string) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    if (sessionToken) {
      headers["Authorization"] = `Bearer ${sessionToken}`;
    }

    // const res = await fetch(API_ENDPOINTS.AUTH.SESSION, {
    const res = await fetch(`${env.AUTH_URL}/get-session`, {
      headers,
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
   * Edge Middleware (proxy.ts) এর জন্য।
   * next/headers cookies() Edge runtime এ কাজ করে না।
   * Request এর raw cookie header সরাসরি forward করে।
   */
  getSessionFromRequest: async function (request: NextRequest) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ?? "";
    return fetchSession(cookieHeader, sessionToken);
  },

  /**
   * Server Components / Server Actions / Route Handlers এর জন্য।
   * Node.js runtime এ next/headers cookies() কাজ করে।
   */
  getSession: async function () {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const sessionToken =
      cookieStore.get("better-auth.session_token")?.value ?? "";
    return fetchSession(cookieHeader, sessionToken);
  },
};
