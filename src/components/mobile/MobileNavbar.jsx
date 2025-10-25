"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import IconBack from "@/assets/svg/icon_back.svg";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { MobileSideDrawer } from "../site/MobileSideDrawer";
import MobileFilterDropdown from "./MobileFilterDropdown";

const MobileNavbar = ({ className = "" }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "FJB";
      case "/menu":
        return "Menu";
      case "/cart":
        return "My Cart";
      case "/rewards":
        return "Rewards";
      case "/login":
        return "Log In";
      case "/registration":
        return "Let's Get Started!";
      case "/forgot-password":
        return "Forgot Password";
      case "/contact":
        return "Contact";
      case "/promotions":
        return "Promotions";
      case "/profile":
        return "Profile";
      case "/dashboard":
        return "Dashboard";
    }
  };

  return (
    <nav
      className={`sticky top-0 left-0 w-full bg-white h-[70px] p-5 flex items-center justify-between z-50
        ${pathname === "/" ? "border-b border-[#E5E7EB]" : "shadow-md"}
        ${className}`}
    >
      {/* Left side - conditional rendering based on route */}
      {pathname === "/cart" ? (
        <button
          onClick={() => router.back()}
          className="rounded-full hover:bg-gray-100 flex items-center"
        >
          <Image src={IconBack} alt="Back" width={30} height={30} />
        </button>
      ) : (
        <div className="md:hidden ">
          <MobileSideDrawer />
        </div>
      )}

      {/* Left side - conditional rendering based on route */}
      {/* {pathname === "/profile" ? (
        <button
          onClick={() => router.back()}
          className="rounded-full hover:bg-gray-100 flex items-center"
        >
          <Image src={IconBack} alt="Back" width={30} height={30} />
        </button>
      ) : pathname === "/dashboard" ? (
        <div className="md:hidden ">
          <MobileSideDrawer />
        </div>
      ) : (
        <div></div>
      )} */}

      {/* Center - page title */}
      <h1 className="text-xl leading-6 font-semibold">{getPageTitle()}</h1>

      {/* Right side - conditional rendering based on route */}
      {pathname === "/profile" ? (
        <div className="relative mobile-filter-dropdown-container">
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center w-[30px] h-[30px] border-[1px] border-primary rounded-full hover:cursor-pointer"
          >
            <LogOut className="w-[16px] h-[16px] font-bold text-primary"></LogOut>
          </button>
        </div>
      ) : pathname === "/menu" ? (
        <div className="relative mobile-filter-dropdown-container">
          <MobileFilterDropdown />
        </div>
      ) : (
        <div className="w-[30px] h-[30px]">{""}</div>
      )}
    </nav>
  );
};

export default MobileNavbar;
