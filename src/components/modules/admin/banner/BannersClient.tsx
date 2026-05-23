"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, RefreshCw } from "lucide-react";
import { Banner } from "@/types/banner.type";
import BannerTable from "@/components/modules/admin/banner/BannerTable";
import BannerDialog from "@/components/modules/admin/banner/BannerDialog";

const PAGE_SIZE = 10;

interface BannersClientProps {
    banners: Banner[];
    showInactiveDefault: boolean;
}

export default function BannersClient({
    banners,
    showInactiveDefault,
}: BannersClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

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
        setSelectedBanner(null);
        setDialogOpen(true);
    };

    const handleEdit = (banner: Banner) => {
        setDialogMode("edit");
        setSelectedBanner(banner);
        setDialogOpen(true);
    };

    // Client-side search within the currently loaded banners
    const filteredBanners = useMemo(() => {
        if (!query.trim()) return banners;
        const q = query.toLowerCase();
        return banners.filter(
            (b) =>
                b.text?.toLowerCase().includes(q) ||
                b.description?.toLowerCase().includes(q)
        );
    }, [banners, query]);

    // Reset to page 1 when search or data changes
    useEffect(() => {
        setPage(1);
    }, [query, banners]);

    // Pagination derived values
    const totalPages = Math.max(1, Math.ceil(filteredBanners.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paginatedBanners = filteredBanners.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    return (
        <div className="mx-auto w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h1 className="text-2xl font-bold">Banners</h1>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search banners..."
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
                            <Plus size={16} className="mr-2" /> Add Banner
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Switch
                    id="show-inactive-banners"
                    checked={showInactiveDefault}
                    onCheckedChange={handleToggleInactive}
                    className="hover:cursor-pointer"
                />
                <label
                    htmlFor="show-inactive-banners"
                    className="text-sm font-medium hover:cursor-pointer"
                >
                    Show inactive banners
                </label>
            </div>

            <BannerTable
                banners={paginatedBanners}
                searchQuery={query}
                onEdit={handleEdit}
                onDeleteSuccess={handleSuccess}
                page={safePage}
                totalPages={totalPages}
                total={filteredBanners.length}
                limit={PAGE_SIZE}
                onPageChange={setPage}
            />

            <BannerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                banner={selectedBanner}
                mode={dialogMode}
                onSuccess={handleSuccess}
            />
        </div>
    );
}