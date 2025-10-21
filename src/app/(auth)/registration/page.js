import React from 'react'
import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'

import Link from 'next/link'

export default function RegistrationPage() {
    return (
        <div>
            <div className="w-full md:max-w-xl mx-auto bg-gray-100 rounded-xl px-4 py-8 my-12">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Registration</h1>
                <p className="mt-2 text-stone-600">Create an account to get started</p>
                <form className="mt-6 grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-stone-700">Name</label>
                        <Input id="name" type="text" placeholder="Your name" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-stone-700">Email</label>
                        <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="password" className="text-sm font-medium text-stone-700">Password</label>
                        <Input id="password" type="password" placeholder="********" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium text-stone-700">Confirm Password</label>
                        <Input id="confirm-password" type="password" placeholder="********" />
                    </div>
                    <Button className="bg-red-700 hover:bg-red-800 text-white">
                        Register
                    </Button>
                    {/* <p className="text-sm text-stone-700">Already have an account? <Link href="/login" className="text-red-700">Login</Link></p> */}
                </form>
            </div>
        </div>
    );
}