"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Banner {
  id: string;
  image: string;
  text?: string | null;
  description?: string | null;
  isActive: boolean;
  order: number;
}

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch banners from API
  const { data: banners = [], isLoading } = useSWR<Banner[]>(
    "/api/banners",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Filter only active banners and sort by order
  const activeBanners = banners
    .filter((banner) => banner.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || activeBanners.length === 0) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000); // 4 seconds
    return () => clearInterval(timer);
  }, [emblaApi, activeBanners.length]);

  // If no banners, show nothing or a placeholder
  if (isLoading) {
    return (
      <div className="order-1 md:order-2">
        <div className="relative h-48 md:h-96 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (activeBanners.length === 0) {
    return null; // Or return a placeholder banner
  }

  return (
    <div className="order-1 md:order-2">
      <div className="relative overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {activeBanners.map((banner) => (
            <div className="min-w-0 flex-[0_0_100%]" key={banner.id}>
              <div className="relative h-48 md:h-96 w-full">
                <Image
                  src={banner.image}
                  alt={banner.text || "promo"}
                  fill
                  className="object-cover"
                />
                {(banner.text || banner.description) && (
                  <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 md:p-8">
                    {banner.text && (
                      <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-2 md:mb-4 drop-shadow-lg">
                        {banner.text}
                      </h2>
                    )}
                    {banner.description && (
                      <p className="text-sm md:text-lg text-white text-center max-w-2xl drop-shadow-md">
                        {banner.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {activeBanners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex justify-center gap-2 md:gap-2.5">
            {activeBanners.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 md:h-2 rounded-full transition-all ${
                  i === selectedIndex
                    ? "bg-white w-9 md:w-15"
                    : "bg-white/60 w-1.5 md:w-2"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
