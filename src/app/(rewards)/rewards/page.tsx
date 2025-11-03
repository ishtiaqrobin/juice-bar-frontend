import { BreadcrumbWithCustomSeparator } from "@/components/site/BreadcrumbWithCustomSeparator";
import Image from "next/image";
import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg";

export default function RewardsPage() {
  return (
    <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">
      <div className="hidden md:block mb-3">
        <Image src={IconFJBStripe} alt="Logo" width={40} height={16}></Image>
      </div>

      <div className="hidden md:block">
        <BreadcrumbWithCustomSeparator />
      </div>

      <div className="mt-4">
        <h1 className="text-3xl md:text-[31px] leading-[37px] font-bold tracking-normal text-stone-900">
          Rewards
        </h1>
        <p className="mt-3 text-stone-600">
          Join Friends Rewards to earn points on every order and redeem for free
          items.
        </p>
      </div>
    </div>
  );
}
