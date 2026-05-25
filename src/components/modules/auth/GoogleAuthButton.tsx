"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import GoogleIcon from "@/assets/icon/google_icon.png";

interface GoogleAuthButtonProps {
  mode?: "login" | "signup";
  className?: string;
}

export function GoogleAuthButton({
  mode = "login",
  className,
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: process.env.FRONTEND_URL,
        // callbackURL: "http://localhost:3000/",
      });
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error(`Google ${mode} failed`);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={className || "w-full h-10 hover:cursor-pointer"}
      onClick={handleGoogleAuth}
      disabled={isLoading}
      type="button"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Image
          src={GoogleIcon}
          alt="Google logo"
          width={16}
          height={16}
          className="mr-2 h-4 w-4"
        ></Image>
      )}
      {mode === "login" ? "Login" : "Sign up"} with Google
    </Button>
  );
}
