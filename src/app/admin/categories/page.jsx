"use client";

import React from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Trash2, Plus, SquarePen, RefreshCw } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CategoriesPage() {
    const [showInactive, setShowInactive] = React.useState(false);
    const [query, setQuery] = React.useState('');

    const apiUrl = `/api/categories?includeInactive=${showInactive}`;
    const { data: categories = [], isLoading, mutate, error } = useSWR(apiUrl, fetcher, {
        revalidateOnFocus: false,
    });

    const filteredCategories = React.useMemo(() => {
        if (!query.trim()) return categories;
        const q = query.toLowerCase();
        return categories.filter(cat =>
            cat.name?.toLowerCase().includes(q) ||
            cat.description?.toLowerCase().includes(q)
        );
    }, [categories, query]);

    const [addOpen, setAddOpen] = React.useState(false);
    const [addForm, setAddForm] = React.useState({ name: '', description: '' });
    const [adding, setAdding] = React.useState(false);

    const [editingId, setEditingId] = React.useState(null);
    const [editOpen, setEditOpen] = React.useState(false);
    const [editForm, setEditForm] = React.useState({ name: '', description: '', isActive: true });
    const [savingId, setSavingId] = React.useState(null);

    const [deleting, setDeleting] = React.useState({ open: false, categoryId: null, name: '' });

    const handleAdd = () => {
        setAddForm({ name: '', description: '' });
        setAddOpen(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!addForm.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setAdding(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: addForm.name.trim(),
                    description: addForm.description?.trim() || null
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create category');
            }

            toast.success('Category created successfully');
            setAddOpen(false);
            setAddForm({ name: '', description: '' });
            mutate();
        } catch (e) {
            toast.error(e.message || 'Failed to create category');
        } finally {
            setAdding(false);
        }
    };

    const startEdit = (category) => {
        setEditingId(category.id);
        setEditForm({
            name: category.name || '',
            description: category.description || '',
            isActive: category.isActive !== false
        });
        setEditOpen(true);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: '', description: '', isActive: true });
        setEditOpen(false);
    };

    const saveEdit = async () => {
        if (!editingId) return;
        if (!editForm.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setSavingId(editingId);
        try {
            const res = await fetch(`/api/categories/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editForm.name.trim(),
                    description: editForm.description?.trim() || null,
                    isActive: editForm.isActive
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to update category');
            }

            toast.success('Category updated successfully');
            cancelEdit();
            mutate();
        } catch (e) {
            toast.error(e.message || 'Failed to update category');
        } finally {
            setSavingId(null);
        }
    };

    const confirmDelete = (category) => {
        setDeleting({ open: true, categoryId: category.id, name: category.name });
    };

    const cancelDelete = () => {
        setDeleting({ open: false, categoryId: null, name: '' });
    };

    const doDelete = async () => {
        if (!deleting.categoryId) return;
        try {
            const res = await fetch(`/api/categories/${deleting.categoryId}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to delete category');
            }

            toast.success('Category deleted successfully');
            cancelDelete();
            mutate();
        } catch (e) {
            toast.error(e.message || 'Delete failed');
        }
    };

    return (
        <div className="mx-auto w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h1 className="text-2xl font-bold">Categories</h1>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search categories..."
                        className="bg-white w-full md:w-[300px]"
                    />
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="hover:cursor-pointer"
                            onClick={() => { setQuery(''); mutate(); }}
                        >
                            <RefreshCw size={16} className="mr-2" /> Reset
                        </Button>
                        <Button
                            className="hover:cursor-pointer"
                            onClick={handleAdd}
                        >
                            <Plus size={16} className="mr-2" /> Add Category
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
                <label className="text-sm font-medium">Show inactive categories</label>
            </div>

            {error ? (
                <div className="text-center text-red-600">Failed to load categories</div>
            ) : (
                <div className="bg-gray-100 border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Name</TableHead>
                                <TableHead className="w-[30%] hidden md:table-cell">Description</TableHead>
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
                            ) : filteredCategories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-gray-600">
                                        {query ? 'No categories found matching your search' : 'No categories found'}
                                    </TableCell>
                                </TableRow>
                            ) : filteredCategories.map((category) => (
                                <TableRow key={category.id} className="align-middle">
                                    <TableCell>
                                        <span className="font-medium">{category.name || '—'}</span>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span className="text-gray-700">
                                            {category.description || '—'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-sm font-medium ${category.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="hover:cursor-pointer"
                                                onClick={() => startEdit(category)}
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
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Add Dialog */}
            <Dialog open={addOpen} onOpenChange={(open) => { if (!open) setAddOpen(false); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>Create a new category for your products.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-800">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={addForm.name}
                                onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                                className="bg-white"
                                required
                            />
                        </div>
                        {/* <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-800">Description</label>
                            <Input
                                value={addForm.description}
                                onChange={(e) => setAddForm((p) => ({ ...p, description: e.target.value }))}
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
                                {adding ? 'Adding...' : 'Add Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={(open) => { if (!open) cancelEdit(); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>Update category information.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-800">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={editForm.name}
                                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                                className="bg-white"
                                required
                            />
                        </div>
                        {/* <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-800">Description</label>
                            <Input
                                value={editForm.description}
                                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                                className="bg-white"
                                placeholder="Optional description"
                            />
                        </div> */}
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={editForm.isActive}
                                onCheckedChange={(checked) => setEditForm((p) => ({ ...p, isActive: checked }))}
                                className="hover:cursor-pointer"
                            />
                            <label className="text-sm font-medium text-gray-800">Active</label>
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
                            {savingId === editingId ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleting.open} onOpenChange={(open) => { if (!open) cancelDelete(); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the category <span className="font-semibold text-primary">"{deleting.name}"</span>.
                            If any products are using this category, you won't be able to delete it until you remove or reassign those products.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="hover:cursor-pointer" onClick={cancelDelete}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="hover:cursor-pointer bg-destructive text-white hover:bg-destructive/90" onClick={doDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

