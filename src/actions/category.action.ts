"use server";

import { revalidateTag } from "next/cache";
import { categoryService } from "@/services";
import { CreateCategoryData, UpdateCategoryData } from "@/types";

export const getCategories = async () => {
  return await categoryService.getCategories();
};

/**
 * Public menu page — fetches all active categories with Next.js tag-based caching.
 * Automatically invalidated when admin calls revalidateTag("categories", "max").
 */
export const getMenuCategories = async () => {
  return await categoryService.getCategories(
    { isActive: true },
    // { revalidate: 3600 },
    { revalidate: 10 }, 
  );
};

export const createCategory = async (categoryData: CreateCategoryData) => {
  try {
    const res = await categoryService.createCategory(categoryData);
    revalidateTag("categories", "max");
    console.log(res);

    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to create category",
      },
    };
  }
};

export const updateCategory = async (
  id: string,
  categoryData: UpdateCategoryData,
) => {
  try {
    const res = await categoryService.updateCategory(id, categoryData);
    revalidateTag("categories", "max");
    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to update category",
      },
    };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const res = await categoryService.deleteCategory(id);
    revalidateTag("categories", "max");
    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete category",
      },
    };
  }
};
