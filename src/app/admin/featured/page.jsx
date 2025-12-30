"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { api } from "@/lib/api-client";

export default function FeaturedPage() {
  const [featuredOptions, setFeaturedOptions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showInactive, setShowInactive] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    fetchFeatured();
  }, [showInactive]);

  const fetchFeatured = async () => {
    try {
      setIsLoading(true);
      const response = await api.featured.getAll();
      let options = response.data.data || [];
      if (!showInactive) {
        options = options.filter((o) => o.isActive);
      }
      setFeaturedOptions(options);
    } catch (error) {
      console.error("Error fetching featured options:", error);
      toast.error("Failed to load featured options");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFeatured = React.useMemo(() => {
    if (!query.trim()) return featuredOptions;
    const q = query.toLowerCase();
    return featuredOptions.filter(
      (option) =>
        option.name?.toLowerCase().includes(q) ||
        option.description?.toLowerCase().includes(q)
    );
  }, [featuredOptions, query]);

  const [addOpen, setAddOpen] = React.useState(false);
  const [addForm, setAddForm] = React.useState({ name: "", description: "" });
  const [adding, setAdding] = React.useState(false);

  const [editingId, setEditingId] = React.useState(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [savingId, setSavingId] = React.useState(null);

  const [deleting, setDeleting] = React.useState({
    open: false,
    featuredId: null,
    name: "",
  });

  const handleAdd = () => {
    setAddForm({ name: "", description: "" });
    setAddOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      toast.error("Featured option name is required");
      return;
    }

    setAdding(true);
    try {
      await api.featured.create({
        name: addForm.name.trim(),
        description: addForm.description?.trim() || null,
      });

      toast.success("Featured option created successfully");
      setAddOpen(false);
      setAddForm({ name: "", description: "" });
      fetchFeatured();
    } catch (e) {
      toast.error(e.message || "Failed to create featured option");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (featured) => {
    setEditingId(featured.id);
    setEditForm({
      name: featured.name || "",
      description: featured.description || "",
      isActive: featured.isActive !== false,
    });
    setEditOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "", isActive: true });
    setEditOpen(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editForm.name.trim()) {
      toast.error("Featured option name is required");
      return;
    }

    setSavingId(editingId);
    try {
      await api.featured.update(editingId, {
        name: editForm.name.trim(),
        description: editForm.description?.trim() || null,
        isActive: editForm.isActive,
      });

      toast.success("Featured option updated successfully");
      cancelEdit();
      fetchFeatured();
    } catch (e) {
      toast.error(e.message || "Failed to update featured option");
    } finally {
      setSavingId(null);
    }
  };

  const confirmDelete = (featured) => {
    setDeleting({ open: true, featuredId: featured.id, name: featured.name });
  };

  const cancelDelete = () => {
    setDeleting({ open: false, featuredId: null, name: "" });
  };

  const doDelete = async () => {
    if (!deleting.featuredId) return;
    try {
      await api.featured.delete(deleting.featuredId);

      toast.success("Featured option deleted successfully");
      cancelDelete();
      fetchFeatured();
    } catch (e) {
      toast.error(e.message || "Delete failed");
    }
  };

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold">Featured Options</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search featured options..."
            className="bg-white w-full md:w-[300px]"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hover:cursor-pointer"
              onClick={() => {
                setQuery("");
                fetchFeatured();
              }}
            >
              <RefreshCw size={16} className="mr-2" /> Reset
            </Button>
            <Button className="hover:cursor-pointer" onClick={handleAdd}>
              <Plus size={16} className="mr-2" /> Add Featured
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
        <label className="text-sm font-medium">
          Show inactive featured options
        </label>
      </div>
      <div className="bg-gray-100 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead className="w-[30%] hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="w-[5%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(6)].map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="align-middle">
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-64" />
                      {/* <Skeleton className="h-4 w-52" /> */}
                    </div>
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
            ) : filteredFeatured.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-600"
                >
                  {query
                    ? "No featured options found matching your search"
                    : "No featured options found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredFeatured.map((featured) => (
                <TableRow key={featured.id} className="align-middle">
                  <TableCell>
                    <span className="font-medium">{featured.name || "—"}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-gray-700">
                      {featured.description || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm font-medium ${
                        featured.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {featured.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:cursor-pointer"
                        onClick={() => startEdit(featured)}
                      >
                        <SquarePen size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="hover:cursor-pointer"
                        onClick={() => confirmDelete(featured)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Featured Option</DialogTitle>
            <DialogDescription>
              Create a new featured option for your products.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, name: e.target.value }))
                }
                className="bg-white"
                required
              />
            </div>
            {/* <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Description
              </label>
              <Input
                value={addForm.description}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, description: e.target.value }))
                }
                className="bg-white"
                placeholder="Optional description"
              />
            </div> */}
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
                disabled={adding}
              >
                {adding ? "Adding..." : "Add Featured"}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Featured Option</DialogTitle>
            <DialogDescription>
              Update featured option information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, name: e.target.value }))
                }
                className="bg-white"
                required
              />
            </div>
            {/* <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Description
              </label>
              <Input
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, description: e.target.value }))
                }
                className="bg-white"
                placeholder="Optional description"
              />
            </div> */}
            <div className="flex items-center gap-2">
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
              disabled={!editingId || savingId === editingId}
            >
              {savingId === editingId ? "Saving..." : "Save"}
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
            <AlertDialogTitle>Delete Featured Option?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              featured option{" "}
              <span className="font-semibold text-primary">
                "{deleting.name}"
              </span>
              . If any products are using this featured option, you won't be
              able to delete it until you remove or change the featured status
              of those products.
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
