// "use client";

import { Navbar } from "@/components/site/Navbar";
import { BottomTabBar } from "@/components/site/BottomTabBar";

export const metadata = {
    title: "Friends Juice Bar - Admin Dashboard",
    description: "Admin Dashboard for Friends Juice Bar",
};

export default function AdminLayout({ children }) {
    return (
        <div className="flex flex-col">
            <div className="hidden md:block">
                <Navbar />
            </div>
            <div className="min-h-[400px] pt-0 md:pt-[73px]">
                {children}
            </div>
            <BottomTabBar />
        </div>
    );
}
