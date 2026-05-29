"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const RESEND_COOLDOWN_SECONDS = 5 * 60; // 5 মিনিট

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const isNew = searchParams.get("new") === "true";

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // ✅ page load এ countdown init — localStorage দিয়ে refresh এও টিকে থাকে
  useEffect(() => {
    if (!email) return;
    const storageKey = `otp_sent_at_${email}`;
    const savedTime = localStorage.getItem(storageKey);

    if (isNew && !savedTime) {
      localStorage.setItem(storageKey, Date.now().toString());
      setCountdown(RESEND_COOLDOWN_SECONDS);
    } else if (savedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1000);
      const remaining = RESEND_COOLDOWN_SECONDS - elapsed;
      if (remaining > 0) {
        setCountdown(remaining);
      } else {
        localStorage.removeItem(storageKey);
        setCountdown(0);
      }
    }
  }, [email, isNew]);

  // countdown ticker
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(`otp_sent_at_${email}`);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, email]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setIsVerifying(true);
    try {
      const { error } = await authClient.emailOtp.verifyEmail({ email, otp });
      if (error) {
        toast.error(error.message || "Verification failed");
        return;
      }
      localStorage.removeItem(`otp_sent_at_${email}`);
      toast.success("Email verified successfully!");
      router.push("/login");
    } catch {
      toast.error("An error occurred during verification");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
      if (error) {
        toast.error(error.message || "Failed to resend OTP");
        return;
      }
      localStorage.setItem(`otp_sent_at_${email}`, Date.now().toString());
      setCountdown(RESEND_COOLDOWN_SECONDS);
      toast.success("A new OTP has been sent to your email.");
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  }, [email, countdown]);

  return (
    <form onSubmit={handleVerify} className="mt-8 grid gap-4">
      {/* Email display */}
      {email && (
        <p className="text-sm text-center text-stone-500">
          We&apos;ve sent a 6-digit code to{" "}
          <span className="font-semibold text-stone-800 break-all">
            {email}
          </span>
        </p>
      )}

      {/* OTP input */}
      <div className="w-full">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value.replace(/\D/g, ""))}
          disabled={isVerifying}
          className="w-full"
        >
          <InputOTPGroup className="flex w-full font-semibold text-2xl">
            <InputOTPSlot index={0} className="w-full" />
            <InputOTPSlot index={1} className="w-full" />
            <InputOTPSlot index={2} className="w-full" />
            <InputOTPSlot index={3} className="w-full" />
            <InputOTPSlot index={4} className="w-full" />
            <InputOTPSlot index={5} className="w-full" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Verify button */}
      <Button
        type="submit"
        className="bg-primary h-10 text-white hover:cursor-pointer gap-2"
        disabled={isVerifying || otp.length !== 6}
      >
        {isVerifying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            Verify Email
          </>
        )}
      </Button>

      {/* Resend OTP */}
      <div className="text-sm text-center text-stone-600">
        Didn&apos;t receive the code?{" "}
        {countdown > 0 ? (
          <span className="text-primary font-medium">
            Resend in{" "}
            <span className="tabular-nums font-bold">
              {formatTime(countdown)}
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending || isVerifying}
            className="text-primary cursor-pointer hover:underline font-medium disabled:opacity-50 inline-flex items-center gap-1"
          >
            {isResending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                {/* <RefreshCw className="h-3 w-3" /> */}
                Resend code
              </>
            )}
          </button>
        )}
      </div>

      {/* Back to login */}
      <p className="text-sm text-stone-700">
        Back to{" "}
        <Link href="/login" className="text-primary">
          Login
        </Link>
      </p>
    </form>
  );
}
