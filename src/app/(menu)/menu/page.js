"use client";
import React from "react";
import Image from "next/image";
import { Card, CardContent, CardTitle, CardCategory } from "@/components/ui/card";
import { BreadcrumbWithCustomSeparator } from "@/components/site/BreadcrumbWithCustomSeparator";
import FilterIcon from "@/assets/svg/icon_filter.svg";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroCarousel } from "@/components/site/HeroCarousel";
// import StartOrder from "@/components/site/StartOrder";
import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg"

const categories = [
  { key: "foods", label: "Foods" },
  { key: "fruits", label: "Fruits" },
  { key: "juices", label: "Juices" },
  { key: "drinks", label: "Drinks" },
];

const items = [
  {
    id: 1,
    name: "Hot Tea",
    price: "৳499",
    image: "https://kfc.com.my/media/catalog/product/h/o/hot-tea.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    category: "foods",
  },
  {
    id: 2,
    name: "Iced Milo (M)",
    price: "৳199",
    image: "https://kfc.com.my/media/catalog/product/i/c/iced-milo-medium.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    category: "fruits",
  },
  {
    id: 3,
    name: "Sprite (M)",
    price: "৳99",
    image: "https://kfc.com.my/media/catalog/product/s/p/sprite-glass-large.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    category: "foods",
  },
  {
    id: 4,
    name: "Iced Americano (12oz)",
    price: "৳80",
    image: "https://kfc.com.my/media/catalog/product/i/c/icedamericano_1.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    category: "drinks",
  },
  {
    id: 5,
    name: "Spicy Chicken Bucket",
    price: "৳499",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    category: "foods",
  },
  {
    id: 6,
    name: "Classic Chicken Burger",
    price: "৳199",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
    category: "fruits",
  },
  {
    id: 7,
    name: "Crispy Fries",
    price: "৳99",
    image: "https://images.unsplash.com/photo-1568782947821-3d660dacc7cb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1176",
    category: "juices",
  },
  {
    id: 8,
    name: "Cold Cola",
    price: "৳80",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800",
    category: "drinks",
  },
  {
    id: 9,
    name: "Spicy Chicken Bucket",
    price: "৳499",
    image: "https://kfc.com.my/media/catalog/product/t/h/the_one_box_combo_a_coleslaw_.png?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=png",
    category: "foods",
  },
  {
    id: 10,
    name: "Classic Chicken Burger",
    price: "৳199",
    image: "https://kfc.com.my/media/catalog/product/6/p/6pcs_bucket_2.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    category: "fruits",
  },
  {
    id: 11,
    name: "Crispy Fries",
    price: "৳99",
    image: "https://kfc.com.my/media/catalog/product/2/-/2-pc_combo_k-cheese_crunch.png?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=png",
    category: "foods",
  },
  {
    id: 12,
    name: "Cold Cola",
    price: "৳80",
    image: "https://kfc.com.my/media/catalog/product/k/-/k-cheese_cheezila_kombo.png?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=png",
    category: "drinks",
  },
  {
    id: 13,
    name: "Spicy Chicken Bucket",
    price: "৳499",
    image: "https://kfc.com.my/media/catalog/product/2/p/2pc-combo-with-cerealcheezyfries.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    category: "foods",
  },
  {
    id: 14,
    name: "Classic Chicken Burger",
    price: "৳199",
    image: "https://kfc.com.my/media/catalog/product/s/a/savourytomatoegggravy.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    category: "fruits",
  },
  {
    id: 15,
    name: "Crispy Fries",
    price: "৳99",
    image: "https://kfc.com.my/media/catalog/product/6/p/6pcs_bucket_2.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    category: "juices",
  },
  {
    id: 16,
    name: "Cold Cola",
    price: "৳80",
    image: "https://kfc.com.my/media/catalog/product/p/m/pm-zinger-double-down-box-meal.jpg?quality=80&bg-color=255%2C255%2C255&fit=cover&height=1600&width=1280&auto=webp&format=pjpg",
    category: "drinks",
  },

];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = React.useState(false);
  const scrollContainerRef = React.useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const container = scrollContainerRef.current;
      if (direction === "left") {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleApplyFilter = () => {
    // Apply filter logic here
    setShowFilterDropdown(false);
  };

  const handleCancelFilter = () => {
    setShowFilterDropdown(false);
  };

  // Close dropdown when clicking outside and prevent scroll when dropdown is open
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterDropdown && !event.target.closest('.filter-dropdown-container')) {
        setShowFilterDropdown(false);
      }
    };

    // Prevent scroll when dropdown is open
    if (showFilterDropdown) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showFilterDropdown]);

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <div>
      {/* <StartOrder /> */}
      <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">

        <div className="hidden md:block" >
          <BreadcrumbWithCustomSeparator />
        </div>

        {/* Hero Carousel (mobile-first) */}
        <section className="relative isolate bg-white pt-0 pb-5 md:pt-6 md:pb-8">
          <HeroCarousel />
        </section>

        <div className="hidden">
          <Image
            src={IconFJBStripe}
            alt="Logo"
            width={40}
            height={16}
          ></Image>
        </div>

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
              className="flex items-center justify-center w-8 h-8 border-[1px] border-black rounded-full hover:cursor-pointer">
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
              <div className="absolute right-0 top-10 w-[376px] h-[450px] bg-white rounded-sm shadow-[0_4px_15px_rgba(0,0,0,0.3)] z-50 scrollbar-none">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                  <h3 className="text-sm leading-[14px] font-semibold text-black">Filters</h3>
                  <button
                    onClick={handleCancelFilter}
                    className="bg-[#969696] px-6 py-3 rounded-full text-sm leading-5 font-medium text-white hover:cursor-pointer">
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
                    <label htmlFor="showOnlyAvailable" className="text-base leading-6 font-medium text-black">
                      Show Only Available Item
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-200">
                  <button
                    onClick={handleApplyFilter}
                    className="w-full bg-primary text-base leading-[20px] text-white py-3 rounded-full font-medium hover:cursor-pointer">
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
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-[47.5px] bg-white px-[10px] hover:cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-[#333333]" />
            </button>
            <div
              ref={scrollContainerRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth text-sm leading-[18px] font-medium px-10"
            >
              <button
                className={`px-4 h-[47.5px] hover:cursor-pointer border-b-[3px] whitespace-nowrap transition-all duration-200 ${selectedCategory === 'all' ? 'text-primary  border-primary' : 'text-[#0009] border-transparent'}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Items
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={`px-4 h-[47.5px] hover:cursor-pointer border-b-[3px] whitespace-nowrap transition-colors duration-200 ${selectedCategory === cat.key ? 'text-primary border-primary' : 'text-[#0009] border-transparent'}`}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-[47.5px] bg-white px-[10px] hover:cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <CardCategory>
          Limited Time Only
        </CardCategory>
        <div className="my-8 grid gap-x-5 gap-y-5 sm:gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
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
                  <CardTitle className="text-base mt-2">{item.name}</CardTitle>
                  <div className="mt-2 flex-col items-center justify-between">
                    <button className="bg-[#A7A7A7] px-2.5 py-1.5 rounded-sm">
                      <p className="text-[11px] leading-[14px] font-normal text-white">
                        {/* {item.category} */}
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
          ))}
        </div>
      </div>
    </div>
  );
}
