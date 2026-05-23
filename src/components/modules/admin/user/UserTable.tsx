"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, SquarePen, Shield, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/types";
import { deleteUser } from "@/actions/admin.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
}

interface UserTableProps {
  users: User[];
  pagination: Pagination;
  limit: number;
  loading?: boolean;
  onEdit: (user: User) => void;
  onDeleteSuccess?: () => void;
  onPageChange: (page: number) => void;
}

export default function UserTable({
  users,
  pagination,
  limit,
  loading = false,
  onEdit,
  onDeleteSuccess,
  onPageChange,
}: UserTableProps) {
  const [deleting, setDeleting] = useState<{
    open: boolean;
    userId: string | null;
    name: string;
  }>({ open: false, userId: null, name: "" });

  const confirmDelete = (user: User) => {
    setDeleting({ open: true, userId: user.id, name: user.name || user.email });
  };

  const cancelDelete = () => {
    setDeleting({ open: false, userId: null, name: "" });
  };

  const doDelete = async () => {
    if (!deleting.userId) return;
    try {
      const res = await deleteUser(deleting.userId);
      if (res.error) {
        toast.error(res.error.message);
        return;
      }
      toast.success("User deleted successfully");
      cancelDelete();
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <>
      <div className="bg-gray-100 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[28%]">Name</TableHead>
              <TableHead className="w-[28%]">Email</TableHead>
              <TableHead className="w-[18%] hidden md:table-cell">
                Phone
              </TableHead>
              <TableHead className="w-[12%]">Role</TableHead>
              <TableHead className="w-[10%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
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
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-9 rounded-md" />
                      <Skeleton className="h-8 w-9 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-600"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="align-middle">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "User"}
                            width={32}
                            height={32}
                            className="h-8 w-8 object-cover"
                          />
                        ) : (
                          <UserIcon size={16} className="text-gray-500" />
                        )}
                      </div>
                      <span className="font-medium">{user.name || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">{user.email}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-gray-700">{user.phone || "—"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Shield
                        size={14}
                        className={` ${user.role === "ADMIN" ? "text-green-500" : "text-gray-500"}`}
                      />
                      <span className="text-gray-800 text-sm">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:cursor-pointer"
                        onClick={() => onEdit(user)}
                      >
                        <SquarePen size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="hover:cursor-pointer"
                        onClick={() => confirmDelete(user)}
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

        <TablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={limit}
          pageCount={users.length}
          label="users"
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete User?"
        description={
          <>
            This action cannot be undone. Are you sure you want to permanently
            delete this user{" "}
            <span className="font-semibold text-primary">
              &quot;{deleting.name}&quot;&nbsp;
            </span>
            ?
          </>
        }
      />
    </>
  );
}
