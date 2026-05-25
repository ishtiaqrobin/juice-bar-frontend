// import { API_ENDPOINTS } from "@/lib/api-endpoints";
// import { cookies } from "next/headers";

// export const sessionService = {
//   /**
//    * Get session (Server Side Only)
//    */
//   getSession: async function () {
//     try {
//       const cookieStore = await cookies();

//       const res = await fetch(API_ENDPOINTS.AUTH.SESSION, {
//         headers: {
//           Cookie: cookieStore.toString(),
//         },
//         credentials: "include",
//         cache: "no-store",
//       });

//       if (!res.ok)
//         return { data: null, error: { message: "Failed to fetch session" } };

//       const session = await res.json();

//       if (session === null) {
//         return {
//           data: null,
//           error: {
//             message: "No active session",
//           },
//         };
//       }

//       return {
//         data: session,
//         error: null,
//       };
//     } catch (err) {
//       console.error("Error fetching session:", err);
//       return {
//         data: null,
//         error: {
//           message: "Error fetching session",
//         },
//       };
//     }
//   },
// };

import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

async function fetchSession(cookieHeader: string) {
  try {
    const res = await fetch(API_ENDPOINTS.AUTH.SESSION, {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok)
      return { data: null, error: { message: "Failed to fetch session" } };

    const session = await res.json();

    console.log("Session fetch data :", session);

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
   * Passes the incoming request's cookie header to the backend.
   * next/headers cookies() does NOT work in Edge runtime.
   */
  getSessionFromRequest: async function (request: NextRequest) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    return fetchSession(cookieHeader);
  },

  /**
   * Get session from Server Components / Server Actions / Route Handlers.
   * Uses next/headers cookies() which is available in Node.js runtime.
   */
  getSession: async function () {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    return fetchSession(cookieHeader);
  },
};
