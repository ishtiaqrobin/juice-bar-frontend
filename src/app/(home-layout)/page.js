"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.products.getAll({
                isActive: true,
                limit: 8,
            });
            setProducts(response.data.data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            {/* Hero Carousel (mobile-first) */}
            <section className="relative isolate bg-white">
                <div className="mx-auto max-w-[942px] px-4 pt-4 md:py-16">
                    <HeroCarousel />
                </div>
            </section>

            {/* Featured */}
            <section className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">
                {/* Promo filter chips */}
                <div className="mt-6 flex flex-wrap gap-2 md:hidden">
                    {[
                        { label: "All" },
                        { label: "Delivery" },
                        { label: "Dine In" },
                        { label: "Self Collect" },
                    ].map((c, i) => (
                        <button
                            key={c.label}
                            className={`rounded-full border px-3 py-1.5 text-xs ${i === 0
                                    ? "bg-red-700 text-white border-red-700"
                                    : "bg-white text-stone-700"
                                }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {loading ? (
                        // Loading skeletons
                        Array.from({ length: 8 }).map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <Skeleton className="h-44 w-full" />
                                <CardContent className="p-4">
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="mt-2 flex items-center justify-between">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-8 w-16" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : products.length > 0 ? (
                        products.map((item) => (
                            <Card key={item.id} className="hover:shadow-lg transition">
                                <CardHeader className="p-0">
                                    <Image
                                        src={
                                            item.image ||
                                            "https://images.unsplash.com/photo-1546173159-315724a31696?w=500"
                                        }
                                        alt={item.name}
                                        className="rounded-t-xl object-cover w-full h-44"
                                        width={500}
                                        height={500}
                                    />
                                </CardHeader>
                                <CardContent className="p-4">
                                    <CardTitle className="text-base">{item.name}</CardTitle>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="font-semibold text-red-700">
                                            ৳{item.discountPrice || item.price}
                                            {item.discountPrice && (
                                                <span className="ml-2 text-sm text-gray-500 line-through">
                                                    ৳{item.price}
                                                </span>
                                            )}
                                        </span>
                                        <Button
                                            size="sm"
                                            className="bg-red-700 hover:bg-red-800 text-white"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No products available
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
