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

export default function AddFeaturedDialog({
  open,
  onOpenChange,
  onFeaturedAdded,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Featured option name is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.featured.create({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      });

      toast.success("Featured option added successfully!");
      onFeaturedAdded?.(response.data.data);
      setFormData({ name: "", description: "" });
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || "Failed to add featured option");
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
          <AlertDialogTitle>Add New Featured</AlertDialogTitle>
          <AlertDialogDescription>
            Create a new featured product option for your juice bar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="featuredName">
              Featured Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="featuredName"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter featured name"
              required
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="featuredDescription">Description</Label>
            <Textarea
              id="featuredDescription"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter featured option description (optional)"
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
              {isLoading ? "Adding..." : "Add Featured"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
