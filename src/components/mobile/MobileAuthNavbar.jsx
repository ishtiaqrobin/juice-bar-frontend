"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import IconBack from "@/assets/svg/icon_back.svg";

const MobileAuthNavbar = ({ className = "" }) => {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = () => {
    switch (pathname) {
      case "/login":
        return "Log In";
      case "/registration":
        return "Lest's Get Started!";
      case "/forgot-password":
        return "Reset Password";
      case "/cart":
        return "My Cart";
      case "/contact":
        return "Contact";
      case "/promotions":
        return "Promotions";
      case "/rewards":
        return "Rewards";
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
      <div className="w-10"></div> {/* Spacer to maintain center alignment */}
    </nav>
  );
};

export default MobileAuthNavbar;
