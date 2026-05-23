import { BreadcrumbWithCustomSeparator } from "@/components/layout/home/BreadcrumbWithCustomSeparator";
import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg";
import Image from "next/image";
import PromotionsContent from "@/components/modules/promotions/PromotionsContent";
import BrandingIcon from "@/components/modules/shared/BrandingIcon";

export default function PromotionsPage() {
  return (
    <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">
      {/* Branding icon */}
      <BrandingIcon />

      <div className="mb-8">
        <BreadcrumbWithCustomSeparator />
      </div>

      <PromotionsContent />
    </div>
  );
}
