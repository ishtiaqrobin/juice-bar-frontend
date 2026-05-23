"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductsClientProps } from "@/types";

// ─── Swap between these three to compare approaches ───────────────────────────
// import ProductList from "./ProductList";                        // useState (original)

// import ProductList from "./ProductListForOptimistic";        // optimistic UI updates (no useTransition, but immediate UI update on filter change)

import ProductList from "./ProductListForTransition"; // useTransition
// ──────────────────────────────────────────────────────────────────────────────

export default function ProductsClient({
  products,
  categories,
  activeFilters,
  pagination,
}: ProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localSearch, setLocalSearch] = useState(activeFilters.search ?? "");

  // --- URL param helpers ---
  const pushParam = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (value: string) => {
    pushParam("isActive", value === "all" ? undefined : value);
  };

  const handleCategoryChange = (value: string) => {
    pushParam("category", value === "all" ? undefined : value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pushParam("search", localSearch.trim() || undefined);
  };

  const handleReset = () => {
    setLocalSearch("");
    router.push(pathname);
  };

  const statusValue =
    activeFilters.isActive === "true"
      ? "true"
      : activeFilters.isActive === "false"
        ? "false"
        : "all";

  const categoryValue = activeFilters.category || "all";

  const hasFilters =
    statusValue !== "all" || categoryValue !== "all" || !!activeFilters.search;

  return (
    <div className="mx-auto w-full space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <h1 className="text-2xl font-bold">Products</h1>

        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full md:w-[260px]"
          >
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search products..."
              className="bg-white pl-9 pr-9 w-full"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  pushParam("search", undefined);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Status Filter */}
          <Select value={statusValue} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-white w-full md:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryValue} onValueChange={handleCategoryChange}>
            <SelectTrigger className="bg-white w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="max-h-[400px]">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
            className="hover:cursor-pointer"
          >
            <RefreshCw size={16} className="mr-2" /> Reset
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <ProductList
        products={products}
        hasFilters={hasFilters}
        onReset={handleReset}
        pagination={pagination}
        activeFilters={activeFilters}
      />
    </div>
  );
}
