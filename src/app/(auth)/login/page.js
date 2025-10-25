// import React, { Suspense } from 'react'
// import LoginClient from './LoginClient'

// export default function LoginPage() {
//     return (
//         <Suspense fallback={<div>Loading...</div>}>
//             <LoginClient />
//         </Suspense>
//     )
// }

"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const [useEmail, setUseEmail] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    // const searchParams = useSearchParams();

    // useEffect(() => {
    //     const message = searchParams.get("message");
    //     if (message) {
    //         setMessage(message);
    //     }
    // }, [searchParams]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email: useEmail ? formData.email : null,
                phone: !useEmail ? formData.phone : null,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid credentials");
            } else if (result?.ok) {
                // Get session to check user role
                const session = await getSession();
                if (session?.user?.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push("/");
                }
            }
        } catch {
            setError("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="px-4 md:px-0">
            <div className="w-full md:max-w-xl mx-auto bg-gray- rounded-lg px-0 md:px-6 pb-16 my-0">
                <div className="flex justify-center mt-1 mb-4">
                    <Image
                        src={IconFJBStripe}
                        alt="Friends Juice Bar"
                        width={40}
                        height={16}
                    />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl md:text-3xl leading-8 font-semibold hidden md:block">
                        Log In!
                    </h1>
                    <p className="mt-2 text-stone-600">
                        Log in now to enjoy exclusive FJB deals{" "}
                        <br className="hidden md:block" /> and discounts!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                    {message && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        {useEmail ? (
                            <div className="grid gap-2">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <div className="flex gap-2">
                                    <div className="w-20">
                                        <Input id="countryCode" type="text" value="+88" readOnly />
                                    </div>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="01XXXXXXXXX"
                                        className="flex-1"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => setUseEmail(!useEmail)}
                                className="text-sm text-primary hover:underline hover:cursor-pointer"
                            >
                                Use {useEmail ? "Phone" : "Email"} Instead
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
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
                        <div className="flex justify-end items-center">
                            <Link href="/forgot-password" className="text-sm text-primary">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="bg-primary h-10 text-white hover:cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                    <p className="text-sm text-stone-700">
                        Don&apos;t have an account?{" "}
                        <Link href="/registration" className="text-primary">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
