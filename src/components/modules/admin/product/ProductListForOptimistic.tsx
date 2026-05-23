"use client";

import { useState, useTransition, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import { updateProduct, deleteProduct } from "@/actions/product.action";

// Discriminated union for all optimistic actions
type OptimisticAction =
    | { type: "toggle"; id: string; isActive: boolean }
    | { type: "delete"; id: string };

interface ProductListForOptimisticProps {
    products: Product[];
    hasFilters: boolean;
    onReset: () => void;
}

export default function ProductListForOptimistic({
    products,
    hasFilters,
    onReset,
}: ProductListForOptimisticProps) {
    const router = useRouter();

    // useTransition is required alongside useOptimistic so that
    // state updates happen inside a React transition (non-blocking).
    const [, startTransition] = useTransition();

    // useOptimistic: gives us a "shadow" copy of products that
    // immediately reflects our intended change before the server confirms.
    // If the server action fails, React automatically rolls back to the real state.
    const [optimisticProducts, applyOptimistic] = useOptimistic(
        products,
        (state: Product[], action: OptimisticAction) => {
            if (action.type === "toggle") {
                return state.map((p) =>
                    p.id === action.id ? { ...p, isActive: action.isActive } : p,
                );
            }
            if (action.type === "delete") {
                return state.filter((p) => p.id !== action.id);
            }
            return state;
        },
    );

    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        productId: string | null;
        productName: string;
    }>({ isOpen: false, productId: null, productName: "" });

    const handleToggleStatus = (productId: string, currentStatus: boolean) => {
        startTransition(async () => {
            // Immediately flip the toggle in UI (optimistic)
            applyOptimistic({ type: "toggle", id: productId, isActive: !currentStatus });

            const { error } = await updateProduct(productId, { isActive: !currentStatus });
            if (error) {
                // React rolls back the optimistic update automatically on error
                toast.error(error.message || "Failed to update product status");
            } else {
                toast.success(
                    `Product ${!currentStatus ? "activated" : "deactivated"} successfully!`,
                );
                router.refresh();
            }
        });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.productId) return;
        const id = deleteDialog.productId;
        setDeleteDialog({ isOpen: false, productId: null, productName: "" });

        startTransition(async () => {
            // Immediately remove the card from UI (optimistic)
            applyOptimistic({ type: "delete", id });

            const { error } = await deleteProduct(id);
            if (error) {
                // React rolls back — the card reappears on failure
                toast.error(error.message || "Failed to delete product");
            } else {
                toast.success("Product deleted successfully!");
                router.refresh();
            }
        });
    };

    if (optimisticProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center space-y-3">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                        {hasFilters
                            ? "No products match your current filters. Try adjusting your filter criteria."
                            : "Get started by adding your first product."}
                    </p>
                    {hasFilters && (
                        <Button variant="outline" onClick={onReset} className="mt-4">
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Render optimisticProducts — reflects instant UI changes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {optimisticProducts.map((product) => (
                    <Card
                        key={product.id}
                        className={`bg-[#FAFAF9] border flex flex-col h-full hover:shadow-lg transition ${(product.stock ?? 0) <= 0
                            ? "opacity-75 border-red-400 bg-red-100/90"
                            : ""
                            }`}
                    >
                        <CardHeader className="p-3 md:p-4">
                            {/* Image */}
                            <div className="relative overflow-hidden rounded-lg">
                                <Image
                                    src={product.image || ""}
                                    alt={product.name}
                                    width={300}
                                    height={300}
                                    loading="lazy"
                                    className={`w-full h-56 object-cover rounded-lg ${(product.stock ?? 0) <= 0 ? "grayscale" : ""
                                        }`}
                                />
                                {(product.stock ?? 0) <= 0 && (
                                    <div className="absolute inset-0 rounded-lg bg-red-500/20" />
                                )}
                            </div>

                            <CardTitle>
                                <p className="text-base text-black font-semibold">
                                    {product.name}
                                </p>
                            </CardTitle>

                            {product.featured && (
                                <div>
                                    <Badge
                                        className="bg-[#A7A7A7] text-white rounded"
                                        variant="secondary"
                                    >
                                        {product.featured}
                                    </Badge>
                                </div>
                            )}

                            {/* Price */}
                            <div className="flex items-center gap-2">
                                {product.discountPrice ? (
                                    <>
                                        <span className="text-lg font-bold text-red-600">
                                            ৳{formatPrice(product.discountPrice)}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through">
                                            ৳{formatPrice(product.price)}
                                        </span>
                                        {product.discountPercentage && (
                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                -{formatPrice(product.discountPercentage)}%
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-lg text-black font-bold">
                                        ৳{formatPrice(product.price)}
                                    </span>
                                )}
                            </div>

                            <CardDescription className="text-card-foreground space-y-1">
                                <p>In Category: {product.category?.name}</p>
                                {product.addedDate && (
                                    <p>
                                        Added on:{" "}
                                        {new Date(product.addedDate).toLocaleDateString()}
                                    </p>
                                )}
                            </CardDescription>

                            {/* Stock */}
                            <div className="flex items-center gap-2">
                                {(product.stock ?? 0) > 0 && (
                                    <span
                                        className={`text-sm font-semibold capitalize ${(product.stock ?? 0) <= 5
                                            ? "text-orange-600"
                                            : "text-card-foreground"
                                            }`}
                                    >
                                        Stock: {product.stock} {product.unitType}
                                    </span>
                                )}
                                {(product.stock ?? 0) <= 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="bg-red-600 text-[11px] font-semibold"
                                    >
                                        Out of Stock
                                    </Badge>
                                )}
                                {(product.stock ?? 0) > 0 && (product.stock ?? 0) <= 5 && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-orange-600 text-white text-[11px] font-semibold"
                                    >
                                        Low Stock
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        <CardFooter className="pb-3 md:pb-4 px-3 md:px-4 mt-auto">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        className="hover:cursor-pointer"
                                        checked={product.isActive ?? false}
                                        onCheckedChange={() =>
                                            handleToggleStatus(
                                                product.id,
                                                product.isActive ?? false,
                                            )
                                        }
                                    />
                                    <span className="text-sm">Active</span>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        className="hover:cursor-pointer"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            router.push(
                                                `/admin-dashboard/products/${product.id}`,
                                            )
                                        }
                                    >
                                        <SquarePen size={14} />
                                    </Button>
                                    <Button
                                        className="hover:cursor-pointer"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                            setDeleteDialog({
                                                isOpen: true,
                                                productId: product.id,
                                                productName: product.name,
                                            })
                                        }
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <DeleteDialog
                isOpen={deleteDialog.isOpen}
                onClose={() =>
                    setDeleteDialog({ isOpen: false, productId: null, productName: "" })
                }
                onConfirm={handleDeleteConfirm}
                title="Delete Product?"
                description={
                    <>
                        This action cannot be undone. Are you sure you want to permanently
                        delete this product{" "}
                        <span className="font-semibold text-primary">
                            &quot;{deleteDialog.productName}&quot;&nbsp;
                        </span>
                        ?
                    </>
                }
            />
        </>
    );
}