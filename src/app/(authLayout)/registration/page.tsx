"use client";

import IconFJBStripe from '@/assets/svg/icon_fjb_strip.svg';
import Image from 'next/image';
import RegisterForm from '@/components/modules/auth/RegisterForm';

export default function RegistrationPage() {
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

                <RegisterForm />
            </div>
        </div>
    );
}