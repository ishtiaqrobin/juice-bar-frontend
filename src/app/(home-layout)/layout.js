import { Navbar } from "@/components/site/Navbar";
import { BottomTabBar } from "@/components/site/BottomTabBar";
import { Footer } from "@/components/site/Footer";
import MobileHomeNavbar from "../../components/mobile/MobileHomeNavbar";

export const metadata = {
    title: "FreshFruit - Fruits & Juices",
    description: "Fresh organic fruits and juices everyday!",
};

export default function HomeLayout({ children }) {
    return (
        <div className="flex flex-col">
            <div className="hidden md:block">
                <Navbar />
            </div>
            <MobileHomeNavbar className="block md:hidden" />
            <div className="min-h-[400px] pt-0 md:pt-[73px]">
                {children}
            </div>
            <Footer className="hidden md:block" />
            <BottomTabBar />
        </div>
    );
}
