"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MobileSideDrawer } from "@/components/site/MobileSideDrawer";
import Image from "next/image";
import IconLogin from "@/assets/svg/icon_account.svg";
import IconActiveLogin from "@/assets/svg/icon_account_active.svg";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import IconOrder from "@/assets/svg/icon_cart.svg";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/rewards", label: "Rewards" },
  { href: "/promotions", label: "Promotions" },
  // { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Don't render while session is loading
  if (status === "loading") {
    return null;
  }

  return (
    <header
      className={cn(
        "w-full bg-white fixed top-0 z-60 ",
        pathname === "/" ? "border-b border-[#E5E7EB]" : "shadow-md"
      )}
    >
      <div className="max-w-[940px] mx-auto flex items-center justify-between px- py- md:py-">
        {/* Mobile hamburger */}
        <div className="md:hidden">
          <MobileSideDrawer />
        </div>

        {/* Centered logo on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-xl md:text-2xl font-extrabold tracking-tight text-primary md:order-none order-2 px-[10px]"
          >
            FJB
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm leading-[21px] font-normal hover:text-red-600 transition-colors duration-200 border-b-[3px] py-6",
                pathname === item.href
                  ? "text-primary border-primary"
                  : "text-black border-transparent"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-8 text-sm leading-[21px] font-medium">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-1 hover:cursor-pointer group">
                  <div className="relative">
                    <Image
                      src={IconLogin}
                      alt="Login Icon"
                      width={18}
                      height={18}
                      className="group-hover:opacity-0 transition-opacity"
                    />
                    <Image
                      src={IconActiveLogin}
                      alt="Login Icon"
                      width={18}
                      height={18}
                      className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="text-sm leading-[21px] font-medium group-hover:text-red-600 transition-colors duration-200">
                    Account
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-8">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1 hover:cursor-pointer group">
              <div className="relative">
                <Image
                  src={IconLogin}
                  alt="Login Icon"
                  width={18}
                  height={18}
                  className="group-hover:opacity-0 transition-opacity"
                />
                <Image
                  src={IconActiveLogin}
                  alt="Login Icon"
                  width={18}
                  height={18}
                  className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <Link
                href="/login"
                className="text-sm leading-[21px] font-medium group-hover:text-red-600 transition-colors duration-200"
              >
                Log In
              </Link>
            </div>
          )}
          <div className="flex items-center gap-6">
            <Link href="/cart">
              <Image src={IconOrder} alt="Order Icon" width={28} height={28} />
            </Link>
            <button className="text-sm leading-[21px] font-medium  hover:cursor-pointer">
              Order Now
            </button>
          </div>
        </div>

        {/* right spacer on mobile to balance hamburger */}
        <div className="w-6 md:hidden order-3" />
      </div>
    </header>
  );
}
