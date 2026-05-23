"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/types/category.type";

interface CategoryTabsProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryClick: (categoryId: string) => void;
}

export default function CategoryTabs({
    categories,
    selectedCategory,
    onCategoryClick,
}: CategoryTabsProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    // ─── Scroll active tab into view when category changes ────────────────────────
    useEffect(() => {
        const activeBtn = selectedCategory ? tabRefs.current[selectedCategory] : null;
        const scrollEl = scrollContainerRef.current;
        if (!activeBtn || !scrollEl) return;

        const paddingX = 40; // mirrors px-10
        const btnLeft = activeBtn.offsetLeft;
        const btnRight = btnLeft + activeBtn.offsetWidth;
        const visibleLeft = scrollEl.scrollLeft + paddingX;
        const visibleRight = scrollEl.scrollLeft + scrollEl.clientWidth - paddingX;

        if (btnLeft < visibleLeft) {
            scrollEl.scrollTo({ left: btnLeft - paddingX, behavior: "smooth" });
        } else if (btnRight > visibleRight) {
            scrollEl.scrollTo({
                left: btnRight - scrollEl.clientWidth + paddingX,
                behavior: "smooth",
            });
        }
    }, [selectedCategory]);

    // ─── Left / right arrow scroll ────────────────────────────────────────────────
    const handleScroll = (direction: "left" | "right") => {
        scrollContainerRef.current?.scrollBy({
            left: direction === "left" ? -150 : 150,
            behavior: "smooth",
        });
    };

    // ─── Render ───────────────────────────────────────────────────────────────────
    return (
        <div className="sticky top-[70px] z-40 bg-white">
            <div className="relative bg-white mt-3 md:mt-5 h-[48px] mb-8 border-t border-[#EFEFF0] shadow-[0_5px_4px_-3px_rgba(0,0,0,0.1)] md:shadow-[0_5px_4px_-2px_rgba(0,0,0,0.1)]">

                {/* Left scroll button */}
                <button
                    onClick={() => handleScroll("left")}
                    className="absolute left-0 top-0 z-10 h-full bg-white px-[10px] flex items-center hover:cursor-pointer"
                    aria-label="Scroll categories left"
                >
                    <ChevronLeft className="w-5 h-5 text-[#333333]" />
                </button>

                {/* Tab strip
                • No position:relative / no absolute indicator needed
                • Each button owns its own border-b-3 — CSS handles the transition
                */}
                <div
                    ref={scrollContainerRef}
                    className="flex h-full overflow-x-auto scrollbar-hide px-10"
                >
                    {categories.length === 0 ? (
                        // Loading skeletons
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <Skeleton key={i} className="h-[18px] w-24 shrink-0" />
                            ))}
                        </div>
                    ) : (
                        categories.map((cat) => (
                            <button
                                key={cat.id}
                                ref={(el) => {
                                    tabRefs.current[cat.id] = el;
                                }}
                                onClick={() => onCategoryClick(cat.id)}
                                className={[
                                    // layout
                                    "h-full px-4 shrink-0 whitespace-nowrap hover:cursor-pointer",
                                    // typography
                                    "text-sm leading-[18px] font-medium",
                                    // border underline — always 2px, color transitions
                                    "border-b-3",
                                    // smooth transition on color AND border-color
                                    "transition-colors duration-300 ease-in-out",
                                    // active vs inactive
                                    selectedCategory === cat.id
                                        ? "text-primary border-primary"
                                        : "text-[#0009] border-transparent ",
                                ].join(" ")}
                            >
                                {cat.name}
                            </button>
                        ))
                    )}
                </div>

                {/* Right scroll button */}
                <button
                    onClick={() => handleScroll("right")}
                    className="absolute right-0 top-0 z-10 h-full bg-white px-[10px] flex items-center hover:cursor-pointer"
                    aria-label="Scroll categories right"
                >
                    <ChevronRight className="w-5 h-5 text-[#333333]" />
                </button>

            </div>
        </div>
    );
}
