"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import { Banner } from "@/types/banner.type";
import { createBanner, updateBanner } from "@/actions/banner.action";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;
const ACCEPT_TYPES = "image/jpeg,image/jpg,image/png,image/webp";
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface BannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

interface FormState {
  imageFile: File | null;
  imagePreview: string; // Data URL or existing image URL
  text: string;
  description: string;
  isActive: boolean;
  order: number;
}

const emptyForm: FormState = {
  imageFile: null,
  imagePreview: "",
  text: "",
  description: "",
  isActive: true,
  order: 0,
};

export default function BannerDialog({
  open,
  onOpenChange,
  banner,
  mode,
  onSuccess,
}: BannerDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Sync form when mode/banner changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && banner) {
        setForm({
          imageFile: null,
          imagePreview: banner.image || "",
          text: banner.text || "",
          description: banner.description || "",
          isActive: banner.isActive !== false,
          order: banner.order ?? 0,
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [open, mode, banner]);

  const handleClose = () => {
    // Clean up object URLs
    if (form.imagePreview.startsWith("blob:") && form.imageFile) {
      URL.revokeObjectURL(form.imagePreview);
    }
    setForm(emptyForm);
    onOpenChange(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      const readable = ALLOWED_TYPES.map((t) =>
        t.replace("image/", "").toUpperCase(),
      ).join(", ");
      toast.error(`Only ${readable} images are allowed`);
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      const currentMB = (file.size / 1024 / 1024).toFixed(1);
      toast.error(
        `Image must be smaller than ${MAX_SIZE_MB} MB (current: ${currentMB})`,
      );
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);

    // Clean up old preview if it was a blob URL
    if (form.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(form.imagePreview);
    }

    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: previewUrl,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate image: either new file or existing image URL
    if (!form.imageFile && !form.imagePreview) {
      toast.error("Banner image is required");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      mode === "add" ? "Creating banner..." : "Updating banner...",
    );

    try {
      if (mode === "add") {
        const payload = {
          text: form.text?.trim() || "",
          description: form.description?.trim() || null,
          isActive: form.isActive,
          order: Number(form.order) || 0,
          ...(form.imageFile && { imageFile: form.imageFile }),
        };
        const res = await createBanner(payload);
        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }
        toast.success("Banner created successfully", { id: toastId });
      } else {
        if (!banner?.id) return;
        const payload = {
          ...(form.text !== banner.text && { text: form.text?.trim() || "" }),
          ...(form.description !== banner.description && {
            description: form.description?.trim() || null,
          }),
          ...(form.isActive !== banner.isActive && { isActive: form.isActive }),
          ...(form.order !== banner.order && {
            order: Number(form.order) || 0,
          }),
          ...(form.imageFile && { imageFile: form.imageFile }),
        };

        // Only send if there are changes
        if (Object.keys(payload).length === 0) {
          toast.info("No changes to save", { id: toastId });
          setSaving(false);
          return;
        }

        const res = await updateBanner(banner.id, payload);
        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }
        toast.success("Banner updated successfully", { id: toastId });
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operation failed", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  const isEdit = mode === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Banner" : "Add New Banner"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update banner information."
              : "Create a new banner for your carousel."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Image <span className="text-red-500">*</span>
            </label>
            <Input
              type="file"
              accept={ACCEPT_TYPES}
              onChange={handleImageChange}
              className="bg-white"
              disabled={saving}
            />
            <p className="text-xs text-gray-500">
              Max size: {MAX_SIZE_MB} MB. Formats: JPEG, PNG, WebP
            </p>
            {form.imagePreview && (
              <div className="relative w-full h-32 rounded overflow-hidden mt-2">
                <Image
                  src={form.imagePreview}
                  alt="Banner preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Text */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Text / Offer
            </label>
            <Input
              value={form.text}
              onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
              className="bg-white"
              placeholder="Optional offer text (e.g., '50% Off')"
              disabled={saving}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Description
            </label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
              className="bg-white"
              placeholder="Optional description"
              rows={3}
              disabled={saving}
            />
          </div>

          {/* Order & Active */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">Order</label>
            <Input
              type="number"
              min={0}
              value={form.order}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  order: Number(e.target.value),
                }))
              }
              className="bg-white"
              placeholder="0"
              disabled={saving}
            />
            <p className="text-xs text-gray-500">Lower numbers appear first</p>
          </div>

          {/* <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 pt-2 md:pt-6">
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((p) => ({
                    ...p,
                    isActive: checked,
                  }))
                }
                className="hover:cursor-pointer"
              />
              <label className="text-sm font-medium text-gray-800">
                Active
              </label>
            </div>
          </div> */}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="hover:cursor-pointer"
              disabled={saving || !form.imagePreview}
            >
              {saving
                ? isEdit
                  ? "Saving..."
                  : "Adding..."
                : isEdit
                  ? "Save Changes"
                  : "Add Banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
