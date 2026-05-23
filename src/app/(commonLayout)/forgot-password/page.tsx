"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import IconFJBStripe from '@/assets/svg/icon_fjb_strip.svg'
import Image from 'next/image';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { useRouter } from 'next/navigation';

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setLoading(true);

        try {
            const response = await fetch(API_ENDPOINTS.EMAIL_OTP.SEND_VERIFICATION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    type: 'forget-password',
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to send reset email');
            }

            toast.success('Password reset OTP sent! Please check your email.');

            router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
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
                <div className='text-center'>
                    <h1 className="text-2xl md:text-3xl leading-8 font-semibold hidden md:block">Forgot Password?</h1>
                    <p className="mt-2 text-stone-600">Enter your email address and we will send you <br className='hidden md:block' /> a 6-digit OTP to reset your password.</p>
                </div>

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
                    <Button
                        type="submit"
                        className="bg-primary text-white h-10 hover:cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send OTP'}
                    </Button>
                    <p className="text-sm text-stone-700">
                        Back to{" "}
                        <Link href="/login" className="text-primary">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
