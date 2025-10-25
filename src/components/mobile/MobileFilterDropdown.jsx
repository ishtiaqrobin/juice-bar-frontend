"use client";

import React from "react";
import Image from "next/image";
import FilterIcon from "@/assets/svg/icon_filter.svg";
import { usePathname, useRouter } from "next/navigation";

const MobileFilterDropdown = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showMobileFilterDropdown, setShowMobileFilterDropdown] =
    React.useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = React.useState(false);

  const toggleMobileFilterDropdown = () => {
    setShowMobileFilterDropdown(!showMobileFilterDropdown);
  };

  const handleApplyMobileFilter = () => {
    // Apply filter logic here
    setShowMobileFilterDropdown(false);
  };

  const handleCancelMobileFilter = () => {
    setShowMobileFilterDropdown(false);
  };

  // Close dropdown when clicking outside and prevent scroll when dropdown is open
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMobileFilterDropdown &&
        !event.target.closest(".mobile-filter-dropdown-container")
      ) {
        setShowMobileFilterDropdown(false);
      }
    };

    // Prevent scroll when dropdown is open
    if (showMobileFilterDropdown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showMobileFilterDropdown]);

  return (
    <div className="relative mobile-filter-dropdown-container">
      <button
        onClick={toggleMobileFilterDropdown}
        className="flex items-center justify-center w-[30px] h-[30px] border-[1px] border-black rounded-full hover:cursor-pointer"
      >
        <Image
          src={FilterIcon}
          alt="Filter Icon"
          width={16}
          height={16}
          className="h-[16px] w-[16px] object-cover"
        />
      </button>

      {/* Mobile Filter Bottom Sheet */}
      {showMobileFilterDropdown && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <button
            aria-label="Close filters"
            onClick={handleCancelMobileFilter}
            className="absolute inset-0 bg-black/50"
          />

          {/* Sheet */}
          <div className="relative w-full h-[203px] bg-white overflow-hidden mobile-filter-dropdown-container">
            {/* Header */}
            <div className="flex items-center justify-between pt-5 pb-4 px-5">
              <h3 className="text-base leading-[20px] font-semibold text-black">
                Filters
              </h3>
              <button
                onClick={handleCancelMobileFilter}
                className="bg-[#969696] px-6 py-3 rounded-full text-base leading-5 font-medium text-white hover:cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Content */}
            <div className="px-5">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="mobileShowOnlyAvailable"
                  checked={showOnlyAvailable}
                  onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="mobileShowOnlyAvailable"
                  className="text-base leading-6 font-medium text-black"
                >
                  Show Only Available Item
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-3 left-0 right-0 p-5 bg-">
              <button
                onClick={handleApplyMobileFilter}
                className="w-full bg-primary text-white py-3 rounded-full font-medium hover:cursor-pointer text-base leading-5"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFilterDropdown;
