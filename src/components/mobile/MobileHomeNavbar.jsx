"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import IconHamburgerMenu from "@/assets/svg/icon_hamburger_menu.svg";
import { MobileSideDrawer } from "@/components/site/MobileSideDrawer";

const MobileHomeNavbar = ({ className = "" }) => {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      default:
        return "FJB";
    }
  };

  return (
    // <nav
    //   className={`fixed top-0 left-0 w-full bg-white border-b-[1px] border-[#E5E7EB] px-7 py-[22.6px] flex items-center justify-between z-50 ${className}`}
    // >
    //   <div className="md:hidden">
    //     <MobileSideDrawer />
    //   </div>
    //   <h1 className="text-xl leading-6 font-semibold">{getPageTitle()}</h1>
    //   <div className="w-10"></div> {/* Spacer to maintain center alignment */}
    // </nav>
    <nav
      className={`sticky top-0 left-0 w-full bg-white border-b border-[#E5E7EB] h-[70px] flex items-center justify-between px-7 z-50 ${className}`}
    >
      <div className="md:hidden">
        <MobileSideDrawer />
      </div>
      <h1 className="text-xl leading-6 font-semibold">{getPageTitle()}</h1>
      <div className="w-10"></div> {/* Spacer */}
    </nav>
  );
};

export default MobileHomeNavbar;
