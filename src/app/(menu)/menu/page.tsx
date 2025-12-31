"use client";

import React, { JSX } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardTitle,
  CardCategory,
} from "@/components/ui/card";
import { BreadcrumbWithCustomSeparator } from "@/components/site/BreadcrumbWithCustomSeparator";
import { Skeleton } from "@/components/ui/skeleton";
import FilterIcon from "@/assets/svg/icon_filter.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroCarousel } from "@/components/site/HeroCarousel";
// import StartOrder from "@/components/site/StartOrder";
import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg";
import { api } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  // description?: string;
  // image?: string;
  isActive: boolean;
  products?: Product[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  categoryId: string;
  // description?: string;
  isActive: boolean;
  featured?: string | null;
  stock: number;
  discountPrice?: number | null;
  discountPercentage?: number | null;
  category?: Category;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Optimized Product Image Component for mobile users
const ProductImage = ({
  src,
  alt,
  className,
  width = 220,
  height = 220
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [imageQuality, setImageQuality] = React.useState(75);

  React.useEffect(() => {
    // Network-aware quality adjustment for mobile users
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const nav = navigator as Navigator & {
        connection?: { effectiveType?: string };
        mozConnection?: { effectiveType?: string };
        webkitConnection?: { effectiveType?: string };
      };
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === '4g') {
          setImageQuality(100);
        } else if (effectiveType === '3g') {
          setImageQuality(80);
        } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
          setImageQuality(60);
        }
      }
    }
  }, []);

  // Generate blur placeholder (tiny base64 image)
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f0f0f0" offset="20%" />
          <stop stop-color="#e0e0e0" offset="50%" />
          <stop stop-color="#f0f0f0" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f0f0f0" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  return (
    <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg sm:rounded-xl" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-all duration-500 ease-in  ${isLoading ? 'opacity-0 scale-' : 'opacity-100 scale-'
          }`}
        onLoadingComplete={() => setIsLoading(false)}
        loading="lazy"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
        sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, (max-width: 1024px) 180px, 220px"
        quality={imageQuality}
        priority={false}
      />
    </div>
  );
};

// Helper function to add cache-busting query parameter
const getCacheBustedImageUrl = (imageUrl: string | null | undefined, updatedAt: Date | string): string => {
  if (!imageUrl) return imageUrl || '';
  const timestamp = new Date(updatedAt).getTime();
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${imageUrl}${separator}v=${timestamp}`;
};

