"use client";

import React from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Trash2, Shield, User as UserIcon, RefreshCw, SquarePen } from 'lucide-react';
import Image from 'next/image';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function UsersPage() {
    const [roleFilter, setRoleFilter] = React.useState('ALL');
    const [query, setQuery] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [limit] = React.useState(20);

    const searchParams = new URLSearchParams();
    if (roleFilter && roleFilter !== 'ALL') searchParams.set('role', roleFilter);
    if (query) searchParams.set('search', query);
    searchParams.set('page', String(page));
    searchParams.set('limit', String(limit));

    const { data, isLoading, mutate, error } = useSWR(`/api/admin/users?${searchParams.toString()}`, fetcher, {
        revalidateOnFocus: false,
    });

    const users = data?.users || [];
    const pagination = data?.pagination || { page, totalPages: 1, total: users.length };

    const [editingId, setEditingId] = React.useState(null);
    const [editOpen, setEditOpen] = React.useState(false);
    const [editForm, setEditForm] = React.useState({ name: '', phone: '', role: 'USER' });
    const [savingId, setSavingId] = React.useState(null);
    const [deleting, setDeleting] = React.useState({ open: false, userId: null, name: '' });


    const startEdit = (user) => {
        setEditingId(user.id);
        setEditForm({ name: user.name || '', phone: user.phone || '', role: user.role || 'USER' });
        setEditOpen(true);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: '', phone: '', role: 'USER' });
        setEditOpen(false);
    };

    const saveEdit = async (userId) => {
        setSavingId(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            if (!res.ok) throw new Error('Failed to update user');
            toast.success('User updated');
            cancelEdit();
            mutate();
        } catch (e) {
            toast.error(e.message || 'Update failed');
        } finally {
            setSavingId(null);
        }
    };

    // status feature removed

    const confirmDelete = (user) => setDeleting({ open: true, userId: user.id, name: user.name || user.email });
    const cancelDelete = () => setDeleting({ open: false, userId: null, name: '' });
    const doDelete = async () => {
        if (!deleting.userId) return;
        try {
            const res = await fetch(`/api/admin/users/${deleting.userId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete user');
            toast.success('User deleted');
            cancelDelete();
            mutate();
        } catch (e) {
            toast.error(e.message || 'Delete failed');
        }
    };

    return (
        <div className="mx-auto w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h1 className="text-2xl font-bold">Users</h1>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Search name, email or phone"
                        className="bg-white w-full md:w-[300px]"
                    />
                    <div className="flex items-center gap-2">
                        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
                            <SelectTrigger className="bg-white w-full md:w-[180px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="lg" variant="secondary" className="hover:cursor-pointer" onClick={() => { setQuery(''); setRoleFilter('ALL'); setPage(1); mutate(); }}>
                            <RefreshCw size={16} className="mr-2" /> Reset
                        </Button>
                    </div>

                </div>
            </div>

            {error ? (
                <div className="text-center text-red-600">Failed to load users</div>
            ) : (
                <div className="bg-gray-100 border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[28%]">Name</TableHead>
                                <TableHead className="w-[28%]">Email</TableHead>
                                <TableHead className="w-[18%]">Phone</TableHead>
                                <TableHead className="w-[12%]">Role</TableHead>
                                <TableHead className="w-[10%]" >Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(6)].map((_, idx) => (
                                    <TableRow key={`skeleton-${idx}`} className="align-middle">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-40" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-18 rounded-full" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-8 w-9" />
                                                <Skeleton className="h-8 w-9" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-600">No users found</TableCell>
                                </TableRow>
                            ) : users.map((u) => {
                                return (
                                    <TableRow key={u.id} className="align-middle">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                                    {u.image ? (
                                                        <Image src={u.image} alt={u.name || 'User'} width={32} height={32} className="h-8 w-8 object-cover" />
                                                    ) : (
                                                        <UserIcon size={16} className="text-gray-500" />
                                                    )}
                                                </div>
                                                <span className="font-medium">{u.name || '—'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-gray-700">{u.email}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-gray-700">{u.phone || '—'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Shield size={16} /> <span className="text-gray-800">{u.role}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="">
                                            <div className="flex items-center gap-2 justify-start">
                                                <Button size="sm" variant="outline" className="hover:cursor-pointer" onClick={() => startEdit(u)}>
                                                    <SquarePen size={14} className="" />
                                                </Button>
                                                <Button size="sm" variant="destructive" className="hover:cursor-pointer" onClick={() => confirmDelete(u)}>
                                                    <Trash2 size={14} className="" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-between p-2.5 border-t rounded-x-md rounded-b-md bg-white">
                        <div className="text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="hover:cursor-pointer" disabled={pagination.page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                            <Button variant="outline" className="hover:cursor-pointer" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                        </div>
                    </div>
                </div>
            )}

            <AlertDialog open={deleting.open} onOpenChange={(open) => { if (!open) cancelDelete(); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete user?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. You are about to delete <span className="font-semibold">{deleting.name}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="hover:cursor-pointer" onClick={cancelDelete}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="hover:cursor-pointer" onClick={doDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={editOpen} onOpenChange={(open) => { if (!open) cancelEdit(); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit user</DialogTitle>
                        <DialogDescription>Update user information and role, then save.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-800">Name</label>
                            <Input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className="bg-white" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-800">Role</label>
                            <Select value={editForm.role} onValueChange={(v) => setEditForm((p) => ({ ...p, role: v }))}>
                                <SelectTrigger className="bg-white w-full"><SelectValue placeholder="Role" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="USER">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-800">Phone</label>
                            <Input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} className="bg-white" />
                        </div>

                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="hover:cursor-pointer" onClick={cancelEdit}>
                            Cancel
                        </Button>
                        <Button className="hover:cursor-pointer" onClick={() => saveEdit(editingId)} disabled={!editingId || savingId === editingId}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}