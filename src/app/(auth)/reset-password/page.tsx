"use client"

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import IconFJBStripe from '@/assets/svg/icon_fjb_strip.svg'
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Extract token from URL
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
            toast.error('Invalid reset link');
            router.push('/login');
        } else {
            setToken(tokenFromUrl);
        }
    }, [searchParams, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.password || !formData.confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await api.auth.resetPassword({
                token,
                newPassword: formData.password
            });

            toast.success('Password reset successful! Redirecting to login...');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';

            if (errorMessage.includes('expired') || errorMessage.includes('Invalid')) {
                toast.error('Reset link has expired or is invalid. Please request a new one.');
                setTimeout(() => {
                    router.push('/forgot-password');
                }, 2000);
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return null; // Will redirect in useEffect
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
                    <h1 className="text-2xl md:text-3xl leading-8 font-semibold hidden md:block">Reset Password</h1>
                    <p className="mt-2 text-stone-600">Enter your new password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                    <div className="grid gap-2">
                        <div className="grid gap-2 relative">
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    required
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
                        </div>
                        <div className="grid gap-2 relative">
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(v => !v)}
                                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 hover:cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>
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
            </div>
        </div>
    );
};

export default ResetPassword;