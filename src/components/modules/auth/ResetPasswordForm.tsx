// "use client"

// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button';
// import Link from 'next/link'
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Eye, EyeOff } from 'lucide-react';
// import { toast } from 'sonner';
// import { API_ENDPOINTS } from '@/lib/api-endpoints';

// const resetPasswordSchema = z.object({
//     email: z.string().email("Invalid email address"),
//     otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// const ResetPasswordForm = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const [showPassword, setShowPassword] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         setValue,
//     } = useForm<ResetPasswordFormValues>({
//         resolver: zodResolver(resetPasswordSchema),
//         defaultValues: {
//             email: '',
//             otp: '',
//             password: '',
//         },
//     });

//     useEffect(() => {
//         // Get email from URL if available
//         const emailFromUrl = searchParams.get('email');
//         if (emailFromUrl) {
//             setValue('email', emailFromUrl);
//         }
//     }, [searchParams, setValue]);

//     const onSubmit = async (data: ResetPasswordFormValues) => {
//         setLoading(true);

//         try {
//             const response = await fetch(API_ENDPOINTS.EMAIL_OTP.RESET_PASSWORD, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     email: data.email,
//                     otp: data.otp,
//                     password: data.password,
//                 }),
//             });

//             const result = await response.json();

//             if (!response.ok) {
//                 throw new Error(result.message || 'Failed to reset password');
//             }

//             toast.success('Password reset successful!');

//             // Redirect to login after 2 seconds
//             setTimeout(() => {
//                 router.push('/login');
//             }, 2000);
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';

//             if (errorMessage.includes('expired') || errorMessage.includes('Invalid') || errorMessage.includes('OTP')) {
//                 toast.error('OTP is invalid or has expired. Please request a new one.');
//             } else {
//                 toast.error(errorMessage);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4">
//             <div className="grid gap-2">
//                 <Input
//                     id="email"
//                     type="email"
//                     placeholder="Email"
//                     {...register("email")}
//                     disabled={loading}
//                     className={errors.email ? "border-red-500" : ""}
//                 />
//                 {errors.email && (
//                     <p className="text-sm text-red-500">{errors.email.message}</p>
//                 )}
//             </div>

//             <div className="grid gap-2">
//                 <Input
//                     id="otp"
//                     type="text"
//                     placeholder="Enter 6-digit OTP"
//                     maxLength={6}
//                     {...register("otp")}
//                     disabled={loading}
//                     className={errors.otp ? "border-red-500" : ""}
//                 />
//                 {errors.otp && (
//                     <p className="text-sm text-red-500">{errors.otp.message}</p>
//                 )}
//             </div>

//             <div className="grid gap-2 relative">
//                 <div className="relative">
//                     <Input
//                         id="password"
//                         type={showPassword ? 'text' : 'password'}
//                         placeholder="New Password"
//                         {...register("password")}
//                         disabled={loading}
//                         className={errors.password ? "border-red-500" : ""}
//                     />
//                     <button
//                         type="button"
//                         onClick={() => setShowPassword(v => !v)}
//                         aria-label={showPassword ? 'Hide password' : 'Show password'}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 hover:cursor-pointer"
//                     >
//                         {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
//                     </button>
//                 </div>
//                 {errors.password && (
//                     <p className="text-sm text-red-500">{errors.password.message}</p>
//                 )}
//             </div>

//             <Button
//                 type="submit"
//                 className="bg-primary text-white h-10 hover:cursor-pointer"
//                 disabled={loading}
//             >
//                 {loading ? 'Resetting...' : 'Reset Password'}
//             </Button>
//             <p className="text-sm text-stone-700">
//                 Back to{" "}
//                 <Link href="/login" className="text-primary">
//                     Login
//                 </Link>
//             </p>
//         </form>
//     );
// };

// export default ResetPasswordForm;
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const RESEND_COOLDOWN_SECONDS = 5 * 60; // 5 মিনিট

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const isNew = searchParams.get("new") === "true";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isResetting, setIsResetting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // ✅ forgot-password page থেকে এলে countdown শুরু হবে
  useEffect(() => {
    if (!email) return;
    const storageKey = `reset_otp_sent_at_${email}`;
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
          localStorage.removeItem(`reset_otp_sent_at_${email}`);
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

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing. Please go back and try again.");
      return;
    }
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await authClient.emailOtp.resetPassword({
        email,
        otp,
        password,
      });

      if (error) {
        if (
          error.message?.toLowerCase().includes("expired") ||
          error.message?.toLowerCase().includes("invalid")
        ) {
          toast.error("OTP is invalid or expired.");
        } else {
          toast.error(error.message || "Failed to reset password");
        }
        return;
      }

      // ✅ সফল — localStorage পরিষ্কার করো
      localStorage.removeItem(`reset_otp_sent_at_${email}`);
      toast.success("Password reset successful! Please log in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (countdown > 0 || !email) return;
    setIsResending(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      });

      if (error) {
        toast.error(error.message || "Failed to resend OTP");
        return;
      }

      localStorage.setItem(`reset_otp_sent_at_${email}`, Date.now().toString());
      setCountdown(RESEND_COOLDOWN_SECONDS);
      toast.success("A new OTP has been sent to your email.");
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  }, [email, countdown]);

  return (
    <form onSubmit={handleReset} className="mt-8 grid gap-4">
      {/* Email — read-only display */}
      {email && (
        <div className="px-3 py-2 rounded-md bg-stone-100 text-sm text-stone-600 text-center">
          Sending OTP to:{" "}
          <span className="font-semibold text-stone-800 break-all">
            {email}
          </span>
        </div>
      )}

      {/* OTP input */}
      <div className="w-full">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value.replace(/\D/g, ""))}
          disabled={isResetting}
          className="w-full"
        >
          <InputOTPGroup className="flex w-full h-10 font-semibold text-2xl">
            <InputOTPSlot index={0} className="w-full" />
            <InputOTPSlot index={1} className="w-full" />
            <InputOTPSlot index={2} className="w-full" />
            <InputOTPSlot index={3} className="w-full" />
            <InputOTPSlot index={4} className="w-full" />
            <InputOTPSlot index={5} className="w-full" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Resend OTP */}
      <div className="text-sm text-center text-muted-foreground">
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
            disabled={isResending || isResetting}
            className="text-primary cursor-pointer hover:underline font-medium disabled:opacity-50 inline-flex items-center gap-1"
          >
            {isResending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : (
              <>Resend OTP</>
            )}
          </button>
        )}
      </div>

      {/* New Password */}
      <div className="grid gap-2">
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isResetting}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 hover:cursor-pointer"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="grid gap-2">
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isResetting}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={
              showConfirmPassword ? "Hide password" : "Show confirm password"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 hover:cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="bg-primary text-white h-10 hover:cursor-pointer gap-2"
        disabled={isResetting || otp.length !== 6 || password.length < 6}
      >
        {isResetting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Resetting...
          </>
        ) : (
          <>
            <KeyRound className="h-4 w-4" />
            Reset Password
          </>
        )}
      </Button>

      <p className="text-sm text-stone-700">
        Back to{" "}
        <Link href="/login" className="text-primary">
          Login
        </Link>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
