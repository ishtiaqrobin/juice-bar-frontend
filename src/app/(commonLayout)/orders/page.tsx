import { BreadcrumbWithCustomSeparator } from "@/components/layout/home/BreadcrumbWithCustomSeparator";
import OrderContent from "@/components/modules/orders/OrderContent";
import BrandingIcon from "@/components/modules/shared/BrandingIcon";

export default function OrdersPage() {
  return (
    <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">
      {/* Branding icon */}
      <BrandingIcon />

      <div className="mb-8 hidden md:block">
        <BreadcrumbWithCustomSeparator />
      </div>
      <OrderContent />
    </div>
  );
}
