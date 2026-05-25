"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { productService } from "@/services";
import {
  CreateProductData,
  ProductPayload,
  SaveProductResult,
  UpdateProductData,
} from "@/types";

// ─── Read actions ──────────────────────────────────────────────────────────────

export const getProducts = async (
  params?: Parameters<typeof productService.getProducts>[0],
) => {
  return await productService.getProducts(params);
};

/**
 * Public menu page — fetches all active products with Next.js tag-based caching.
 * Automatically invalidated when admin calls revalidateTag("products", "max").
 */
export const getMenuProducts = async () => {
  return await productService.getProducts(
    { isActive: true },
    // { revalidate: 3600 }, // 1 hour ISR as fallback; tag invalidation is primary
    { revalidate: 10 },
  );
};

export const getProductById = async (id: string) => {
  return await productService.getProductById(id);
};

export const getProductsPaginated = async (
  params?: Parameters<typeof productService.getProductsPaginated>[0],
) => {
  return await productService.getProductsPaginated(params);
};

// ─── Mutation actions (ProductList: toggle / delete) ──────────────────────────

export const createProduct = async (
  productData: CreateProductData & { imageFile?: File },
) => {
  try {
    const res = await productService.createProduct(productData);
    revalidateTag("products", "max");
    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to create product",
      },
    };
  }
};

export const updateProduct = async (
  id: string,
  productData: UpdateProductData & { imageFile?: File },
) => {
  try {
    const res = await productService.updateProduct(id, productData);
    revalidateTag("products", "max");
    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to update product",
      },
    };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await productService.deleteProduct(id);
    revalidateTag("products", "max");
    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete product",
      },
    };
  }
};

// ─── Form action (ProductFormClient) ──────────────────────────────────────────

export async function saveProductAction(
  productId: string | null,
  payload: ProductPayload & { imageFile?: File },
): Promise<SaveProductResult> {
  try {
    if (productId) {
      await productService.updateProduct(productId, payload);
    } else {
      await productService.createProduct(payload);
    }
    revalidateTag("products", "max");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save product",
    };
  }

  // redirect() throws internally — must be outside try/catch
  redirect("/admin-dashboard/products");
}
