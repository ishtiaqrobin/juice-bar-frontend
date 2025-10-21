"use client";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Plus,
  Instagram,
  Facebook,
  Youtube,
  Music2,
  BadgeCheck,
} from "lucide-react";
import IconHamburgerMenu from "@/assets/svg/icon_hamburger_menu.svg";
import Image from "next/image";

const sections = [
  { label: "Track My Orders", href: "/orders" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Our Food", href: "/menu" },
  { label: "Help & Support", href: "/support" },
];

export function MobileSideDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* <Button variant="outline" size="sm" className="md:hidden px-2 h-8">
          <AlignLeft className="h-5 w-5" />
        </Button> */}
        <Image src={IconHamburgerMenu} alt="Menu" width={24} height={24} />
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] p-0">
        <div className="flex h-full flex-col">
          <div className="px-4 pt-4 pb-4">
            {/* <Link
              href="/"
              className="text-xl font-extrabold tracking-tight text-red-700"
            ></Link> */}
          </div>
          <nav className="mt-2 divide-y">
            {sections.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="flex items-center justify-between px-4 py-4 text-base font-semibold text-stone-900"
              >
                <span>{s.label}</span>
                <Plus className="h-5 w-5" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="px-4 py-4 border-t">
              <div className="flex items-center gap-4 text-stone-700">
                <Music2 className="h-5 w-5" />
                <Instagram className="h-5 w-5" />
                <Facebook className="h-5 w-5" />
                <BadgeCheck className="h-5 w-5" />
                <Youtube className="h-5 w-5" />
              </div>
            </div>
            <div className="px-4 pb-6">
              <p className="text-sm text-stone-600">Secure Payment</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {["VISA", "MASTERCARD", "BOOST", "GRABPAY", "FPX", "TNG"].map(
                  (p) => (
                    <span
                      key={p}
                      className="rounded border px-2 py-1 text-[10px] tracking-wide text-stone-700"
                    >
                      {p}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
