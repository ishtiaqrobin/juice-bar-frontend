"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import IconFJBStripe from '@/assets/svg/icon_fjb_strip.svg'
import Image from 'next/image';

export default function RegistrationPage() {
    const [useEmail, setUseEmail] = useState(true);

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

                <form className="mt-8 grid gap-4">
                    <div className="grid gap-2">
                        <Input id="fullName" type="text" placeholder="Full Name" />
                    </div>

                    <div>
                        {useEmail ? (
                            <div className="grid gap-2">
                                <Input id="email" type="email" placeholder="Email" />
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <div className="flex gap-2">
                                    <div className="w-20">
                                        <Input id="countryCode" type="text" value="+88" readOnly />
                                    </div>
                                    <Input id="phone" type="tel" placeholder="01XXXXXXXXX" className="flex-1" />
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

                    <div className="grid gap-2">
                        <Input id="password" type="password" placeholder="Password" />
                    </div>
                    <div className="grid gap-2">
                        <Input id="confirm-password" type="password" placeholder="Confirm Password" />
                    </div>
                    <Button className="bg-primary h-10 text-white">
                        Register Now
                    </Button>
                    <p className="text-sm text-stone-700">Already have an account? <Link href="/login" className="text-primary">Login</Link></p>
                </form>

            </div>
        </div>
    );
}