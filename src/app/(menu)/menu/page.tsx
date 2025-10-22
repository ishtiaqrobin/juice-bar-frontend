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
import FilterIcon from "@/assets/svg/icon_filter.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroCarousel } from "@/components/site/HeroCarousel";
// import StartOrder from "@/components/site/StartOrder";
import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg";

interface Category {
  id: string;
  key: string;
  label: string;
  order: number;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  categoryId: string;
  description?: string;
  isAvailable: boolean;
  order: number;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// API Functions
const fetchCategories = async (): Promise<Category[]> => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch("/api/categories");
    const result: ApiResponse<Category[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback to default categories
    return [
      { id: "1", key: "fruits", label: "Fruits", order: 1, isActive: true },
      { id: "2", key: "juices", label: "Juices", order: 2, isActive: true },
      { id: "3", key: "drinks", label: "Drinks", order: 3, isActive: true },
    ];
  }
};

const fetchProducts = async (): Promise<Product[]> => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch("/api/products");
    const result: ApiResponse<Product[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to default products
    return getDefaultProducts();
  }
};

// Default products for fallback
const getDefaultProducts = (): Product[] => [
  {
    id: "1",
    name: "Hot Tea",
    price: "৳499",
    image:
      "https://kfc.com.my/media/catalog/product/h/o/hot-tea.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    categoryId: "2",
    isAvailable: true,
    order: 1,
  },
  {
    id: "2",
    name: "Iced Milo (M)",
    price: "৳199",
    image:
      "https://kfc.com.my/media/catalog/product/i/c/iced-milo-medium.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    categoryId: "1",
    isAvailable: true,
    order: 2,
  },
  {
    id: "3",
    name: "Sprite (M)",
    price: "৳99",
    image:
      "https://kfc.com.my/media/catalog/product/s/p/sprite-glass-large.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    categoryId: "1",
    isAvailable: true,
    order: 3,
  },
  {
    id: "4",
    name: "Iced Americano (12oz)",
    price: "৳80",
    image:
      "https://kfc.com.my/media/catalog/product/i/c/icedamericano_1.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    categoryId: "2",
    isAvailable: true,
    order: 4,
  },
  {
    id: "5",
    name: "Spicy Chicken Bucket",
    price: "৳499",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    categoryId: "3",
    isAvailable: true,
    order: 5,
  },
  {
    id: "6",
    name: "Classic Chicken Burger",
    price: "৳199",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
    categoryId: "1",
    isAvailable: true,
    order: 6,
  },
  {
    id: "7",
    name: "Crispy Fries",
    price: "৳99",
    image:
      "https://images.unsplash.com/photo-1568782947821-3d660dacc7cb?auto=format&fit=crop&q=80&w=1176",
    categoryId: "3",
    isAvailable: true,
    order: 7,
  },
  {
    id: "8",
    name: "Cold Cola",
    price: "৳80",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800",
    categoryId: "2",
    isAvailable: true,
    order: 8,
  },
  {
    id: "9",
    name: "Spicy Chicken Bucket",
    price: "৳499",
    image:
      "https://kfc.com.my/media/catalog/product/t/h/the_one_box_combo_a_coleslaw_.png?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=png",
    categoryId: "3",
    isAvailable: true,
    order: 9,
  },
  {
    id: "10",
    name: "Classic Chicken Burger",
    price: "৳199",
    image:
      "https://kfc.com.my/media/catalog/product/6/p/6pcs_bucket_2.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    categoryId: "1",
    isAvailable: true,
    order: 10,
  },
  {
    id: "11",
    name: "Crispy Fries",
    price: "৳99",
    image:
      "https://kfc.com.my/media/catalog/product/2/-/2-pc_combo_k-cheese_crunch.png?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=png",
    categoryId: "3",
    isAvailable: true,
    order: 11,
  },
  {
    id: "12",
    name: "Cold Cola",
    price: "৳80",
    image:
      "https://kfc.com.my/media/catalog/product/k/-/k-cheese_cheezila_kombo.png?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=png",
    categoryId: "2",
    isAvailable: true,
    order: 12,
  },
  {
    id: "13",
    name: "Spicy Chicken Bucket",
    price: "৳499",
    image:
      "https://kfc.com.my/media/catalog/product/2/p/2pc-combo-with-cerealcheezyfries.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    categoryId: "3",
    isAvailable: true,
    order: 13,
  },
  {
    id: "14",
    name: "Classic Chicken Burger",
    price: "৳199",
    image:
      "https://kfc.com.my/media/catalog/product/s/a/savourytomatoegggravy.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    categoryId: "1",
    isAvailable: true,
    order: 14,
  },
  {
    id: "15",
    name: "Crispy Fries",
    price: "৳99",
    image:
      "https://kfc.com.my/media/catalog/product/6/p/6pcs_bucket_2.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    categoryId: "3",
    isAvailable: true,
    order: 15,
  },
  {
    id: "16",
    name: "Cold Cola",
    price: "৳80",
    image:
      "https://kfc.com.my/media/catalog/product/p/m/pm-zinger-double-down-box-meal.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    categoryId: "2",
    isAvailable: true,
    order: 16,
  },
  {
    id: "17",
    name: "Hot Tea",
    price: "৳499",
    image:
      "https://kfc.com.my/media/catalog/product/g/a/garlic_aioli_fries-menu.png?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=png",
    categoryId: "3",
    isAvailable: true,
    order: 17,
  },
  {
    id: "18",
    name: "Iced Milo (M)",
    price: "৳199",
    image:
      "https://kfc.com.my/media/catalog/product/c/e/cempedak-pie.png?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=png",
    categoryId: "1",
    isAvailable: true,
    order: 18,
  },
  {
    id: "19",
    name: "Sprite (M)",
    price: "৳99",
    image:
      "https://kfc.com.my/media/catalog/product/s/t/strawberry_cheese_mochi_menu.png?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=png",
    categoryId: "3",
    isAvailable: true,
    order: 19,
  },
  {
    id: "20",
    name: "Iced Americano (12oz)",
    price: "৳80",
    image:
      "https://kfc.com.my/media/catalog/product/c/e/cerealcheezyfries-_m_.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    categoryId: "2",
    isAvailable: true,
    order: 20,
  },
  // Add more default products as needed
];

