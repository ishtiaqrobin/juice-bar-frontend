import FeaturedClient from "@/components/modules/admin/featured/FeaturedClient";
import { featuredService } from "@/services";

export const metadata = {
    title: "Featured Options | Admin Dashboard",
    description: "Manage featured product options for your juice bar",
};

export default async function FeaturedPage({
    searchParams,
}: {
    searchParams: Promise<{ isActive?: string }>;
}) {
    const params = await searchParams;

    const showAll = params.isActive === "false";
    const fetchParams = showAll ? {} : { isActive: true };

    const { data: featuredData } = await featuredService.getFeaturedOptions(fetchParams);

    return (
        <div>
            <FeaturedClient
                featuredOptions={featuredData || []}
                showInactiveDefault={showAll}
            />
        </div>
    );
}
