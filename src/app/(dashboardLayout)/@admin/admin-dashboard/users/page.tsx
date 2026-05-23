import UsersClient from "@/components/modules/admin/user/UsersClient";
import { adminService } from "@/services";

export const metadata = {
    title: "Users | Admin Dashboard",
    description: "Manage users for your juice bar",
};

const LIMIT = 10;

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{
        role?: string;
        page?: string;
    }>;
}) {
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const role = params.role || "ALL";

    const fetchParams: { page: number; limit: number; role?: string } = {
        page,
        limit: LIMIT,
    };

    if (role && role !== "ALL") fetchParams.role = role;

    const response = await adminService.getUsers(fetchParams);

    const users = response.data || [];

    const pagination = response.pagination || {
        limit: LIMIT,
        page: 1,
        total: 0,
        totalPages: 1,
    };

    return (
        <div>
            <UsersClient
                users={users}
                pagination={pagination}
                limit={LIMIT}
                roleDefault={role}
            />
        </div>
    );
}
