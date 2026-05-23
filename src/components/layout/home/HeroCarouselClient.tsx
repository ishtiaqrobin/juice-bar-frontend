"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
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
  // Use the Fade plugin for the transition
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 30,
    },
    [Fade()],
  );

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

  useEffect(() => {
    if (!emblaApi || banners.length <= 1) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [emblaApi, banners.length]);

  return (
    <div className="group relative order-1 md:order-2">
      <div
        className="overflow-hidden rounded-xl md:rounded-2xl border- shadow-lg"
        ref={emblaRef}
      >
        <div className="flex touch-pan-y">
          {banners.map((banner, index) => (
            <div className="min-w-0 flex-[0_0_100%] relative" key={banner.id}>
              {/* Maintain the USER's preferred height: h-48 md:h-[350px] */}
              <div className="relative h-48 md:h-[350px] w-full overflow-hidden">
                <Image
                  src={banner.image}
                  alt={banner.text || "Banner"}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-10000 ease-linear",
                    index === selectedIndex ? "scale-105" : "scale-100",
                  )}
                  priority={index === 0}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-6 md:p-10">
                  {banner.text && (
                    <div
                      className={cn(
                        "transition-all duration-1000 transform",
                        index === selectedIndex
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0",
                      )}
                    >
                      <h2 className="text-white text-2xl md:text-4xl font-bold max-w-2xl leading-tight ">
                        {banner.text}
                      </h2>
                      {banner.description && (
                        <p className="text-white/80 mt-2 text-sm md:text-lg max-w-xl line-clamp-2">
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
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 active:scale-95 duration-300 hidden md:flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full bg-black/10 backdrop-blur-sm">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className="relative h-1 md:h-1.5 transition-all duration-300 focus:outline-none"
              style={{ width: i === selectedIndex ? "2rem" : "0.5rem" }}
            >
              <span
                className={cn(
                  "absolute inset-0 rounded-full transition-all duration-500",
                  i === selectedIndex
                    ? "bg-white w-full"
                    : "bg-white/30 w-full",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
