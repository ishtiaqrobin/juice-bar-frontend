"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Banner } from "@/types/banner.type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroCarouselClientProps {
  banners: Banner[];
}

export default function HeroCarouselClient({
  banners,
}: HeroCarouselClientProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 30, // Smoother transition
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!emblaApi || banners.length <= 1) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000); // 5s is better for reading
    return () => clearInterval(timer);
  }, [emblaApi, banners.length]);

  return (
    <div className="group relative order-1 md:order-2">
      {/* Main Carousel */}
      <div
        className="overflow-hidden rounded-2xl border shadow-lg"
        ref={emblaRef}
      >
        <div className="flex">
          {banners.map((banner, index) => (
            <div className="min-w-0 flex-[0_0_100%] relative" key={banner.id}>
              <div className="relative h-48 md:h-[350px] w-full overflow-hidden">
                <Image
                  src={banner.image}
                  alt={banner.text || "Banner"}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-[10000ms] ease-linear",
                    index === selectedIndex ? "scale-110" : "scale-100",
                  )}
                  priority={index === 0}
                />

                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                  {banner.text && (
                    <div
                      className={cn(
                        "transition-all duration-700 delay-100 transform",
                        index === selectedIndex
                          ? "translate-y-0 opacity-100"
                          : "translate-y-10 opacity-0",
                      )}
                    >
                      <h2 className="text-white text-3xl md:text-5xl font-bold max-w-2xl leading-tight">
                        {banner.text}
                      </h2>
                      {banner.description && (
                        <p className="text-white/80 mt-3 text-lg md:text-xl max-w-xl line-clamp-2">
                          {banner.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 active:scale-95 duration-300 hidden md:flex items-center justify-center "
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 active:scale-95 duration-300 hidden md:flex items-center justify-center"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Modern Indicators (Progress Style) */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-black/10 backdrop-blur-sm">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className="relative h-1.5 transition-all duration-300 focus:outline-none"
              style={{ width: i === selectedIndex ? "2rem" : "0.5rem" }}
            >
              <span
                className={cn(
                  "absolute inset-0 rounded-full transition-all duration-300",
                  i === selectedIndex
                    ? "bg-white w-full"
                    : "bg-white/40 w-full",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
