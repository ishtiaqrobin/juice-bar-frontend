"use client";

import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg";
import Image from "next/image";
import LoginForm from "@/components/modules/auth/LoginForm";

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
                <div className="text-center">
                    <h1 className="text-2xl md:text-3xl leading-8 font-semibold hidden md:block">
                        Log In!
                    </h1>
                    <p className="mt-2 text-stone-600">
                        Log in now to enjoy exclusive FJB deals{" "}
                        <br className="hidden md:block" /> and discounts!
                    </p>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
