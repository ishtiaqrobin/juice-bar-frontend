import { JSX } from "react";
import MenuClient from "@/components/modules/menu/MenuClient";
import { getMenuCategories } from "@/actions/category.action";
import { getMenuProducts } from "@/actions/product.action";
import { HeroCarousel } from "@/components/layout/home/HeroCarousel";
import { BreadcrumbWithCustomSeparator } from "@/components/layout/home/BreadcrumbWithCustomSeparator";
import BrandingIcon from "@/components/modules/shared/BrandingIcon";

export const metadata = {
  title: "Menu | Friends Juice Bar",
  description: "Explore our full menu of fresh juices, smoothies, and more.",
};

export default async function MenuPage(): Promise<JSX.Element> {
  const [{ data: categories = [] }, { data: products = [] }] =
    await Promise.all([getMenuCategories(), getMenuProducts()]);

  return (
    <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">
      {/* Branding icon */}
      <BrandingIcon />

      {/* Breadcrumb */}
      <div className="hidden md:block">
        <BreadcrumbWithCustomSeparator />
      </div>

      <div className="pt-0 pb-0 md:pt-6 md:pb-8">
        <HeroCarousel />
      </div>
      <MenuClient categories={categories} products={products} />
    </div>
  );
}
