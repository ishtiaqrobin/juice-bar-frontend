import { bannerService } from "@/services";
import { Banner } from "@/types/banner.type";
import HeroCarouselClient from "./HeroCarouselClient";

export async function HeroCarousel() {
  let banners: Banner[] = [];

  try {
    const { data } = await bannerService.getBanners(
      { isActive: true },
      { revalidate: 10 }, // ISR - 5 minutes
    );

    // Sort by order ascending
    banners = (data ?? []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    throw new Error("Failed to fetch banners");
  }

  if (banners.length === 0) {
    return null;
  }

  return <HeroCarouselClient banners={banners} />;
}
