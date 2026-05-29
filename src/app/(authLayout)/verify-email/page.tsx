"use client";

import { Suspense } from "react";
import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg";
import Image from "next/image";
import VerifyEmailForm from "@/components/modules/auth/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <div className="px-4 md:px-0">
      <div className="w-full md:max-w-xl mx-auto rounded-lg px-0 md:px-6 pb-16 my-0">
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
            Verify Your Email
          </h1>
          <p className="mt-2 text-stone-600">
            Enter the 6-digit code sent to your inbox{" "}
            <br className="hidden md:block" /> to activate your account.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="mt-8 text-center text-stone-500 text-sm">
              Loading...
            </div>
          }
        >
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
