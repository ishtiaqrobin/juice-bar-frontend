"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Trash2, Plus, SquarePen, RefreshCw } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api-client";

export default function BannersPage() {
  const [banners, setBanners] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showInactive, setShowInactive] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    fetchBanners();
  }, [showInactive]);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await api.banners.getAll({
        isActive: showInactive ? undefined : true,
      });
      setBanners(response.data.data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBanners = React.useMemo(() => {
    if (!query.trim()) return banners;
    const q = query.toLowerCase();
    return banners.filter(
      (banner) =>
        banner.text?.toLowerCase().includes(q) ||
        banner.description?.toLowerCase().includes(q)
    );
  }, [banners, query]);

  const [addOpen, setAddOpen] = React.useState(false);
  const [addForm, setAddForm] = React.useState({
    image: "",
    text: "",
    description: "",
    isActive: true,
    order: 0,
  });
  const [adding, setAdding] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  const [editingId, setEditingId] = React.useState(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    image: "",
    text: "",
    description: "",
    isActive: true,
    order: 0,
  });
  const [savingId, setSavingId] = React.useState(null);
  const [uploadingEditImage, setUploadingEditImage] = React.useState(false);

  const [deleting, setDeleting] = React.useState({
    open: false,
    bannerId: null,
    text: "",
  });

  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isEdit) {
      setUploadingEditImage(true);
    } else {
      setUploadingImage(true);
    }

    try {
      const response = await api.upload.banner(file);
      if (isEdit) {
        setEditForm((prev) => ({ ...prev, image: response.data.data.url }));
      } else {
        setAddForm((prev) => ({ ...prev, image: response.data.data.url }));
      }
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      if (isEdit) {
        setUploadingEditImage(false);
      } else {
        setUploadingImage(false);
      }
    }
  };

  const handleAdd = () => {
    setAddForm({
      image: "",
      text: "",
      description: "",
      isActive: true,
      order: 0,
    });
    setAddOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.image.trim()) {
      toast.error("Banner image is required");
      return;
    }

    setAdding(true);
    try {
      await api.banners.create({
        image: addForm.image.trim(),
        text: addForm.text?.trim() || null,
        description: addForm.description?.trim() || null,
        isActive: addForm.isActive,
        order: parseInt(addForm.order) || 0,
      });

      toast.success("Banner created successfully");
      setAddOpen(false);
      setAddForm({
        image: "",
        text: "",
        description: "",
        isActive: true,
        order: 0,
      });
      fetchBanners();
    } catch (e) {
      toast.error(e.message || "Failed to create banner");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (banner) => {
    setEditingId(banner.id);
    setEditForm({
      image: banner.image || "",
      text: banner.text || "",
      description: banner.description || "",
      isActive: banner.isActive !== false,
      order: banner.order || 0,
    });
    setEditOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      image: "",
      text: "",
      description: "",
      isActive: true,
      order: 0,
    });
    setEditOpen(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editForm.image.trim()) {
      toast.error("Banner image is required");
      return;
    }

    setSavingId(editingId);
    try {
      await api.banners.update(editingId, {
        image: editForm.image.trim(),
        text: editForm.text?.trim() || null,
        description: editForm.description?.trim() || null,
        isActive: editForm.isActive,
        order: parseInt(editForm.order) || 0,
      });

      toast.success("Banner updated successfully");
      cancelEdit();
      fetchBanners();
    } catch (e) {
      toast.error(e.message || "Failed to update banner");
    } finally {
      setSavingId(null);
    }
  };

  const confirmDelete = (banner) => {
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
      await api.banners.delete(deleting.bannerId);

      toast.success("Banner deleted successfully");
      cancelDelete();
      fetchBanners();
    } catch (e) {
      toast.error(e.message || "Delete failed");
    }
  };

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
              onClick={() => {
                setQuery("");
                fetchBanners();
              }}
            >
              <RefreshCw size={16} className="mr-2" /> Reset
            </Button>
            <Button className="hover:cursor-pointer" onClick={handleAdd}>
              <Plus size={16} className="mr-2" /> Add Banner
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={showInactive}
          onCheckedChange={setShowInactive}
          className="hover:cursor-pointer"
        />
        <label className="text-sm font-medium">Show inactive banners</label>
      </div>
      <div className="bg-gray-100 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[15%]">Image</TableHead>
              <TableHead className="w-[20%]">Text/Offer</TableHead>
              <TableHead className="w-[25%]">Description</TableHead>
              <TableHead className="w-[10%]">Order</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[20%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="align-middle">
                  <TableCell>
                    <div className="w-20 h-12">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-9" />
                      <Skeleton className="h-8 w-9" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredBanners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-600"
                >
                  {query
                    ? "No banners found matching your search"
                    : "No banners found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredBanners.map((banner) => (
                <TableRow key={banner.id} className="align-middle">
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
                    <span className="font-medium">{banner.text || "—"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700 text-sm">
                      {banner.description || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {banner.order || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm font-medium ${
                        banner.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:cursor-pointer"
                        onClick={() => startEdit(banner)}
                      >
                        <SquarePen size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="hover:cursor-pointer"
                        onClick={() => confirmDelete(banner)}
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
      </div>
      {/* Add Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          if (!open) setAddOpen(false);
        }}
      >
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Add New Banner</DialogTitle>
            <DialogDescription>
              Create a new banner for your carousel.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Image <span className="text-red-500">*</span>
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
                className="bg-white"
                disabled={uploadingImage}
              />
              {addForm.image && (
                <div className="relative w-full h-32 rounded overflow-hidden mt-2">
                  <Image
                    src={addForm.image}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {uploadingImage && (
                <p className="text-sm text-gray-500">Uploading image...</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Text/Offer
              </label>
              <Input
                value={addForm.text}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, text: e.target.value }))
                }
                className="bg-white"
                placeholder="Optional offer text (e.g., '50% Off')"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Description
              </label>
              <Textarea
                value={addForm.description}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, description: e.target.value }))
                }
                className="bg-white"
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">
                  Order
                </label>
                <Input
                  type="number"
                  value={addForm.order}
                  onChange={(e) =>
                    setAddForm((p) => ({ ...p, order: e.target.value }))
                  }
                  className="bg-white"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">
                  Lower numbers appear first
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 md:pt-6">
                <Switch
                  checked={addForm.isActive}
                  onCheckedChange={(checked) =>
                    setAddForm((p) => ({ ...p, isActive: checked }))
                  }
                  className="hover:cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-800">
                  Active
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="hover:cursor-pointer"
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="hover:cursor-pointer"
                disabled={adding || !addForm.image}
              >
                {adding ? "Adding..." : "Add Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          if (!open) cancelEdit();
        }}
      >
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Update banner information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Image <span className="text-red-500">*</span>
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                className="bg-white"
                disabled={uploadingEditImage}
              />
              {editForm.image && (
                <div className="relative w-full h-32 rounded overflow-hidden mt-2">
                  <Image
                    src={editForm.image}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {uploadingEditImage && (
                <p className="text-sm text-gray-500">Uploading image...</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Text/Offer
              </label>
              <Input
                value={editForm.text}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, text: e.target.value }))
                }
                className="bg-white"
                placeholder="Optional offer text (e.g., '50% Off')"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Description
              </label>
              <Textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, description: e.target.value }))
                }
                className="bg-white"
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">
                  Order
                </label>
                <Input
                  type="number"
                  value={editForm.order}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, order: e.target.value }))
                  }
                  className="bg-white"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">
                  Lower numbers appear first
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 md:pt-6">
                <Switch
                  checked={editForm.isActive}
                  onCheckedChange={(checked) =>
                    setEditForm((p) => ({ ...p, isActive: checked }))
                  }
                  className="hover:cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-800">
                  Active
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="hover:cursor-pointer"
              onClick={cancelEdit}
            >
              Cancel
            </Button>
            <Button
              className="hover:cursor-pointer"
              onClick={saveEdit}
              disabled={!editingId || savingId === editingId || !editForm.image}
            >
              Update Banner
              {/* {savingId === editingId ? "Saving..." : "Save"} */}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation */}
      <AlertDialog
        open={deleting.open}
        onOpenChange={(open) => {
          if (!open) cancelDelete();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              banner{" "}
              <span className="font-semibold text-primary">
                "{deleting.text}"
              </span>{" "}
              and its image file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="hover:cursor-pointer"
              onClick={cancelDelete}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="hover:cursor-pointer bg-destructive text-white hover:bg-destructive/90"
              onClick={doDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
