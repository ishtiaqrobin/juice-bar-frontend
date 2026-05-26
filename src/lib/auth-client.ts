import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import {
  lastLoginMethodClient,
  emailOTPClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // IMPORTANT: baseURL must be the FRONTEND's own origin.
  // next.config.ts rewrites /api/auth/* → backend, making auth requests
  // same-origin. This prevents browsers from blocking cross-site cookies.
  // baseURL: env.NEXT_PUBLIC_APP_URL,
  baseURL: env.NEXT_PUBLIC_AUTH_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [lastLoginMethodClient(), emailOTPClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
