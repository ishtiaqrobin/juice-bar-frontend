"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import IconFJBStripe from '@/assets/svg/icon_fjb_strip.svg'
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function RegistrationPage() {
    const [useEmail, setUseEmail] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, isLoading } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const registerData = {
                name: formData.name,
                password: formData.password,
            };

            if (useEmail) {
                registerData.email = formData.email;
            } else {
                registerData.phone = "+88" + formData.phone;
            }

            await register(registerData);
        } catch {
            // Error is already handled in AuthContext
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
                    <h1 className="text-2xl md:text-3xl leading-8 font-semibold hidden md:block">Let&apos;s Get Started!</h1>
                    <p className="mt-2 text-stone-600">Sign up now to enjoy good deals and rewards, <br className='block md:hidden' /> it&apos;s <br className='hidden md:block' /> absolutely free!</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 grid gap-4">

                    <div className="grid gap-2">
                        <Input
                            id="fullName"
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

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
                                Use {useEmail ? 'Phone' : 'Email'} Instead
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-2 relative">
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
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
                    <Button
                        type="submit"
                        className="bg-primary h-10 text-white hover:cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register Now'}
                    </Button>
                    <p className="text-sm text-stone-700">Already have an account? <Link href="/login" className="text-primary">Login</Link></p>
                </form>

            </div>
        </div>
    );
}