"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/validations/category.validation";
import { Category } from "@/types";
import { createCategory, updateCategory } from "@/actions/category.action";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

export default function CategoryDialog({
  open,
  onOpenChange,
  category,
  mode,
  onSuccess,
}: CategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  // Sync form values when dialog opens or category changes
  useEffect(() => {
    if (open && mode === "edit" && category) {
      reset({
        name: category.name || "",
        description: category.description || "",
        isActive: Boolean(category.isActive),
      });
    } else if (open && mode === "add") {
      reset({
        name: "",
        description: "",
        isActive: true,
      });
    }
  }, [open, mode, category, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    const toastId = toast.loading(
      mode === "add" ? "Creating category..." : "Updating category...",
    );

    try {
      if (mode === "add") {
        const res = await createCategory({
          name: values.name.trim(),
          description: values.description?.trim() || undefined,

          // optional (by default true)
          isActive: values.isActive,
        });

        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.success("Category created successfully", { id: toastId });
      } else if (mode === "edit" && category?.id) {
        const res = await updateCategory(category.id, {
          name: values.name.trim(),
          description: values.description?.trim() || undefined,
          isActive: values.isActive,
        });

        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.success("Category updated successfully", { id: toastId });
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operation failed", {
        id: toastId,
      });
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new category for your products."
              : "Update category information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-800">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              {...register("name")}
              className="bg-white"
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-800"
            >
              Description
            </label>
            <Input
              id="description"
              {...register("description")}
              className="bg-white"
              placeholder="Optional description"
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* isActive (edit mode only) */}
          {mode === "edit" && (
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
                className="hover:cursor-pointer"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-800"
              >
                Active
              </label>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="hover:cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? mode === "add"
                  ? "Adding..."
                  : "Saving..."
                : mode === "add"
                  ? "Add Category"
                  : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
