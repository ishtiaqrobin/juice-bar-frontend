// "use client"

// import { Suspense } from 'react';
// import ResetPasswordForm from '../../../components/modules/auth/ResetPasswordForm';
// import IconFJBStripe from '@/assets/svg/icon_fjb_strip.svg'
// import Image from 'next/image';

// const ResetPasswordPage = () => {
//     return (
//         <div className="px-4 md:px-0">
//             <div className="w-full md:max-w-xl mx-auto bg-gray- rounded-lg px-0 md:px-6 pb-16 my-0">
//                 <div className="flex justify-center mt-1 mb-4">
//                     <Image
//                         src={IconFJBStripe}
//                         alt="Friends Juice Bar"
//                         width={40}
//                         height={16}
//                     />
//                 </div>
//                 <div className='text-center'>
//                     <h1 className="text-2xl md:text-3xl leading-8 font-semibold hidden md:block">Reset Password</h1>
//                     <p className="mt-2 text-stone-600">Enter your new password below.</p>
//                 </div>

//                 <Suspense fallback={
//                     <div className="mt-8 text-center text-stone-600">
//                         Loading...
//                     </div>
//                 }>
//                     <ResetPasswordForm />
//                 </Suspense>
//             </div>
//         </div>
//     );
// };

// export default ResetPasswordPage;

"use client";

import { Suspense } from "react";
import ResetPasswordForm from "@/components/modules/auth/ResetPasswordForm";
import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const ResetPasswordPage = () => {
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
            Reset Password
          </h1>
          <p className="mt-2 text-stone-600">
            Enter the OTP sent to your email and set a new password.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="mt-8 flex items-center justify-center text-stone-600 gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