export default function MenuPage(): JSX.Element {
  // State for data
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categoriesLoading, setCategoriesLoading] = React.useState(true);
  const [productsLoading, setProductsLoading] = React.useState(true);
  const [categoriesError, setCategoriesError] = React.useState(false);
  const [productsError, setProductsError] = React.useState(false);

  // Fetch data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setCategoriesLoading(true);
        const catResponse = await api.categories.getAll();
        setCategories(catResponse.data.data || []);
        setCategoriesError(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoriesError(true);
      } finally {
        setCategoriesLoading(false);
      }

      try {
        setProductsLoading(true);
        const prodResponse = await api.products.getAll();
        setProducts(prodResponse.data.data || []);
        setProductsError(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductsError(true);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, []);

  // UI states
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [showFilterDropdown, setShowFilterDropdown] =
    React.useState<boolean>(false);
  const [appliedShowOnlyAvailable, setAppliedShowOnlyAvailable] =
    React.useState<boolean>(false);
  const [tempShowOnlyAvailable, setTempShowOnlyAvailable] =
    React.useState<boolean>(false);
  const [isManualSelection, setIsManualSelection] =
    React.useState<boolean>(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Dynamic refs for each product section
  const sectionRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );
  // Refs and state for animated tab indicator
  const tabRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [tabIndicator, setTabIndicator] = React.useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  const handleScroll = (direction: "left" | "right"): void => {
    if (scrollContainerRef.current) {
      const scrollAmount = 150; // 150px scroll amount for each scroll
      const container = scrollContainerRef.current;
      if (direction === "left") {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  };

  // Set first category as selected when categories load
  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Function to get responsive offset based on screen size
  const getResponsiveOffset = (): number => {
    if (typeof window === "undefined") return 150; // SSR fallback

    const screenWidth = window.innerWidth;

    // Mobile devices (up to 768px)
    if (screenWidth <= 768) {
      return 110; // Smaller offset for mobile
    }
    // Desktop devices (769px and above)
    else {
      return 150; // Full offset for desktop
    }
  };

  // Function to get responsive threshold based on screen size
  const getResponsiveThreshold = (): number => {
    if (typeof window === "undefined") return 200; // SSR fallback

    const screenWidth = window.innerWidth;

    // Mobile devices (up to 768px)
    if (screenWidth <= 768) {
      return 200; // Smaller threshold for mobile
    }
    // Desktop devices (769px and above)
    else {
      return 300; // Larger threshold for desktop
    }
  };

  // Update animated underline indicator to match active tab
  const updateTabIndicator = React.useCallback(() => {
    const activeBtn = selectedCategory
      ? tabRefs.current[selectedCategory]
      : null;
    const scrollEl = scrollContainerRef.current;
    if (!activeBtn || !scrollEl) return;
    const leftWithinScroll = activeBtn.offsetLeft - scrollEl.scrollLeft;
    setTabIndicator({ left: leftWithinScroll, width: activeBtn.offsetWidth });
  }, [selectedCategory]);

  // Recompute indicator position when active tab changes, tabs scroll, or window resizes
  React.useEffect(() => {
    updateTabIndicator();
    const onResize = () => updateTabIndicator();
    window.addEventListener("resize", onResize);
    const scrollEl = scrollContainerRef.current;
    const onScroll = () => updateTabIndicator();
    if (scrollEl) scrollEl.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      if (scrollEl) scrollEl.removeEventListener("scroll", onScroll);
    };
  }, [updateTabIndicator, categories]);

  // Function to scroll to specific section
  const scrollToSection = (categoryId: string): void => {
    const targetRef = sectionRefs.current[categoryId];

    if (targetRef) {
      const offset = getResponsiveOffset();
      const offsetTop = targetRef.offsetTop - offset;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Handle category tab click
  const handleCategoryClick = (categoryId: string): void => {
    setIsManualSelection(true);
    setSelectedCategory(categoryId);
    scrollToSection(categoryId);

    // Reset manual selection flag after scroll animation completes
    setTimeout(() => {
      setIsManualSelection(false);
    }, 500); // 500ms delay to allow scroll animation to complete
  };

  // Initial page load - reset scroll position and set initial category
  React.useEffect(() => {
    // Reset scroll position to top on page load
    window.scrollTo(0, 0);

    // Reset manual selection flag
    setIsManualSelection(false);
  }, []);

  // Handle browser back/forward navigation
  React.useEffect(() => {
    const handlePopState = (): void => {
      // Reset to top and first category on navigation
      window.scrollTo(0, 0);
      if (categories.length > 0) {
        setSelectedCategory(categories[0].id);
      }
      setIsManualSelection(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [categories]);

  // Scroll detection for automatic tab selection
  React.useEffect(() => {
    const handleScrollDetection = (): void => {
      // Skip scroll detection if user is manually selecting categories
      if (isManualSelection || categories.length === 0) {
        return;
      }

      const scrollPosition = window.scrollY;
      const threshold = getResponsiveThreshold();

      // Find which section is currently in view
      let currentSection = categories[0]?.id || "";

      for (const category of categories) {
        const sectionRef = sectionRefs.current[category.id];
        if (sectionRef) {
          const sectionTop = sectionRef.offsetTop;
          if (scrollPosition >= sectionTop - threshold) {
            currentSection = category.id;
          }
        }
      }

      if (currentSection && currentSection !== selectedCategory) {
        setSelectedCategory(currentSection);
      }
    };

    // Add a small delay to ensure DOM is ready before adding scroll listener
    const timeoutId = setTimeout(() => {
      window.addEventListener("scroll", handleScrollDetection);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScrollDetection);
    };
  }, [isManualSelection, categories, selectedCategory]);

  // Handle window resize for responsive offset updates
  React.useEffect(() => {
    const handleResize = (): void => {
      // Force re-evaluation of scroll detection with new threshold
      if (categories.length > 0) {
        const scrollPosition = window.scrollY;
        const threshold = getResponsiveThreshold();
        let currentSection = categories[0]?.id || "";

        for (const category of categories) {
          const sectionRef = sectionRefs.current[category.id];
          if (sectionRef) {
            const sectionTop = sectionRef.offsetTop;
            if (scrollPosition >= sectionTop - threshold) {
              currentSection = category.id;
            }
          }
        }

        if (currentSection && currentSection !== selectedCategory) {
          setSelectedCategory(currentSection);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [categories, selectedCategory]);

  const toggleFilterDropdown = (): void => {
    const nextOpen = !showFilterDropdown;
    if (nextOpen) {
      setTempShowOnlyAvailable(appliedShowOnlyAvailable);
    }
    setShowFilterDropdown(nextOpen);
  };

  const handleApplyFilter = (): void => {
    setAppliedShowOnlyAvailable(tempShowOnlyAvailable);
    setShowFilterDropdown(false);
  };

  const handleCancelFilter = (): void => {
    setTempShowOnlyAvailable(appliedShowOnlyAvailable);
    setShowFilterDropdown(false);
  };

  // Close dropdown when clicking outside and prevent scroll when dropdown is open
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        showFilterDropdown &&
        !(event.target as Element).closest(".filter-dropdown-container")
      ) {
        setShowFilterDropdown(false);
      }
    };

    // Prevent scroll when dropdown is open
    // if (showFilterDropdown) {
    //   document.body.style.overflow = 'hidden';
    // } else {
    //   document.body.style.overflow = 'unset';
    // }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // document.body.style.overflow = 'unset';
    };
  }, [showFilterDropdown]);

  // Group items by category for display
  const groupedItems: { [key: string]: Product[] } = React.useMemo(() => {
    const grouped: { [key: string]: Product[] } = {};

    categories.forEach((category: Category) => {
      grouped[category.id] = products
        .filter((product: Product) => product.categoryId === category.id)
        .filter((product: Product) => product.isActive)
        .filter(
          (product: Product) => !appliedShowOnlyAvailable || product.stock > 0
        )
        .sort((a: Product, b: Product) => a.name.localeCompare(b.name));
    });

    return grouped;
  }, [categories, products, appliedShowOnlyAvailable]);


  // Error component
  if (categoriesError || productsError) {
    return (
      <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load menu data</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <div className="mt-1 md:mt-0 px-4 md:px-0">
        <StartOrder />
      </div> */}

      {/* Logo */}
      <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">
        <div className="hidden md:block mb-3">
          <Image src={IconFJBStripe} alt="Logo" width={40} height={16}></Image>
        </div>

        {/* Breadcrumb */}
        <div className="hidden md:block">
          <BreadcrumbWithCustomSeparator />
        </div>

        {/* Hero Carousel (mobile-first) */}
        <section className="relative isolate bg-white pt-0 pb-5 md:pt-6 md:pb-8">
          <HeroCarousel />
        </section>

        {/* Desktop menu */}
        <div className="mt-4 hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-[31px] leading-[37px] font-bold tracking-normal text-stone-900">
              MENU
            </h1>
          </div>

          {/* Desktop filter button */}
          <div className="relative filter-dropdown-container">
            <button
              onClick={toggleFilterDropdown}
              className="flex items-center justify-center w-8 h-8 border-[1px] border-black rounded-full hover:cursor-pointer"
            >
              <Image
                src={FilterIcon}
                alt="Filter Icon"
                width={14.56}
                height={14.56}
                className="h-[14.56px] w-[14.56px] object-cover"
              />
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute right-0 top-10 w-[350px] h-[400px] bg-white rounded-sm shadow-[0_4px_15px_rgba(0,0,0,0.3)] z-50">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                  <h3 className="text-sm leading-[14px] font-semibold text-black">
                    Filters
                  </h3>
                  <button
                    onClick={handleCancelFilter}
                    className="bg-[#969696] px-6 py-3 rounded-full text-sm leading-5 font-medium text-white hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showOnlyAvailable"
                      checked={tempShowOnlyAvailable}
                      onChange={(e) =>
                        setTempShowOnlyAvailable(e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="showOnlyAvailable"
                      className="text-base leading-6 font-medium text-black"
                    >
                      Show Only Available Item
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-200">
                  <button
                    onClick={handleApplyFilter}
                    className="w-full bg-primary text-base leading-[20px] text-white py-3 rounded-full font-medium hover:cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="sticky top-[70px] z-40 bg-white">
          <div className="flex md:hidden w-full justify-center items-center ">
            <Image
              src={IconFJBStripe}
              alt="Logo"
              width={40}
              height={16}
            ></Image>
          </div>
          <div className="relative bg-white mt-3 md:mt-5 h-[48px] mb-8 border-t border-[#EFEFF0] shadow-[0_5px_4px_-3px_rgba(0,0,0,0.1)] md:shadow-[0_5px_4px_-2px_rgba(0,0,0,0.1)]">
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-[47.5px] bg-white px-[10px] hover:cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-[#333333]" />
            </button>
            <div
              ref={scrollContainerRef}
              className="relative flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth text-sm leading-[18px] font-medium px-10"
            >
              {categoriesLoading ? (
                // Skeleton for category tabs
                <>
                  <Skeleton className="h-[25px] w-24 my-2.5" />
                  <Skeleton className="h-[25px] w-24 my-2.5" />
                  <Skeleton className="h-[25px] w-24 my-2.5" />
                  <Skeleton className="h-[25px] w-24 my-2.5" />
                  <Skeleton className="h-[25px] w-24 my-2.5" />
                  <Skeleton className="h-[25px] w-24 my-2.5" />
                  <Skeleton className="h-[25px] w-24 my-2.5" />
                </>
              ) : (
                <>
                  {categories
                    .filter((cat: Category) => cat.isActive)
                    .sort((a: Category, b: Category) =>
                      a.name.localeCompare(b.name)
                    )
                    .map((cat: Category) => (
                      <button
                        key={cat.id}
                        ref={(el) => {
                          tabRefs.current[cat.id] = el;
                        }}
                        className={`px-4 h-[47.5px] hover:cursor-pointer whitespace-nowrap transition-colors duration-200 ${selectedCategory === cat.id
                          ? "text-primary"
                          : "text-[#0009]"
                          }`}
                        onClick={() => handleCategoryClick(cat.id)}
                      >
                        {cat.name}
                      </button>
                    ))}
                  {/* Animated underline indicator */}
                  <span
                    className="pointer-events-none absolute bottom-0 h-[2px] bg-primary transition-all duration-300 ease-out"
                    style={{
                      left: `${tabIndicator.left}px`,
                      width: `${tabIndicator.width}px`,
                    }}
                  />
                </>
              )}
            </div>
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-[47.5px] bg-white px-[10px] hover:cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Display products by groups - Dynamic */}
        <div className="mb-24 md:mb-0">
          {categoriesLoading || productsLoading ? (
            // Skeleton for loading state
            <div className="space-y-8">
              {[1, 2].map((section) => (
                <div key={section}>
                  <Skeleton className="h-8 w-40 mb-6" />
                  <div className="grid gap-x-5 gap-y-5 sm:gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((card) => (
                      <div key={card}>
                        {/* Mobile: Horizontal layout */}
                        <div className="flex sm:hidden flex-row gap-4">
                          <Skeleton className="mx-2.5 h-[100px] w-[100px] rounded-lg flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                        </div>
                        {/* Desktop: Vertical layout */}
                        <div className="hidden sm:flex flex-col space-y-3">
                          <Skeleton className="h-[220px] w-[220px] rounded-xl" />
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Actual products
            categories
              .filter((cat: Category) => cat.isActive)
              .sort((a: Category, b: Category) => a.name.localeCompare(b.name))
              .map((category: Category) => (
                <div
                  key={category.id}
                  ref={(el) => {
                    sectionRefs.current[category.id] = el;
                  }}
                >
                  <CardCategory>{category.name}</CardCategory>
                  <div className="my-8 grid gap-x-5 gap-y-5 sm:gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {groupedItems[category.id]?.map((item: Product) => (
                      <Card
                        key={item.id}
                        className={`${item.stock <= 0 ? "opacity-75" : ""}`}
                      >
                        <CardContent className="flex flex-row sm:flex-col gap-4 sm:gap-0">
                          <div className="relative">
                            <Image
                              src={getCacheBustedImageUrl(item.image, item.updatedAt)}
                              alt={item.name}
                              width={220}
                              height={220}
                              className={`sm:h-[220px] sm:w-[220px] sm:mx-0 mx-2.5 h-[100px] w-[100px] sm:rounded-xl rounded-lg object-cover ${item.stock <= 0 ? "grayscale" : ""
                                }`}
                            />
                            {item.stock <= 0 && (
                              <Image
                                src={getCacheBustedImageUrl(item.image, item.updatedAt)}
                                alt={item.name}
                                width={220}
                                height={220}
                                className={`absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center sm:h-[220px] sm:w-[220px] sm:mx-0 mx-2.5 h-[100px] w-[100px] sm:rounded-xl rounded-lg object-cover ${item.stock <= 0 ? "grayscale" : ""
                                  }`}
                              />
                            )}
                          </div>
                          {/* card name, tag and price */}
                          <div>
                            <CardTitle className="text-base mt-2">
                              {item.name}
                            </CardTitle>
                            <div className="mt-2 flex-col items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {item.featured && (
                                  <button className="bg-[#A7A7A7] px-2.5 py-1.5 rounded">
                                    <p className="text-[11px] leading-[14px] font-normal text-white">
                                      {item.featured}
                                    </p>
                                  </button>
                                )}
                                {item.stock <= 0 && (
                                  <span className="bg-red-600 text-white px-2 py-1 rounded text-[11px] font-semibold">
                                    Out of Stock
                                  </span>
                                )}
                                {/* {item.stock > 0 && item.stock <= 5 && (
                                <span className="bg-orange-500 text-white px-2 py-1 rounded text-[11px] font-bold">
                                  Low Stock
                                </span>
                              )} */}
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                {item.discountPrice ? (
                                  <>
                                    <span
                                      className={`text-[17px] leading-[22px] font-bold ${item.stock <= 0
                                        ? "text-gray-500"
                                        : "text-red-600"
                                        }`}
                                    >
                                      ৳{formatPrice(item.discountPrice)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      ৳{formatPrice(item.price)}
                                    </span>
                                    {item.discountPercentage && (
                                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                        -{formatPrice(item.discountPercentage)}%
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span
                                    className={`text-[17px] leading-[22px] font-bold ${item.stock <= 0
                                      ? "text-gray-500"
                                      : "text-black"
                                      }`}
                                  >
                                    ৳{formatPrice(item.price)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) || []}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
