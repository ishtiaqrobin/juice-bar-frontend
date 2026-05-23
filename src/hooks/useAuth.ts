"use client";

import { Roles } from "@/constants/roles";
import { authClient } from "@/lib/auth-client";
import { User, Session } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();
  const {
    data: sessionData,
    isPending: isLoading,
    refetch,
  } = authClient.useSession();

  const login = async (data: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
      fetchOptions: {
        onSuccess: (ctx) => {
          toast.success("Login successful!");
          router.refresh();
          if (ctx.data.user.role === Roles.admin) {
            router.push("/admin-dashboard");
          } else {
            router.push("/");
          }
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Invalid credentials");
        },
      },
    });
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Registration successful!");
          router.refresh();
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Registration failed");
        },
      },
    });
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.refresh();
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const updateUser = async (_data?: User) => {
    await refetch();
    router.refresh();
  };

  const user = sessionData?.user ? (sessionData.user as User) : null;
  const session = (sessionData?.session as Session) || null;
  const isAuthenticated = !!user && !!session;

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };
}
