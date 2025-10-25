// "use client";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BottomTabBar } from "@/components/site/BottomTabBar";
import MobileNavbar from "../../components/mobile/MobileNavbar";

export const metadata = {
    title: "Friends Juice Bar - Authentication",
    description: "Authentication for Friends Juice Bar",
};

export default function AuthLayout({ children }) {
    return (
        <div className="flex flex-col">
            <div className="hidden md:block">
                <Navbar />
            </div>
            <MobileNavbar className="block md:hidden" />
            <div className="min-h-[500px] pt-0 md:pt-[73px]">
                {children}
            </div>
            <Footer className="hidden md:block" />
            <BottomTabBar />
        </div>
    );
}
