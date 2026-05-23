"use client";

import Image from "next/image";
import FilterIcon from "@/assets/svg/icon_filter.svg";

export default function DesktopMenu(
    {
        toggleFilterDropdown,
        showFilterDropdown,
        handleCancelFilter,
        tempShowOnlyAvailable,
        setTempShowOnlyAvailable,
        handleApplyFilter
    }: {
        toggleFilterDropdown: () => void,
        showFilterDropdown: boolean,
        handleCancelFilter: () => void,
        tempShowOnlyAvailable: boolean,
        setTempShowOnlyAvailable: (value: boolean) => void,
        handleApplyFilter: () => void
    }
) {
    return (
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
                    className="flex items-center justify-center w-8 h-8 border border-black rounded-full hover:cursor-pointer"
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
    )
}