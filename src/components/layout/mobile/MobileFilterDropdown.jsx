"use client";

import React from "react";
import { useMenuFilter } from "@/context/MenuFilterContext";

/**
 * MobileFilterDropdown renders ONLY the bottom sheet.
 * The trigger button lives in MobileNavbar.
 * All state is managed via MenuFilterContext.
 */
const MobileFilterDropdown = () => {
  const {
    appliedShowOnlyAvailable,
    setAppliedShowOnlyAvailable,
    isMobileFilterOpen,
    closeMobileFilter,
  } = useMenuFilter();

  // Local temp value — synced when sheet opens
  const [tempValue, setTempValue] = React.useState(appliedShowOnlyAvailable);

  // Sync temp with applied value whenever sheet opens
  React.useEffect(() => {
    if (isMobileFilterOpen) {
      setTempValue(appliedShowOnlyAvailable);
    }
  }, [isMobileFilterOpen, appliedShowOnlyAvailable]);

  // Prevent body scroll when sheet is open
  React.useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen]);

  const handleApply = () => {
    setAppliedShowOnlyAvailable(tempValue);
    closeMobileFilter();
  };

  const handleCancel = () => {
    setTempValue(appliedShowOnlyAvailable); // discard changes
    closeMobileFilter();
  };

  if (!isMobileFilterOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <button
        aria-label="Close filters"
        onClick={handleCancel}
        className="absolute inset-0 bg-black/50"
      />

      {/* Bottom Sheet */}
      <div className="relative w-full h-[203px] bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pt-5 pb-4 px-5">
          <h3 className="text-base leading-[20px] font-semibold text-black">
            Filters
          </h3>
          <button
            onClick={handleCancel}
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
              checked={tempValue}
              onChange={(e) => setTempValue(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="mobileShowOnlyAvailable"
              className="text-base leading-6 font-medium text-black cursor-pointer"
            >
              Show Only Available Item
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-3 left-0 right-0 p-5">
          <button
            onClick={handleApply}
            className="w-full bg-primary text-white py-3 rounded-full font-medium hover:cursor-pointer text-base leading-5"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDropdown;
