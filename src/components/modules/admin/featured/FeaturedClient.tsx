"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, RefreshCw } from "lucide-react";
import { FeaturedOption } from "@/types";
import FeaturedTable from "@/components/modules/admin/featured/FeaturedTable";
import FeaturedDialog from "@/components/modules/admin/featured/FeaturedDialog";

const PAGE_SIZE = 10;

interface FeaturedClientProps {
    featuredOptions: FeaturedOption[];
    showInactiveDefault: boolean;
}

export default function FeaturedClient({
    featuredOptions,
    showInactiveDefault,
}: FeaturedClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [selectedFeatured, setSelectedFeatured] =
        useState<FeaturedOption | null>(null);

    const handleToggleInactive = (checked: boolean) => {
        setPage(1);
        const params = new URLSearchParams(searchParams.toString());
        if (checked) {
            params.set("isActive", "false");
        } else {
            params.delete("isActive");
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleReset = () => {
        setQuery("");
        setPage(1);
        router.push(pathname);
    };

    const handleSuccess = () => {
        router.refresh();
    };

    const handleAdd = () => {
        setDialogMode("add");
        setSelectedFeatured(null);
        setDialogOpen(true);
    };

    const handleEdit = (featured: FeaturedOption) => {
        setDialogMode("edit");
        setSelectedFeatured(featured);
        setDialogOpen(true);
    };

    // Client-side search within the currently loaded featured options
    const filteredFeatured = useMemo(() => {
        if (!query.trim()) return featuredOptions;
        const q = query.toLowerCase();
        return featuredOptions.filter(
            (option) =>
                option.name?.toLowerCase().includes(q) ||
                option.description?.toLowerCase().includes(q)
        );
    }, [featuredOptions, query]);

    // Reset to page 1 when search or data changes
    useEffect(() => {
        setPage(1);
    }, [query, featuredOptions]);

    // Pagination derived values
    const totalPages = Math.max(1, Math.ceil(filteredFeatured.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paginatedFeatured = filteredFeatured.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    return (
        <div className="mx-auto w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h1 className="text-2xl font-bold">Featured Options</h1>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search featured options..."
                        className="bg-white w-full md:w-[300px]"
                    />
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="hover:cursor-pointer"
                            onClick={handleReset}
                        >
                            <RefreshCw size={16} className="mr-2" /> Reset
                        </Button>
                        <Button
                            className="hover:cursor-pointer"
                            onClick={handleAdd}
                        >
                            <Plus size={16} className="mr-2" /> Add Featured
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Switch
                    id="show-inactive-featured"
                    checked={showInactiveDefault}
                    onCheckedChange={handleToggleInactive}
                    className="hover:cursor-pointer"
                />
                <label
                    htmlFor="show-inactive-featured"
                    className="text-sm font-medium hover:cursor-pointer"
                >
                    Show inactive featured options
                </label>
            </div>

            <FeaturedTable
                featuredOptions={paginatedFeatured}
                searchQuery={query}
                onEdit={handleEdit}
                onDeleteSuccess={handleSuccess}
                page={safePage}
                totalPages={totalPages}
                total={filteredFeatured.length}
                limit={PAGE_SIZE}
                onPageChange={setPage}
            />

            <FeaturedDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                featured={selectedFeatured}
                mode={dialogMode}
                onSuccess={handleSuccess}
            />
        </div>
    );
}