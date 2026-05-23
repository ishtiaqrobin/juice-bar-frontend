import { categoryService, featuredService, productService } from "@/services";
import ProductFormClient from "./ProductFormClient";

interface ProductFormProps {
  productId?: string; // present for edit, absent for create
}

export default async function ProductForm({ productId }: ProductFormProps) {
  // Run all fetches in parallel
  const [categoriesRes, featuredRes, productRes] = await Promise.all([
    categoryService.getCategories({ isActive: true }),
    featuredService.getFeaturedOptions({ isActive: true }),
    productId ? productService.getProductById(productId) : Promise.resolve({ data: null }),
  ]);

  return (
    <ProductFormClient
      product={productRes.data ?? null}
      categories={categoriesRes.data ?? []}
      featuredOptions={featuredRes.data ?? []}
    />
  );
}
