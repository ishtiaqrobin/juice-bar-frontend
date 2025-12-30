"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";

interface Banner {
  id: string;
  image: string;
  text?: string | null;
  description?: string | null;
  order?: number;
}

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.banners.getAll({ isActive: true });
        const activeBanners = response.data.data || [];

        // Sort by order
        const sortedBanners = activeBanners.sort((a: Banner, b: Banner) => (a.order || 0) - (b.order || 0));
        setBanners(sortedBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
        // Use fallback banners if API fails
        setBanners([
          {
            id: "fallback-1",
            image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200",
            text: "Welcome to Friends Juice Bar",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Auto-scroll
  useEffect(() => {
    if (!emblaApi || banners.length <= 1) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [emblaApi, banners.length]);

  if (loading) {
    return (
      <div className="order-1 md:order-2 mb-0.5">
        <Skeleton className="h-48 md:h-80 w-full rounded-lg" />
        <div className="mt-2 flex justify-center gap-1">
          <Skeleton className="h-1.5 w-6 rounded-full" />
          <Skeleton className="h-1.5 w-6 rounded-full" />
          <Skeleton className="h-1.5 w-6 rounded-full" />
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="order-1 md:order-2">
      <div className="overflow-hidden rounded-lg border" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div className="min-w-0 flex-[0_0_100%]" key={banner.id}>
              <div className="relative h-48 md:h-80 w-full">
                <Image
                  src={banner.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200"}
                  alt={banner.text || "Banner"}
                  fill
                  className="object-cover"
                  priority={selectedIndex === 0}
                />
                {banner.text && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-white text-2xl md:text-4xl font-bold text-center px-4">
                      {banner.text}
                    </h2>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {banners.length > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full ${i === selectedIndex ? "bg-stone-900" : "bg-stone-300"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
