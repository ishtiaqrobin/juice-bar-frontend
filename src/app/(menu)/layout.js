import { Navbar } from "@/components/site/Navbar";
import { BottomTabBar } from "@/components/site/BottomTabBar";
import { Footer } from "@/components/site/Footer";
import MobileNavbar from "../../components/mobile/MobileNavbar";

export const metadata = {
    title: "Menu - Delivery the best deals to you",
    description: "Fresh organic fruits and juices everyday!",
};

export default function MenuLayout({ children }) {
    return (
        <div className="flex flex-col">
            <div className="hidden md:block">
                <Navbar />
            </div>
            <MobileNavbar className="block md:hidden" />
            <div className="min-h-[400px] pt-0 md:pt-[73px]">
                {children}
            </div>
            <Footer className="hidden md:block" />
            <BottomTabBar />
        </div>
    );
}
