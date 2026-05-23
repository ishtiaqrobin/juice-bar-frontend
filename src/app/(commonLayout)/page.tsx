import { HeroCarousel } from "@/components/layout/home/HeroCarousel";

export default function HomePage() {
    return (
        <div className="flex flex-col">
            {/* Hero Carousel (mobile-first) */}
            <section className="relative isolate bg-white">
                <div className="mx-auto max-w-[972px] px-4 pt-4 md:py-16">
                    <HeroCarousel />
                </div>
            </section>
        </div>
    );
}
