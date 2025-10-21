import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import Link from 'next/link'

export default function LoginPage() {
    return (
        <div className="w-full md:max-w-xl mx-auto bg-gray-100 rounded-xl px-4 py-8 my-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Login</h1>
            <p className="mt-2 text-stone-600">Welcome back to Friends Juice Bar</p>
            <form className="mt-6 grid gap-4">
                <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-stone-700">Email</label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className="text-sm font-medium text-stone-700">Password</label>
                        <label htmlFor="password" className="text-sm font-medium text-stone-700">
                            <Link href="/forgot-password" className="text-red-700">
                                Forgot Password
                            </Link>
                        </label>
                    </div>
                    <Input id="password" type="password" placeholder="********" />
                </div>
                <Button className="bg-red-700 hover:bg-red-800 text-white">
                    Login
                </Button>
                <p className="text-sm text-stone-700">
                    Don&apos;t have an account?{" "}
                    <Link href="/registration" className="text-red-700">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}