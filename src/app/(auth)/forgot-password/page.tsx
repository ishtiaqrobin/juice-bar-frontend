"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import IconFJBStripe from '@/assets/svg/icon_fjb_strip.svg'
import Image from 'next/image';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            await api.auth.forgotPassword(email);
            setSubmitted(true);
            toast.success('Password reset link sent! Please check your email.');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
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
                        <div className="mb-4 text-green-600 text-5xl">✓</div>
                        <h1 className="text-2xl md:text-3xl leading-8 font-semibold">Check Your Email</h1>
                        <p className="mt-4 text-stone-600">
                            If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
                        </p>
                        <p className="mt-2 text-stone-600 text-sm">
                            Please check your inbox and spam folder.
                        </p>
                        <div className="mt-8">
                            <Link href="/login" className="text-primary hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                    <p className="mt-2 text-stone-600">Just let us know your email address and we will email <br className='hidden md:block' /> you a password reset link.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                    <div className="grid gap-2">
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="bg-primary text-white h-10 hover:cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Submit Now'}
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