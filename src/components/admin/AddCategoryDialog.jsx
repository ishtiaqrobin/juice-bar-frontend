"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

export default function AddCategoryDialog({
  open,
  onOpenChange,
  onCategoryAdded,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.categories.create({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      });

      toast.success("Category added successfully!");
      onCategoryAdded?.(response.data.data);
      setFormData({ name: "", description: "" });
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || "Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "" });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Category</AlertDialogTitle>
          <AlertDialogDescription>
            Create a new product category for your juice bar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="categoryName"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter category name"
              required
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="categoryDescription">Description</Label>
            <Textarea
              id="categoryDescription"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter category description (optional)"
              rows={3}
            />
          </div> */}
          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="hover:cursor-pointer"
            >
              {isLoading ? "Adding..." : "Add Category"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
