"use server";

import { revalidateTag } from "next/cache";
import { featuredService } from "@/services";
import { CreateFeaturedData, UpdateFeaturedData } from "@/types";

export const getFeaturedOptions = async () => {
  return await featuredService.getFeaturedOptions();
};

export const createFeaturedOption = async (
  featuredData: CreateFeaturedData,
) => {
  try {
    const res = await featuredService.createFeaturedOption(featuredData);
    revalidateTag("featured", "max");
    console.log(res);

    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create featured option",
      },
    };
  }
};

export const updateFeaturedOption = async (
  id: string,
  featuredData: UpdateFeaturedData,
) => {
  try {
    const res = await featuredService.updateFeaturedOption(id, featuredData);
    revalidateTag("featured", "max");
    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update featured option",
      },
    };
  }
};

export const deleteFeaturedOption = async (id: string) => {
  try {
    const res = await featuredService.deleteFeaturedOption(id);
    revalidateTag("featured", "max");
    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete featured option",
      },
    };
  }
};
