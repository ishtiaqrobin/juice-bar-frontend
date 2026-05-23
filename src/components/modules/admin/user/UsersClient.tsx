"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { User } from "@/types";
import UserTable from "@/components/modules/admin/user/UserTable";
import UserDialog from "@/components/modules/admin/user/UserDialog";

interface Pagination {
    page: number;
    totalPages: number;
    total: number;
}

interface UsersClientProps {
    users: User[];
    pagination: Pagination;
    limit: number;
    roleDefault: string;
}

export default function UsersClient({
    users,
    pagination,
    limit,
    roleDefault,
}: UsersClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Client-side search state — does NOT trigger server refetch
    const [query, setQuery] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Helper: build and push URL from overrides
    const updateURL = (overrides: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(overrides).forEach(([key, value]) => {
            if (value === undefined || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        const qs = params.toString();
        router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    };

    const handleRoleChange = (value: string) => {
        updateURL({ role: value === "ALL" ? undefined : value, page: undefined });
    };

    const handleReset = () => {
        setQuery("");
        router.push(pathname);
    };

    const handlePageChange = (newPage: number) => {
        updateURL({ page: String(newPage) });
    };

    const handleSuccess = () => {
        router.refresh();
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedUser(null);
    };

    // Client-side search: filter within the already-fetched users prop
    const filteredUsers = useMemo(() => {
        if (!query.trim()) return users;
        const q = query.toLowerCase();
        return users.filter(
            (u) =>
                u.name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.phone?.toLowerCase().includes(q)
        );
    }, [users, query]);

    return (
        <div className="mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h1 className="text-2xl font-bold">Users</h1>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name, email or phone"
                        className="bg-white w-full md:w-[300px]"
                    />
                    <div className="flex items-center gap-2">
                        <Select
                            value={roleDefault}
                            onValueChange={handleRoleChange}
                        >
                            <SelectTrigger className="bg-white w-full md:w-[150px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Roles</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            className="hover:cursor-pointer"
                            onClick={handleReset}
                        >
                            <RefreshCw size={16} className="mr-2" /> Reset
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <UserTable
                users={filteredUsers}
                pagination={pagination}
                limit={limit}
                onEdit={handleEdit}
                onDeleteSuccess={handleSuccess}
                onPageChange={handlePageChange}
            />

            {/* Edit Dialog */}
            <UserDialog
                open={dialogOpen}
                onOpenChange={(open) => {
                    if (!open) handleDialogClose();
                }}
                user={selectedUser}
                onSuccess={handleSuccess}
            />
        </div>
    );
}