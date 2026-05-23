import CategoriesClient from "@/components/modules/admin/category/CategoriesClient";
import { categoryService } from "@/services";

export const metadata = {
    title: "Categories | Admin Dashboard",
    description: "Manage product categories for your juice bar",
};

export default async function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ isActive?: string }>;
}) {
    const params = await searchParams;

    const showAll = params.isActive === "false";
    const fetchParams = showAll ? {} : { isActive: true };

    const { data: categoriesData } = await categoryService.getCategories(fetchParams);

    return (
        <div>
            <CategoriesClient
                categories={categoriesData || []}
                showInactiveDefault={showAll}
            />
        </div>
    );
}
