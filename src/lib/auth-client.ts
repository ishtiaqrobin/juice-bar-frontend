import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import {
  lastLoginMethodClient,
  emailOTPClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_AUTH_URL,
  plugins: [lastLoginMethodClient(), emailOTPClient()],
});
