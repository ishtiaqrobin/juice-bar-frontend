"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg";
import { Category } from "@/types/category.type";
import { Product } from "@/types/product.type";
import DesktopMenu from "@/components/modules/menu/DesktopMenu";
import CategoryTabs from "@/components/modules/menu/CategoryTabs";
import ProductGrid from "@/components/modules/menu/ProductGrid";
import { useMenuFilter } from "@/context/MenuFilterContext";

interface MenuClientProps {
    categories: Category[];
    products: Product[];
}

export default function MenuClient({ categories, products }: MenuClientProps) {
    // ─── Scroll refs ─────────────────────────────────────────────────────────────
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // ─── Mobile filter state from context (shared with MobileNavbar) ─────────────
    const { appliedShowOnlyAvailable } = useMenuFilter();

    // ─── Desktop filter state (local — only used by DesktopMenu) ─────────────────
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [tempShowOnlyAvailable, setTempShowOnlyAvailable] = useState(false);
    // Desktop applied state is separate from mobile context state
    const [desktopApplied, setDesktopApplied] = useState(false);

    // ─── Category selection state ─────────────────────────────────────────────────
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isManualSelection, setIsManualSelection] = useState(false);

    // ─── Derived data ─────────────────────────────────────────────────────────────

    /** Products grouped by category, filtered and sorted
     *  Uses appliedShowOnlyAvailable from context (covers both desktop & mobile) */
    const groupedItems = useMemo<{ [key: string]: Product[] }>(() => {
        // Combine desktop and mobile filter (either one can activate the filter)
        const showOnlyAvailable = desktopApplied || appliedShowOnlyAvailable;
        const grouped: { [key: string]: Product[] } = {};
        categories.forEach((category) => {
            grouped[category.id] = products
                .filter((p) => p.categoryId === category.id)
                .filter((p) => p.isActive)
                .filter((p) => !showOnlyAvailable || (p.stock as number) > 0)
                .sort((a, b) => a.name.localeCompare(b.name));
        });
        return grouped;
    }, [categories, products, desktopApplied, appliedShowOnlyAvailable]);

    /** Only categories that are active and have at least one visible product */
    const visibleCategories = useMemo(() => {
        return categories
            .filter((cat) => cat.isActive && (groupedItems[cat.id]?.length ?? 0) > 0)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [categories, groupedItems]);

    // ─── Responsive helpers ───────────────────────────────────────────────────────

    const getResponsiveOffset = (): number => {
        if (typeof window === "undefined") return 150;
        return window.innerWidth <= 768 ? 110 : 150;
    };

    const getResponsiveThreshold = (): number => {
        if (typeof window === "undefined") return 200;
        return window.innerWidth <= 768 ? 200 : 300;
    };

    // ─── Scroll-to-section ────────────────────────────────────────────────────────

    const scrollToSection = (categoryId: string) => {
        const targetRef = sectionRefs.current[categoryId];
        if (targetRef) {
            const offsetTop = targetRef.offsetTop - getResponsiveOffset();
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
    };

    // ─── Category click ───────────────────────────────────────────────────────────

    const handleCategoryClick = (categoryId: string) => {
        setIsManualSelection(true);
        setSelectedCategory(categoryId);
        scrollToSection(categoryId);
        setTimeout(() => setIsManualSelection(false), 500);
    };

    // ─── Init: set first category & reset scroll ──────────────────────────────────

    useEffect(() => {
        window.scrollTo(0, 0);
        setIsManualSelection(false);
    }, []);

    useEffect(() => {
        if (visibleCategories.length > 0 && !selectedCategory) {
            setSelectedCategory(visibleCategories[0].id);
        }
    }, [visibleCategories, selectedCategory]);

    // ─── Back / forward navigation reset ─────────────────────────────────────────

    useEffect(() => {
        const handlePopState = () => {
            window.scrollTo(0, 0);
            if (visibleCategories.length > 0) setSelectedCategory(visibleCategories[0].id);
            setIsManualSelection(false);
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [visibleCategories]);

    // ─── Scroll detection → auto-update active tab ────────────────────────────────

    const updateCategoryFromScroll = useCallback(() => {
        if (isManualSelection || visibleCategories.length === 0) return;
        const scrollPosition = window.scrollY;
        const threshold = getResponsiveThreshold();
        let currentSection = visibleCategories[0]?.id ?? "";

        for (const category of visibleCategories) {
            const ref = sectionRefs.current[category.id];
            if (ref && scrollPosition >= ref.offsetTop - threshold) {
                currentSection = category.id;
            }
        }
        if (currentSection && currentSection !== selectedCategory) {
            setSelectedCategory(currentSection);
        }
    }, [isManualSelection, visibleCategories, selectedCategory]);

    useEffect(() => {
        const tid = setTimeout(() => {
            window.addEventListener("scroll", updateCategoryFromScroll);
            window.addEventListener("resize", updateCategoryFromScroll);
        }, 100);
        return () => {
            clearTimeout(tid);
            window.removeEventListener("scroll", updateCategoryFromScroll);
            window.removeEventListener("resize", updateCategoryFromScroll);
        };
    }, [updateCategoryFromScroll]);

    // ─── Desktop filter handlers ──────────────────────────────────────────────────

    const toggleFilterDropdown = () => {
        const nextOpen = !showFilterDropdown;
        if (nextOpen) setTempShowOnlyAvailable(desktopApplied);
        setShowFilterDropdown(nextOpen);
    };

    const handleApplyFilter = () => {
        setDesktopApplied(tempShowOnlyAvailable);
        setShowFilterDropdown(false);
    };

    const handleCancelFilter = () => {
        setTempShowOnlyAvailable(desktopApplied);
        setShowFilterDropdown(false);
    };

    // Close desktop filter dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                showFilterDropdown &&
                !(e.target as Element).closest(".filter-dropdown-container")
            ) {
                setShowFilterDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showFilterDropdown]);

    return (
        <div>
            <div className="">
                {/* Desktop filter bar - desktop only */}
                <DesktopMenu
                    toggleFilterDropdown={toggleFilterDropdown}
                    showFilterDropdown={showFilterDropdown}
                    handleCancelFilter={handleCancelFilter}
                    tempShowOnlyAvailable={tempShowOnlyAvailable}
                    setTempShowOnlyAvailable={setTempShowOnlyAvailable}
                    handleApplyFilter={handleApplyFilter}
                />

                {/* Mobile stripe logo (shown above category tabs) */}
                <div className="flex md:hidden w-full justify-center items-center mt-3">
                    <Image src={IconFJBStripe} alt="Logo" width={40} height={16} />
                </div>

                {/* Sticky category tabs */}
                <CategoryTabs
                    categories={visibleCategories}
                    selectedCategory={selectedCategory}
                    onCategoryClick={handleCategoryClick}
                />

                {/* Product sections */}
                <ProductGrid
                    visibleCategories={visibleCategories}
                    groupedItems={groupedItems}
                    sectionRefs={sectionRefs}
                />
            </div>
        </div>
    );
}
