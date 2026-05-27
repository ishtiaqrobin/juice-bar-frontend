import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import {
  lastLoginMethodClient,
  emailOTPClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // ✅ Frontend এর নিজের origin — rewrite এর মাধ্যমে backend এ যাবে
  // Cookie সেট হবে friendsjuicebar.com এ, middleware পড়তে পারবে
  baseURL: env.NEXT_PUBLIC_APP_URL, // https://friendsjuicebar.com
  fetchOptions: {
    credentials: "include",
  },
  plugins: [lastLoginMethodClient(), emailOTPClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
