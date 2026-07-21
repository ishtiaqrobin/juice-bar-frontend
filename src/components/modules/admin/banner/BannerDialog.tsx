"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useImageUpload } from "@/hooks/useImageUpload";
import { IMAGE_UPLOAD_CONFIG } from "@/constants/imageUpload";

import { Banner } from "@/types/banner.type";
import { createBanner, updateBanner } from "@/actions/banner.action";

interface BannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

interface FormState {
  text: string;
  description: string;
  isActive: boolean;
  order: number;
}

export default function BannerDialog({
  open,
  onOpenChange,
  banner,
  mode,
  onSuccess,
}: BannerDialogProps) {
  const [form, setForm] = useState<FormState>({
    text: "",
    description: "",
    isActive: true,
    order: 0,
  });
  const [existingImage, setExistingImage] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Use the reusable hook for image upload with compression
  const {
    file: imageFile,
    preview: imagePreview,
    isCompressing,
    handleFileChange,
    reset: resetImage,
  } = useImageUpload({
    showSuccessToast: false, // We'll handle success toast in form submit
  });

  // Sync form when mode/banner changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && banner) {
        setForm({
          text: banner.text || "",
          description: banner.description || "",
          isActive: banner.isActive !== false,
          order: banner.order ?? 0,
        });
        setExistingImage(banner.image || "");
      } else {
        setForm({
          text: "",
          description: "",
          isActive: true,
          order: 0,
        });
        setExistingImage("");
      }
    }
  }, [open, mode, banner]);

  const handleClose = () => {
    resetImage();
    setExistingImage("");
    setForm({
      text: "",
      description: "",
      isActive: true,
      order: 0,
    });
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate: either new compressed file or existing image URL
    if (!imageFile && !existingImage && !imagePreview) {
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
          // Use compressed imageFile if available, otherwise use preview (existing URL)
          ...(imageFile
            ? { imageFile }
            : imagePreview
              ? { image: imagePreview }
              : {}),
        };
        const res = await createBanner(payload);
        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }
        toast.success("Banner created successfully", { id: toastId });
      } else {
        if (!banner?.id) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = {
          ...(form.text !== banner.text && { text: form.text?.trim() || "" }),
          ...(form.description !== banner.description && {
            description: form.description?.trim() || null,
          }),
          ...(form.isActive !== banner.isActive && { isActive: form.isActive }),
          ...(form.order !== banner.order && {
            order: Number(form.order) || 0,
          }),
        };

        // Add image only if it was changed (compressed file)
        if (imageFile) {
          payload.imageFile = imageFile;
        }

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
  // Show preview from either new upload or existing image
  const displayPreview = imagePreview || existingImage;

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
              accept={IMAGE_UPLOAD_CONFIG.ACCEPT_TYPES}
              onChange={handleFileChange}
              className="bg-white"
              disabled={saving || isCompressing}
            />
            <p className="text-xs text-gray-500">
              Max size: {IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB} MB. Formats: JPEG,
              PNG, WebP. Auto-compressed!
            </p>
            {displayPreview && (
              <div className="relative w-full h-32 rounded overflow-hidden mt-2">
                <Image
                  key={banner?.id || "new"} // ID-based key for proper rendering
                  src={displayPreview}
                  alt={`Banner preview - ${banner?.id || "new"}`}
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
              disabled={saving || isCompressing}
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
              disabled={saving || isCompressing}
            />
          </div>

          {/* Order */}
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
              disabled={saving || isCompressing}
            />
            <p className="text-xs text-gray-500">Lower numbers appear first</p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={handleClose}
              disabled={saving || isCompressing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="hover:cursor-pointer"
              disabled={saving || isCompressing || !displayPreview}
            >
              {saving
                ? isEdit
                  ? "Saving..."
                  : "Adding..."
                : isCompressing
                  ? "Compressing..."
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
