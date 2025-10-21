import React from 'react';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ForgotPassword = () => {
    return (
        <div>
            <div className="w-full md:max-w-xl mx-auto bg-gray-100 rounded-xl px-4 py-8 my-12">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Forgot Password</h1>
                <p className="mt-2 text-stone-600">Forgot your password to get started</p>
                <form className="mt-6 grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-stone-700">Email</label>
                        <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                    <Button className="bg-red-700 hover:bg-red-800 text-white">Submit</Button>
                    <p className="text-sm text-stone-700">
                        Back to{" "}
                        <Link href="/login" className="text-red-700">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;