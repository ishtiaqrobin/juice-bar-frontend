"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardTitle, CardCategory } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { Category } from "@/types/category.type";
import { Product } from "@/types/product.type";

interface GroupedItems {
    [categoryId: string]: Product[];
}

interface ProductGridProps {
    visibleCategories: Category[];
    groupedItems: GroupedItems;
    sectionRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ item }: { item: Product }) {
    const isOutOfStock = (item.stock as number) <= 0;

    return (
        <Card className={isOutOfStock ? "opacity-75" : ""}>
            <CardContent className="flex flex-row sm:flex-col gap-4 sm:gap-0">
                {/* Image */}
                <div className="relative">
                    <Image
                        src={item.image || ""}
                        alt={item.name}
                        width={220}
                        height={220}
                        loading="lazy"
                        className={`sm:h-[220px] sm:w-[220px] sm:mx-0 mx-2.5 h-[100px] w-[100px] sm:rounded-xl rounded-lg object-cover ${isOutOfStock ? "grayscale" : ""
                            }`}
                    />
                    {/* Out of stock overlay (duplicate image used as tinted overlay) */}
                    {isOutOfStock && (
                        <Image
                            src={item.image || ""}
                            alt={item.name}
                            width={220}
                            height={220}
                            loading="lazy"
                            className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center sm:h-[220px] sm:w-[220px] sm:mx-0 mx-2.5 h-[100px] w-[100px] sm:rounded-xl rounded-lg object-cover grayscale"
                        />
                    )}
                </div>

                {/* Info */}
                <div>
                    <CardTitle className="text-base mt-2">{item.name}</CardTitle>

                    <div className="mt-2 flex-col items-center justify-between">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                            {item.featured && (
                                <button className="bg-[#A7A7A7] px-2.5 py-1.5 rounded">
                                    <p className="text-[11px] leading-[14px] font-normal text-white">
                                        {item.featured}
                                    </p>
                                </button>
                            )}
                            {isOutOfStock && (
                                <span className="bg-red-600 text-white px-2 py-1 rounded text-[11px] font-semibold">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Price */}
                        <div className="mt-2 flex items-center gap-2">
                            {item.discountPrice ? (
                                <>
                                    <span
                                        className={`text-[17px] leading-[22px] font-bold ${isOutOfStock ? "text-gray-500" : "text-red-600"
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
                                    className={`text-[17px] leading-[22px] font-bold ${isOutOfStock ? "text-gray-500" : "text-black"
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
    );
}

// ─── Product Grid Skeleton ─────────────────────────────────────────────────────

export function ProductGridSkeleton() {
    return (
        <div className="space-y-8">
            {[1, 2].map((section) => (
                <div key={section}>
                    <Skeleton className="h-8 w-40 mb-6" />
                    <div className="grid gap-x-5 gap-y-5 sm:gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((card) => (
                            <div key={card}>
                                {/* Mobile skeleton */}
                                <div className="flex sm:hidden flex-row gap-4">
                                    <Skeleton className="mx-2.5 h-[100px] w-[100px] rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-full" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                </div>
                                {/* Desktop skeleton */}
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
    );
}

// ─── Main ProductGrid ──────────────────────────────────────────────────────────

export default function ProductGrid({
    visibleCategories,
    groupedItems,
    sectionRefs,
}: ProductGridProps) {
    return (
        <div className="mb-24 md:mb-0">
            {visibleCategories.map((category) => (
                <div
                    key={category.id}
                    ref={(el) => {
                        sectionRefs.current[category.id] = el;
                    }}
                >
                    <CardCategory>{category.name}</CardCategory>
                    <div className="my-8 grid gap-x-5 gap-y-5 sm:gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {(groupedItems[category.id] ?? []).map((item) => (
                            <ProductCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
