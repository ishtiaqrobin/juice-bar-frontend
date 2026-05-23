import ProductForm from "@/components/modules/admin/product/ProductForm";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="container mx-auto">
            <ProductForm productId={id} />
        </div>
    );
}
