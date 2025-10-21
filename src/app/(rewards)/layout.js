import { Navbar } from "@/components/site/Navbar";
import { BottomTabBar } from "@/components/site/BottomTabBar";
import { Footer } from "@/components/site/Footer";
import MobileAuthNavbar from "../../components/mobile/MobileAuthNavbar";

export const metadata = {
    title: "Rewards | Fruits & Juices",
    description: "Fresh organic fruits and juices everyday!",
};

export default function RewardsLayout({ children }) {
    return (
        <div className="flex flex-col">
            <div className="hidden md:block">
                <Navbar />
            </div>
            <MobileAuthNavbar className="block md:hidden" />
            <div className="min-h-[400px] pt-0 md:pt-[73px]">
                {children}
            </div>
            <Footer className="hidden md:block" />
            <BottomTabBar />
        </div>
    );
}
