import { BreadcrumbWithCustomSeparator } from "@/components/layout/home/BreadcrumbWithCustomSeparator";
import RewardsContent from "@/components/modules/rewards/RewardsContent";
import BrandingIcon from "@/components/modules/shared/BrandingIcon";

export default async function RewardsPage() {
  return (
    <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">
      {/* Branding icon */}
      <BrandingIcon />

      <div className="mb-8 hidden md:block">
        <BreadcrumbWithCustomSeparator />
      </div>

      <RewardsContent />
    </div>
  );
}
