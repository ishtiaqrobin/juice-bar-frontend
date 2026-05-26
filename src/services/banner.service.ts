import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { ApiResponse } from "@/types";
import {
  Banner,
  CreateBannerData,
  UpdateBannerData,
} from "@/types/banner.type";

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

class BannerService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  async getBanners(
    params?: { isActive?: boolean },
    options?: ServiceOptions,
  ): Promise<ApiResponse<Banner[]>> {
    try {
      const url = new URL(API_ENDPOINTS.BANNERS.BASE);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const config: RequestInit = {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["banners"] };

      const response = await this.fetchWithAuth(url.toString(), config);
      return {
        ...response,
        message: "All banners retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "All banners retrieve failed",
      );
    }
  }

  async getBanner(
    id: string,
    options?: ServiceOptions,
  ): Promise<ApiResponse<Banner>> {
    try {
      const config: RequestInit = {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      const response = await this.fetchWithAuth(
        API_ENDPOINTS.BANNERS.BY_ID(id),
        config,
      );
      return {
        ...response,
        message: "Banner retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Banner retrieve failed",
      );
    }
  }

  async createBanner(
    data: CreateBannerData & { imageFile?: File },
  ): Promise<ApiResponse<Banner>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("better-auth.session_token")?.value;

      // If there's an image file, use FormData for multipart upload (Cloudinary)
      if (data.imageFile) {
        const formData = new FormData();
        formData.append("image", data.imageFile);
        formData.append("text", data.text || "");
        formData.append("description", data.description || "");
        formData.append("isActive", String(data.isActive ?? true));
        formData.append("order", String(data.order ?? 0));

        const headers: Record<string, string> = {
          Cookie: cookieStore.toString(),
        };

        if (sessionToken) {
          headers["Authorization"] = `Bearer ${sessionToken}`;
        }

        const response = await fetch(API_ENDPOINTS.BANNERS.BASE, {
          method: "POST",
          body: formData,
          credentials: "include",
          headers,
        });

        const jsonData = await response.json();

        if (!response.ok) {
          throw new Error(jsonData.message || "Request failed");
        }

        return {
          ...jsonData,
          message: "Banner created successfully",
        };
      }

      // Otherwise, send JSON (for image URL passed from client)
      const headers: Record<string, string> = {
        Cookie: cookieStore.toString(),
      };
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      const response = await this.fetchWithAuth(API_ENDPOINTS.BANNERS.BASE, {
        method: "POST",
        body: JSON.stringify(data),
        headers,
      });
      return {
        ...response,
        message: "Banner created successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Banner creation failed",
      );
    }
  }

  async updateBanner(
    id: string,
    data: UpdateBannerData & { imageFile?: File },
  ): Promise<ApiResponse<Banner>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("better-auth.session_token")?.value;

      // If there's an image file, use FormData for multipart upload (Cloudinary)
      if (data.imageFile) {
        const formData = new FormData();
        formData.append("image", data.imageFile);
        if (data.text !== undefined) formData.append("text", data.text);
        if (data.description !== undefined)
          formData.append("description", data.description || "");
        if (data.isActive !== undefined)
          formData.append("isActive", String(data.isActive));
        if (data.order !== undefined)
          formData.append("order", String(data.order));

        const headers: Record<string, string> = {
          Cookie: cookieStore.toString(),
        };
        if (sessionToken) {
          headers["Authorization"] = `Bearer ${sessionToken}`;
        }

        const response = await fetch(API_ENDPOINTS.BANNERS.BY_ID(id), {
          method: "PUT",
          body: formData,
          credentials: "include",
          headers,
        });

        const jsonData = await response.json();

        if (!response.ok) {
          throw new Error(jsonData.message || "Request failed");
        }

        return {
          ...jsonData,
          message: "Banner updated successfully",
        };
      }

      // Otherwise, send JSON (for image URL passed from client)
      const headers: Record<string, string> = {
        Cookie: cookieStore.toString(),
      };
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      const response = await this.fetchWithAuth(
        API_ENDPOINTS.BANNERS.BY_ID(id),
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers,
        },
      );
      return {
        ...response,
        message: "Banner updated successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Banner update failed",
      );
    }
  }

  async deleteBanner(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("better-auth.session_token")?.value;

      const headers: Record<string, string> = {
        Cookie: cookieStore.toString(),
      };
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      const response = await this.fetchWithAuth(
        API_ENDPOINTS.BANNERS.BY_ID(id),
        {
          method: "DELETE",
          headers,
        },
      );
      return {
        ...response,
        message: "Banner deleted successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Banner delete failed",
      );
    }
  }
}

export const bannerService = new BannerService();
