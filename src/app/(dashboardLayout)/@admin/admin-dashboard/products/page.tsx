
import ProductsClient from "@/components/modules/admin/product/ProductsClient";
import { categoryService, productService } from "@/services";

export const metadata = {
    title: "Products | Admin Dashboard",
    description: "Manage products for your juice bar",
};

const PAGE_SIZE = 12;

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{
        isActive?: string;
        category?: string;
        search?: string;
    }>;
}) {
    const params = await searchParams;

    const fetchParams: Parameters<typeof productService.getProductsPaginated>[0] = {
        page: 1,
        limit: PAGE_SIZE,
    };

    if (params.isActive === "true") fetchParams.isActive = true;
    if (params.isActive === "false") fetchParams.isActive = false;
    if (params.category) fetchParams.category = params.category;
    if (params.search) fetchParams.search = params.search;

    const [{ data: productsData, pagination }, { data: categoriesData }] =
        await Promise.all([
            productService.getProductsPaginated(fetchParams),
            categoryService.getCategories({ isActive: true }),
        ]);

    return (
        <div>
            <ProductsClient
                products={productsData || []}
                categories={categoriesData || []}
                activeFilters={{
                    isActive: params.isActive,
                    category: params.category || "",
                    search: params.search || "",
                }}
                pagination={pagination}
            />
        </div>
    );
}
