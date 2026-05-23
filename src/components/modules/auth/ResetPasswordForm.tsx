"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: '',
            otp: '',
            password: '',
        },
    });

    useEffect(() => {
        // Get email from URL if available
        const emailFromUrl = searchParams.get('email');
        if (emailFromUrl) {
            setValue('email', emailFromUrl);
        }
    }, [searchParams, setValue]);

    const onSubmit = async (data: ResetPasswordFormValues) => {
        setLoading(true);

        try {
            const response = await fetch(API_ENDPOINTS.EMAIL_OTP.RESET_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    otp: data.otp,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to reset password');
            }

            toast.success('Password reset successful!');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';

            if (errorMessage.includes('expired') || errorMessage.includes('Invalid') || errorMessage.includes('OTP')) {
                toast.error('OTP is invalid or has expired. Please request a new one.');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
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
                    disabled={loading}
                    className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="grid gap-2">
                <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    {...register("otp")}
                    disabled={loading}
                    className={errors.otp ? "border-red-500" : ""}
                />
                {errors.otp && (
                    <p className="text-sm text-red-500">{errors.otp.message}</p>
                )}
            </div>

            <div className="grid gap-2 relative">
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        {...register("password")}
                        disabled={loading}
                        className={errors.password ? "border-red-500" : ""}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 hover:cursor-pointer"
                    >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <Button
                type="submit"
                className="bg-primary text-white h-10 hover:cursor-pointer"
                disabled={loading}
            >
                {loading ? 'Resetting...' : 'Reset Password'}
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
