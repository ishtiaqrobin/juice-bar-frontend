"use client";

import Link from "next/link";
import Image from "next/image";
import IconHome from "@/assets/svg/icon_home.svg";
import IconActiveHome from "@/assets/svg/icon_home_active.svg";
import IconMenu from "@/assets/svg/icon_menu.svg";
import IconActiveMenu from "@/assets/svg/icon_menu_active.svg";
import IconRewards from "@/assets/svg/icon_rewards.svg";
import IconActiveRewards from "@/assets/svg/icon_reward_active.svg";
import IconAccount from "@/assets/svg/icon_account.svg";
import IconActiveAccount from "@/assets/svg/icon_account_active.svg";
import IconCart from "@/assets/svg/icon_cart.svg";
import { usePathname } from "next/navigation";

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 h-[89px] bg- md:hidden">
      <Image
        src="/bottom_background.svg"
        alt="Bottom Background"
        width={375}
        height={89}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative mx-auto flex items-center justify-between px-8 h-full pb-">
        <div className="flex gap-8">
          <div>
            <Link href="/" className="h-[45px] flex flex-col items-center">
              <div className="h-[28px] flex items-center">
                <Image
                  src={pathname === "/" ? IconActiveHome : IconHome}
                  alt="Home Icon"
                  width={28}
                  height={28}
                />
              </div>
              <span className="text-[10px] leading-[9px] font-semibold text-[#969696] mt-2">
                Home
              </span>
            </Link>
          </div>

          <div>
            <Link href="/menu" className="h-[45px] flex flex-col items-center">
              <div className="h-[28px] flex items-center">
                <Image
                  src={pathname === "/menu" ? IconActiveMenu : IconMenu}
                  alt="Menu Icon"
                  width={28}
                  height={28}
                />
              </div>
              <span className="text-[10px] leading-[9px] font-semibold text-[#969696] mt-2">
                Menu
              </span>
            </Link>
          </div>
        </div>

        {/* Center Order Now */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-3">
          <Link href="/cart" className="inline-block">
            <div className="w-[80px] h-[80px] rounded-full bg-[#FF1C1F] shadow-xl flex flex-col items-center justify-center gap-[4px]">
              <Image
                src={IconCart}
                alt="Cart Icon"
                width={28}
                height={29}
                className="mt-"
              />
              <span className="text-xs leading-[12px] font-semibold text-white">
                Order Now
              </span>
            </div>
          </Link>
        </div>

        <div className="flex gap-8">
          <div>
            <Link
              href="/rewards"
              className="h-[45px] flex flex-col items-center"
            >
              <div className="h-[28px] flex items-center">
                <Image
                  src={
                    pathname === "/rewards" ? IconActiveRewards : IconRewards
                  }
                  alt="Rewards Icon"
                  width={28}
                  height={28}
                />
              </div>
              <span className="text-[10px] leading-[9px] font-semibold text-[#969696] mt-2">
                Rewards
              </span>
            </Link>
          </div>

          <div>
            <Link href="/login" className="h-[45px] flex flex-col items-center">
              <div className="h-[28px] flex items-center">
                <Image
                  src={pathname === "/login" ? IconActiveAccount : IconAccount}
                  alt="Account Icon"
                  width={28}
                  height={28}
                />
              </div>
              <span className="text-[10px] leading-[9px] font-semibold text-[#969696] mt-2">
                Log In
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to} className="flex flex-col items-center gap-1">
      <span>{icon}</span>
      <span
        className={`text-xs font-medium ${
          isActive ? "text-[#FF1C1F]" : "text-[#969696]"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
