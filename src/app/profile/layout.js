// "use client";

import { Navbar } from "@/components/site/Navbar";
import { BottomTabBar } from "@/components/site/BottomTabBar";
import MobileNavbar from "../../components/mobile/MobileNavbar";

export const metadata = {
    title: "Friends Juice Bar - Account Profile",
    description: "Account Profile for Friends Juice Bar",
};

export default function ProfileLayout({ children }) {
    return (
        <div className="flex flex-col">
            <div className="hidden md:block">
                <Navbar />
            </div>
            <MobileNavbar className="block md:hidden" />
            <div className="min-h-[400px] pt-0 md:pt-[73px]">
                {children}
            </div>
            <BottomTabBar />
        </div>
    );
}
