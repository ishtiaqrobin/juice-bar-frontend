// "use client";

import { Navbar } from "@/components/site/Navbar";
import MobileAuthNavbar from "../../components/mobile/MobileAuthNavbar";
import { Footer } from "@/components/site/Footer";
import { BottomTabBar } from "@/components/site/BottomTabBar";

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
            <MobileAuthNavbar className="block md:hidden" />
            <div className="">
                {children}
            </div>
            <Footer className="hidden md:block" />
            <BottomTabBar />
        </div>
    );
}
