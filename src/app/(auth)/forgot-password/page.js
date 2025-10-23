import React from 'react';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import IconFJBStripe from '@/assets/svg/icon_fjb_strip.svg'
import Image from 'next/image';

const ForgotPassword = () => {
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

                <form className="mt-8 grid gap-4">
                    <div className="grid gap-2">
                        <Input id="email" type="email" placeholder="Email" />
                    </div>
                    <Button className="bg-primary text-white h-10">Submit Now</Button>
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