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

import {
  Banner,
  CreateBannerData,
  UpdateBannerData,
} from "@/types/banner.type";
import { createBanner, updateBanner } from "@/actions/banner.action";
import { uploadImage, UPLOAD_CONSTRAINTS } from "@/lib/upload-image";

interface BannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

const emptyForm = {
  image: "",
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
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Sync form when mode/banner changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && banner) {
        setForm({
          image: banner.image || "",
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
    setForm(emptyForm);
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadingImage(true);
    uploadImage(file, {
      endpoint: "banner",
      onSuccess: (url) => setForm((prev) => ({ ...prev, image: url })),
      inputRef: e.target,
    }).finally(() => setUploadingImage(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image.trim()) {
      toast.error("Banner image is required");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      mode === "add" ? "Creating banner..." : "Updating banner...",
    );

    try {
      if (mode === "add") {
        const payload: CreateBannerData = {
          image: form.image.trim(),
          text: form.text?.trim() || "",
          description: form.description?.trim() || null,
          isActive: form.isActive,
          order: Number(form.order) || 0,
        };
        const res = await createBanner(payload);
        if (res.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }
        toast.success("Banner created successfully", { id: toastId });
      } else {
        if (!banner?.id) return;
        const payload: UpdateBannerData = {
          image: form.image.trim(),
          isActive: form.isActive,
          order: Number(form.order) || 0,
        };
        if (form.text) payload.text = form.text.trim();
        if (form.description !== undefined)
          payload.description = form.description?.trim() || null;
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
              accept={UPLOAD_CONSTRAINTS.ACCEPT}
              onChange={handleImageUpload}
              className="bg-white"
              disabled={uploadingImage}
            />
            {uploadingImage && (
              <p className="text-sm text-gray-500">Uploading image...</p>
            )}
            {form.image && (
              <div className="relative w-full h-32 rounded overflow-hidden mt-2">
                <Image
                  src={form.image}
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
              disabled={saving || !form.image || uploadingImage}
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
