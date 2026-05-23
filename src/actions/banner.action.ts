"use server";

import { revalidateTag } from "next/cache";
import { bannerService } from "@/services";
import { CreateBannerData, UpdateBannerData } from "@/types/banner.type";

export const getBanners = async () => {
  return await bannerService.getBanners();
};

export const createBanner = async (bannerData: CreateBannerData) => {
  try {
    const res = await bannerService.createBanner(bannerData);
    revalidateTag("banners", "max");
    console.log(res);

    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to create banner",
      },
    };
  }
};

export const updateBanner = async (
  id: string,
  bannerData: UpdateBannerData,
) => {
  try {
    const res = await bannerService.updateBanner(id, bannerData);
    revalidateTag("banners", "max");
    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to update banner",
      },
    };
  }
};

export const deleteBanner = async (id: string) => {
  try {
    const res = await bannerService.deleteBanner(id);
    revalidateTag("banners", "max");
    return { data: res.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete banner",
      },
    };
  }
};