export default function MenuPage(): JSX.Element {
  // Dynamic data states
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // UI states
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [showFilterDropdown, setShowFilterDropdown] =
    React.useState<boolean>(false);
  const [showOnlyAvailable, setShowOnlyAvailable] =
    React.useState<boolean>(false);
  const [isManualSelection, setIsManualSelection] =
    React.useState<boolean>(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Dynamic refs for each product section
  const sectionRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );

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

  // Data fetching effect
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);

        setCategories(categoriesData);
        setProducts(productsData);

        // Set first category as selected if available
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].key);
        }
      } catch (err) {
        setError("Failed to load menu data");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  // Function to scroll to specific section
  const scrollToSection = (categoryKey: string): void => {
    const targetRef = sectionRefs.current[categoryKey];

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
  const handleCategoryClick = (category: string): void => {
    setIsManualSelection(true);
    setSelectedCategory(category);
    scrollToSection(category);

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
        setSelectedCategory(categories[0].key);
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
      let currentSection = categories[0]?.key || "";

      for (const category of categories) {
        const sectionRef = sectionRefs.current[category.key];
        if (sectionRef) {
          const sectionTop = sectionRef.offsetTop;
          if (scrollPosition >= sectionTop - threshold) {
            currentSection = category.key;
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
        let currentSection = categories[0]?.key || "";

        for (const category of categories) {
          const sectionRef = sectionRefs.current[category.key];
          if (sectionRef) {
            const sectionTop = sectionRef.offsetTop;
            if (scrollPosition >= sectionTop - threshold) {
              currentSection = category.key;
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
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleApplyFilter = (): void => {
    // Apply filter logic here
    setShowFilterDropdown(false);
  };

  const handleCancelFilter = (): void => {
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

    categories.forEach((category) => {
      grouped[category.key] = products
        .filter((product) => product.categoryId === category.id)
        .filter((product) => !showOnlyAvailable || product.isAvailable)
        .sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [categories, products, showOnlyAvailable]);

  // Loading component
  if (loading) {
    return (
      <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
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
      <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">
        <div className="hidden md:block mb-3">
          <Image src={IconFJBStripe} alt="Logo" width={40} height={16}></Image>
        </div>

        <div className="hidden md:block">
          <BreadcrumbWithCustomSeparator />
        </div>

        {/* Hero Carousel (mobile-first) */}
        <section className="relative isolate bg-white pt-0 pb-5 md:pt-6 md:pb-8">
          <HeroCarousel />
        </section>

        {/* desktop menu */}
        <div className="mt-4 mb- hidden md:flex items-center justify-between">
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
              <div className="absolute right-0 top-10 w-[376px] h-[450px] bg-white rounded-sm shadow-[0_4px_15px_rgba(0,0,0,0.3)] z-50">
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
                      checked={showOnlyAvailable}
                      onChange={(e) => setShowOnlyAvailable(e.target.checked)}
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
              className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth text-sm leading-[18px] font-medium px-10"
            >
              {categories
                .filter((cat) => cat.isActive)
                .sort((a, b) => a.order - b.order)
                .map((cat) => (
                  <button
                    key={cat.key}
                    className={`px-4 h-[47.5px] hover:cursor-pointer border-b-[3px] whitespace-nowrap transition-colors duration-200 ${
                      selectedCategory === cat.key
                        ? "text-primary border-primary"
                        : "text-[#0009] border-transparent"
                    }`}
                    onClick={() => handleCategoryClick(cat.key)}
                  >
                    {cat.label}
                  </button>
                ))}
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
        {categories
          .filter((cat) => cat.isActive)
          .sort((a, b) => a.order - b.order)
          .map((category) => (
            <div
              key={category.key}
              ref={(el) => {
                sectionRefs.current[category.key] = el;
              }}
            >
              <CardCategory>{category.label}</CardCategory>
              <div className="my-8 grid gap-x-5 gap-y-5 sm:gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {groupedItems[category.key]?.map((item) => (
                  <Card key={item.id} className="">
                    <CardContent className="flex flex-row sm:flex-col gap-4 sm:gap-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={220}
                        height={220}
                        className="sm:h-[220px] sm:w-[220px] sm:mx-0 mx-2.5 h-[100px] w-[100px] sm:rounded-xl rounded-lg object-cover"
                      />
                      {/* card name, tag and price */}
                      <div>
                        <CardTitle className="text-base mt-2">
                          {item.name}
                        </CardTitle>
                        <div className="mt-2 flex-col items-center justify-between">
                          <button className="bg-[#A7A7A7] px-2.5 py-1.5 rounded-sm">
                            <p className="text-[11px] leading-[14px] font-normal text-white">
                              New!
                            </p>
                          </button>
                          <p className="mt-2 text-[17px] leading-[22px] font-bold text-black">
                            {item.price}.00
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || []}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
