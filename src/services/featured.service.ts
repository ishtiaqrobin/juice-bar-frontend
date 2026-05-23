import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  ApiResponse,
  CreateFeaturedData,
  FeaturedOption,
  UpdateFeaturedData,
} from "@/types";

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

class FeaturedService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      // credentials: "include",
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

  async getFeaturedOptions(
    params?: { isActive?: boolean },
    options?: ServiceOptions,
  ): Promise<ApiResponse<FeaturedOption[]>> {
    try {
      const url = new URL(API_ENDPOINTS.FEATURED.BASE);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const config: RequestInit = {
        // credentials: "include",
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

      config.next = { ...config.next, tags: ["featured"] };

      const response = await this.fetchWithAuth(url.toString(), config);
      return {
        ...response,
        message: "All featured options retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "All featured options retrieve failed",
      );
    }
  }

  async getFeaturedOptionById(
    id: string,
    options?: ServiceOptions,
  ): Promise<ApiResponse<FeaturedOption>> {
    try {
      const config: RequestInit = {
        // credentials: "include",
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
        API_ENDPOINTS.FEATURED.BY_ID(id),
        config,
      );
      return {
        ...response,
        message: "Featured option retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Featured option retrieve failed",
      );
    }
  }

  async createFeaturedOption(
    data: CreateFeaturedData,
  ): Promise<ApiResponse<FeaturedOption>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();

      const response = await this.fetchWithAuth(API_ENDPOINTS.FEATURED.BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(data),
      });
      return {
        ...response,
        message: "Featured option created successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Featured option creation failed",
      );
    }
  }

  async updateFeaturedOption(
    id: string,
    data: UpdateFeaturedData,
  ): Promise<ApiResponse<FeaturedOption>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();

      const response = await this.fetchWithAuth(
        API_ENDPOINTS.FEATURED.BY_ID(id),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
          },
          body: JSON.stringify(data),
        },
      );
      return {
        ...response,
        message: "Featured option updated successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Featured option update failed",
      );
    }
  }

  async deleteFeaturedOption(
    id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();

      const response = await this.fetchWithAuth(
        API_ENDPOINTS.FEATURED.BY_ID(id),
        {
          method: "DELETE",
          headers: {
            Cookie: cookieStore.toString(),
          },
        },
      );
      return {
        ...response,
        message: "Featured option deleted successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Featured option delete failed",
      );
    }
  }
}

export const featuredService = new FeaturedService();
