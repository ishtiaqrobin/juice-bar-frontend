import { Navbar } from "@/components/layout/desktop/Navbar";
import { Footer } from "@/components/layout/desktop/Footer";
import MobileNavbar from "@/components/layout/mobile/MobileNavbar";
import MobileFooter from "@/components/layout/mobile/MobileFooter";
import { BottomTabBar } from "@/components/layout/mobile/BottomTabBar";
import HomeLayoutShell from "@/components/layout/HomeLayoutShell";

// Page-level metadata is set per-page (see page.tsx).
// The root layout in src/app/layout.tsx carries the site-wide defaults.

// export const metadata = {
//   title: "FreshFruit - Fruits & Juices",
//   description: "Fresh organic fruits and juices everyday!",
// };

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeLayoutShell>
      <div className="flex flex-col">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <MobileNavbar className="block md:hidden" />
        <div className="min-h-[400px] pt-0 md:pt-[73px]">{children}</div>
        {/* Desktop Footer */}
        <Footer className="hidden md:block" />
        {/* Mobile Footer */}
        {/* <MobileFooter /> */}
        <div className="h-20 md:hidden" /> {/* Spacer for BottomTabBar */}
        <BottomTabBar />
      </div>
    </HomeLayoutShell>
  );
}
