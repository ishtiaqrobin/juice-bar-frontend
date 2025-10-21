"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import IconBack from "@/assets/svg/icon_back.svg";
import FilterIcon from "@/assets/svg/icon_filter.svg";
import { FilterXIcon } from "lucide-react";

const MobileMenuNavbar = ({ className = "" }) => {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = () => {
    switch (pathname) {
      case "/menu":
        return "Menu";
    }
  };

  return (
    <nav
      className={`sticky top-0 left-0 w-full bg-white shadow-md p-5 flex items-center justify-between z-50 ${className}`}
    >
      <button
        onClick={() => router.back()}
        className="rounded-full hover:bg-gray-100 flex items-center"
      >
        <Image src={IconBack} alt="Back" width={30} height={30} />
      </button>
      <h1 className="text-xl leading-6 font-semibold">{getPageTitle()}</h1>
      <div className="flex items-center justify-center w-[30px] h-[30px] border-[1px] border-black rounded-full hover:cursor-pointer">
        <Image
          src={FilterIcon}
          alt="Filter Icon"
          width={16}
          height={16}
          className="h-[16px] w-[16px] object-cover"
        />
      </div>
    </nav>
  );
};

export default MobileMenuNavbar;
