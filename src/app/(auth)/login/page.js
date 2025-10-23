import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import IconFJBStripe from '@/assets/svg/icon_fjb_strip.svg'
import Link from 'next/link'
import Image from 'next/image';

export default function LoginPage() {
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
                    <h1 className="text-2xl md:text-3xl leading-8 font-semibold hidden md:block">Log In!</h1>
                    <p className="mt-2 text-stone-600">Log in now to enjoy exclusive FJB deals <br className='hidden md:block' /> and discounts!</p>
                </div>

                <form className="mt-8 grid gap-4">
                    <div className="grid gap-2">
                        <Input id="email" type="email" placeholder="Email" />
                    </div>
                    <div className="grid gap-2">
                        <Input id="password" type="password" placeholder="Password" />
                        <div className="flex justify-end items-center">
                            <Link href="/forgot-password" className="text-sm text-primary">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                    <Button className="bg-primary h-10 text-white">
                        Login
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