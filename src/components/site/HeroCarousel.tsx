import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slides = [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200",
    "https://plus.unsplash.com/premium_photo-1674106347866-8282d8c19f84?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
  ];

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
    if (!emblaApi) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <div className="order-1 md:order-2">
      <div className="overflow-hidden rounded- " ref={emblaRef}>
        <div className="flex">
          {slides.map((src) => (
            <div className="min-w-0 flex-[0_0_100%]" key={src}>
              <div className="relative h-48 md:h-96 w-full">
                <Image src={src} alt="promo" fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-center gap-1">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-6 rounded-full ${
              i === selectedIndex ? "bg-stone-900" : "bg-stone-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
