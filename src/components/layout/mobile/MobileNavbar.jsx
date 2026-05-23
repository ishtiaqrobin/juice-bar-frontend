"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import IconBack from "@/assets/svg/icon_back.svg";
import FilterIcon from "@/assets/svg/icon_filter.svg";
import { MobileSideDrawer } from "./MobileSideDrawer";
import { useMenuFilter } from "@/context/MenuFilterContext";

const MobileNavbar = ({ className = "" }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { openMobileFilter, appliedShowOnlyAvailable } = useMenuFilter();

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Friends Juice Bar";
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
      {/* Left side */}
      {pathname === "/cart" ? (
        <button
          onClick={() => router.back()}
          className="rounded-full hover:bg-gray-100 flex items-center"
        >
          <Image src={IconBack} alt="Back" width={30} height={30} />
        </button>
      ) : (
        <div className="md:hidden">
          <MobileSideDrawer />
        </div>
      )}

      {/* Center - page title */}
      <h1 className="text-xl leading-6 font-semibold">{getPageTitle()}</h1>

      {/* Right side - filter button only on /menu */}
      {pathname === "/menu" ? (
        <div className="relative">
          <button
            onClick={openMobileFilter}
            className={`flex items-center justify-center w-[30px] h-[30px] border rounded-full hover:cursor-pointer transition-colors ${
              appliedShowOnlyAvailable
                ? "border-primary bg-primary/10"
                : "border-black"
            }`}
          >
            <Image
              src={FilterIcon}
              alt="Filter"
              width={16}
              height={16}
              className="h-[16px] w-[16px] object-cover"
            />
          </button>
          {/* Active filter indicator dot */}
          {appliedShowOnlyAvailable && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
          )}
        </div>
      ) : (
        <div className="w-[30px] h-[30px]">{""}</div>
      )}
    </nav>
  );
};

export default MobileNavbar;
