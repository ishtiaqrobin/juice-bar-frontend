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
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React from "react";

export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [showAccountPopup, setShowAccountPopup] = React.useState(false);

  const toggleAccountPopup = () => {
    setShowAccountPopup(!showAccountPopup);
  };

  const handleCloseAccountPopup = () => {
    setShowAccountPopup(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setShowAccountPopup(false);
  };

  const handleNavigateToProfile = () => {
    router.push("/dashboard");
    setShowAccountPopup(false);
  };

  const handleNavigateToDashboard = () => {
    router.push("/admin");
    setShowAccountPopup(false);
  };

  // Close popup when clicking outside and prevent scroll when popup is open
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showAccountPopup &&
        !(event.target as Element).closest(".account-popup-container")
      ) {
        setShowAccountPopup(false);
      }
    };

    // Prevent scroll when popup is open
    if (showAccountPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showAccountPopup]);

  // Don't render while session is loading
  // if (status === "loading") {
  //   return null;
  // }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 h-[89px] md:hidden">
      {/* White Background - 10px shorter than image */}
      <div className="absolute inset-x-0 bottom-0 h-[81px] bg-white z-10"></div>
      {/* Background Image */}
      <Image
        src="/bottom_background.svg"
        alt="Bottom Background"
        width={375}
        height={89}
        className="absolute inset-0 w-full h-full object-cover z-20"
      />
      <div className="relative mx-auto flex items-center justify-between px-8 h-full pb- z-30">
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

          <div className="relative account-popup-container">
            {session ? (
              <button
                onClick={toggleAccountPopup}
                className="h-[45px] flex flex-col items-center"
              >
                <div className="h-[28px] flex items-center">
                  <Image
                    src={
                      pathname === "/profile" || pathname === "/dashboard"
                        ? IconActiveAccount
                        : IconAccount
                    }
                    alt="Account Icon"
                    width={28}
                    height={28}
                  />
                </div>
                <span className="text-[10px] leading-[9px] font-semibold text-[#969696] mt-2">
                  Account
                </span>
              </button>
            ) : (
              <Link
                href="/login"
                className="h-[45px] flex flex-col items-center"
              >
                <div className="h-[28px] flex items-center">
                  <Image
                    src={
                      pathname === "/login" ||
                      pathname === "/registration" ||
                      pathname === "/forgot-password"
                        ? IconActiveAccount
                        : IconAccount
                    }
                    alt="Account Icon"
                    width={28}
                    height={28}
                  />
                </div>
                <span className="text-[10px] leading-[9px] font-semibold text-[#969696] mt-2">
                  Log In
                </span>
              </Link>
            )}

            {/* Account Popup Bottom Sheet */}
            {showAccountPopup && session && (
              <div className="fixed inset-0 z-50 flex items-end justify-center">
                {/* Backdrop */}
                <button
                  aria-label="Close account menu"
                  onClick={handleCloseAccountPopup}
                  className="absolute inset-0 bg-black/50"
                />

                {/* Sheet */}
                <div className="relative w-full h-[203px] bg-white overflow-hidden account-popup-container">
                  {/* Header */}
                  <div className="flex items-center justify-between pt-5 pb-4 px-5">
                    <h3 className="text-base leading-[20px] font-semibold text-black">
                      Account
                    </h3>
                    <button
                      onClick={handleCloseAccountPopup}
                      className="bg-[#969696] px-6 py-3 rounded-full text-base leading-5 font-medium text-white hover:cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Content */}
                  <div className="px-5 space-y-3">
                    <button
                      onClick={handleNavigateToProfile}
                      className="w-full bg-primary text-white py-3 rounded-full font-medium hover:cursor-pointer text-base leading-5"
                    >
                      Dashboard
                    </button>

                    {session?.user?.role === "ADMIN" ? (
                      <button
                        onClick={handleNavigateToDashboard}
                        className="w-full bg-primary text-white py-3 rounded-full font-medium hover:cursor-pointer text-base leading-5"
                      >
                        Admin Panel
                      </button>
                    ) : (
                      <button
                        onClick={handleSignOut}
                        className="w-full bg-primary text-white py-3 rounded-full font-medium hover:cursor-pointer text-base leading-5"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
