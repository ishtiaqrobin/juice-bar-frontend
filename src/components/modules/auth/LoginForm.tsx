"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { loginSchema, type LoginFormValues } from "@/lib/validation";
import { Badge } from "@/components/ui/badge";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuth();
    const [lastLogin, setLastLogin] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop()?.split(';').shift();
                return null;
            };
            const method = getCookie("better-auth.last_used_login_method");
            setLastLogin(method || null);
        }
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login({
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe || false,
            });
        } catch {
            // Error handling is done in useAuth
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4">
            <div className="grid gap-2">
                <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="grid gap-2">
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...register("password")}
                        className={errors.password ? "border-red-500" : ""}
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
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 ml-0.5">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            {...register("rememberMe")}
                            className="w-3.5 h-3.5 text-primary bg-gray-100 border-gray-300 rounded"
                        />
                        <label htmlFor="rememberMe" className="text-sm text-stone-700 cursor-pointer">
                            Remember Me
                        </label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-primary">
                        Forgot Password?
                    </Link>
                </div>
            </div>

            <Button
                type="submit"
                className="bg-primary h-10 text-white hover:cursor-pointer relative"
                disabled={isLoading}
            >
                {isLoading ? "Logging in..." : "Login"}
                {lastLogin === "email" && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 text-[10px] h-4 bg-orange-100 text-orange-600 border-none">
                        Last used
                    </Badge>
                )}
            </Button>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-stone-500">Or continue with</span>
                </div>
            </div>

            {/* Google Auth Button */}
            <div className="relative">
                <GoogleAuthButton mode="login" />
                {lastLogin === "google" && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 text-[10px] h-4 bg-orange-100 text-orange-600 border-none">
                        Last used
                    </Badge>
                )}
            </div>

            <p className="text-sm text-stone-700">
                Don&apos;t have an account?{" "}
                <Link href="/registration" className="text-primary">
                    Register
                </Link>
            </p>
        </form>
    );
}