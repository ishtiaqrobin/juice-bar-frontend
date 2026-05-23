"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, SquarePen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Banner } from "@/types/banner.type";
import { deleteBanner, updateBanner } from "@/actions/banner.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";

interface BannerTableProps {
    banners: Banner[];
    loading?: boolean;
    searchQuery?: string;
    onEdit: (banner: Banner) => void;
    onDeleteSuccess?: () => void;
    // pagination
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export default function BannerTable({
    banners,
    loading = false,
    searchQuery = "",
    onEdit,
    onDeleteSuccess,
    page,
    totalPages,
    total,
    limit,
    onPageChange,
}: BannerTableProps) {
    const [deleting, setDeleting] = useState<{
        open: boolean;
        bannerId: string | null;
        text: string;
    }>({
        open: false,
        bannerId: null,
        text: "",
    });

    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleToggleStatus = async (banner: Banner) => {
        setTogglingId(banner.id);
        try {
            const res = await updateBanner(banner.id, { isActive: !banner.isActive });
            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            toast.success(
                `Banner "${banner.text}" marked as ${!banner.isActive ? "Active" : "Inactive"
                }`
            );
            onDeleteSuccess?.(); // reuse refresh callback to reload data
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Toggle failed");
        } finally {
            setTogglingId(null);
        }
    };

    const confirmDelete = (banner: Banner) => {
        setDeleting({
            open: true,
            bannerId: banner.id,
            text: banner.text || "this banner",
        });
    };

    const cancelDelete = () => {
        setDeleting({ open: false, bannerId: null, text: "" });
    };

    const doDelete = async () => {
        if (!deleting.bannerId) return;
        try {
            const res = await deleteBanner(deleting.bannerId);
            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            toast.success("Banner deleted successfully");
            cancelDelete();
            onDeleteSuccess?.();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Delete failed"
            );
        }
    };

    return (
        <>
            <div className="bg-gray-100 border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[15%]">Image</TableHead>
                            <TableHead className="w-[20%]">Text/Offer</TableHead>
                            <TableHead className="w-[28%]">
                                Description
                            </TableHead>
                            <TableHead className="w-[10%]">Order</TableHead>
                            <TableHead className="w-[12%]">Status</TableHead>
                            <TableHead className="w-[5%]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, idx) => (
                                <TableRow
                                    key={`skeleton-${idx}`}
                                    className="align-middle"
                                >
                                    <TableCell>
                                        <Skeleton className="w-20 h-12 rounded" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell className="">
                                        <Skeleton className="h-4 w-48" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-10" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16 rounded-full" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-8 w-9 rounded-md" />
                                            <Skeleton className="h-8 w-9 rounded-md" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : banners.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-8 text-gray-600"
                                >
                                    {searchQuery
                                        ? "No banners found matching your search"
                                        : "No banners found"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            banners.map((banner) => (
                                <TableRow
                                    key={banner.id}
                                    className="align-middle"
                                >
                                    <TableCell>
                                        <div className="relative w-20 h-12 rounded overflow-hidden">
                                            <Image
                                                src={banner.image}
                                                alt={banner.text || "Banner"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">
                                            {banner.text || "—"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="">
                                        <span className="text-gray-700 text-sm">
                                            {banner.description || "—"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium">
                                            {banner.order ?? 0}
                                        </span>
                                    </TableCell>

                                    {/* Status Toggle Button */}
                                    <TableCell>
                                        <button
                                            onClick={() => handleToggleStatus(banner)}
                                            disabled={togglingId === banner.id}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${banner.isActive
                                                ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 border border-green-200 hover:border-red-200"
                                                : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 border border-red-200 hover:border-green-200"
                                                }`}
                                        >
                                            {togglingId === banner.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <span className={`w-1.5 h-1.5 rounded-full ${banner.isActive ? "bg-green-500" : "bg-red-500"}`} />
                                            )}
                                            {banner.isActive ? "Active" : "Inactive"}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="hover:cursor-pointer"
                                                onClick={() => onEdit(banner)}
                                            >
                                                <SquarePen size={14} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="hover:cursor-pointer"
                                                onClick={() =>
                                                    confirmDelete(banner)
                                                }
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    page={page}
                    totalPages={totalPages}
                    total={total}
                    limit={limit}
                    pageCount={banners.length}
                    label="banners"
                    onPageChange={onPageChange}
                />
            </div>

            <DeleteDialog
                isOpen={deleting.open}
                onClose={cancelDelete}
                onConfirm={doDelete}
                title="Delete Banner?"
                description={
                    <>
                        This action cannot be undone. Are you sure you want to permanently delete this banner{" "}
                        <span className="font-semibold text-primary">
                            &quot;{deleting.text}&quot;&nbsp;
                        </span>
                        ?
                    </>
                }
            />
        </>
    );
}