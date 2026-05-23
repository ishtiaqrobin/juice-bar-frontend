"use client";

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
import { useState } from "react";
import { toast } from "sonner";

import { Category } from "@/types";
import { deleteCategory, updateCategory } from "@/actions/category.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";

interface CategoryTableProps {
  categories: Category[];
  loading?: boolean;
  searchQuery?: string;
  onEdit: (category: Category) => void;
  onDeleteSuccess?: () => void;
  // pagination
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function CategoryTable({
  categories,
  loading = false,
  searchQuery = "",
  onEdit,
  onDeleteSuccess,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: CategoryTableProps) {
  const [deleting, setDeleting] = useState<{
    open: boolean;
    categoryId: string | null;
    name: string;
  }>({
    open: false,
    categoryId: null,
    name: "",
  });

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (category: Category) => {
    setTogglingId(category.id);
    try {
      const res = await updateCategory(category.id, {
        isActive: !category.isActive,
      });
      if (res.error) {
        toast.error(res.error.message);
        return;
      }
      toast.success(
        `Category "${category.name}" marked as ${
          !category.isActive ? "Active" : "Inactive"
        }`,
      );
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Toggle failed");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = (category: Category) => {
    setDeleting({ open: true, categoryId: category.id, name: category.name });
  };

  const cancelDelete = () => {
    setDeleting({ open: false, categoryId: null, name: "" });
  };

  const doDelete = async () => {
    if (!deleting.categoryId) return;
    try {
      const res = await deleteCategory(deleting.categoryId);
      if (res.error) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Category deleted successfully");
      cancelDelete();
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <>
      <div className="bg-gray-100 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead className="w-[30%] ">Description</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="w-[5%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(6)].map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="align-middle">
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="">
                    <Skeleton className="h-4 w-64" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-14 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-9 rounded-md" />
                      <Skeleton className="h-8 w-9 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-600"
                >
                  {searchQuery
                    ? "No categories found matching your search"
                    : "No categories found"}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="align-middle">
                  <TableCell>
                    <span className="font-medium">{category.name || "—"}</span>
                  </TableCell>
                  <TableCell className="">
                    <span className="text-gray-700">
                      {category.description || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(category)}
                      disabled={togglingId === category.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                        category.isActive
                          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 border border-green-200 hover:border-red-200"
                          : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 border border-red-200 hover:border-green-200"
                      }`}
                    >
                      {togglingId === category.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${category.isActive ? "bg-green-500" : "bg-red-500"}`}
                        />
                      )}
                      {category.isActive ? "Active" : "Inactive"}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:cursor-pointer"
                        onClick={() => onEdit(category)}
                      >
                        <SquarePen size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="hover:cursor-pointer"
                        onClick={() => confirmDelete(category)}
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
          pageCount={categories.length}
          label="categories"
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete Category?"
        description={
          <>
            This action cannot be undone. Are you sure you want to permanently
            delete this category{" "}
            <span className="font-semibold text-primary">
              &quot;{deleting.name}&quot;&nbsp;
            </span>
            ?
          </>
        }
      />
    </>
  );
}
