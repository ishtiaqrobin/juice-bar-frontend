import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface ProductHighlightCardProps {
    id: string;
    name: string;
    image?: string;
    price: number;
    discountPrice?: number | null;
    discountPercentage?: number | null;
    featured?: string | null;
    stock?: number;
    description?: string;
}

function getRatingDisplay() {
    return "4.8";
}

export default function ProductHighlightCard({
    name,
    image,
    price,
    discountPrice,
    discountPercentage,
    featured,
    stock,
    description,
}: ProductHighlightCardProps) {
    const isOutOfStock = typeof stock === "number" && stock <= 0;
    const hasDiscount = !!discountPrice && discountPrice < price;

    return (
        <div
            className={cn(
                "group relative bg-white border border-gray-100 rounded-2xl overflow-hidden",
                "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-red-100",
                isOutOfStock && "opacity-70"
            )}
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                {hasDiscount && discountPercentage && (
                    <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        <Zap className="w-2.5 h-2.5" />
                        -{Math.round(discountPercentage)}%
                    </span>
                )}
                {featured && !isOutOfStock && (
                    <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-amber-900" />
                        {featured}
                    </span>
                )}
                {isOutOfStock && (
                    <span className="inline-flex bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        Out of Stock
                    </span>
                )}
            </div>

            {/* Image */}
            <div className="relative h-44 bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500 group-hover:scale-105",
                            isOutOfStock && "grayscale"
                        )}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl">🍹</span>
                    </div>
                )}
                {/* Subtle bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/60 to-transparent" />
            </div>

            {/* Info */}
            <div className="p-3.5">
                <h3 className="font-semibold text-[14px] text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                    {name}
                </h3>
                {description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{description}</p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1.5">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={cn(
                                    "w-3 h-3",
                                    s <= 4 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-[11px] text-gray-400">{getRatingDisplay()}</span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-baseline gap-1.5">
                        <span
                            className={cn(
                                "text-base font-bold leading-none",
                                isOutOfStock ? "text-gray-400" : "text-red-600"
                            )}
                        >
                            ৳{formatPrice(hasDiscount && discountPrice ? discountPrice : price)}
                        </span>
                        {hasDiscount && (
                            <span className="text-[11px] text-gray-400 line-through leading-none">
                                ৳{formatPrice(price)}
                            </span>
                        )}
                    </div>
                    <Link
                        href="/menu"
                        className={cn(
                            "flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all duration-200",
                            isOutOfStock
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white active:scale-95"
                        )}
                    >
                        <ShoppingCart className="w-3 h-3" />
                        Order
                    </Link>
                </div>
            </div>
        </div>
    );
}
