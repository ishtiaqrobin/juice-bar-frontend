import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  ApiResponse,
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types";

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

class CategoryService {
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

  async getCategories(
    params?: { isActive?: boolean },
    options?: ServiceOptions,
  ): Promise<ApiResponse<Category[]>> {
    try {
      const url = new URL(API_ENDPOINTS.CATEGORIES.BASE);

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

      config.next = { ...config.next, tags: ["categories"] };

      const response = await this.fetchWithAuth(url.toString(), config);
      return {
        ...response,
        message: "All categories retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "All categories retrieve failed",
      );
    }
  }

  async getCategoryById(
    id: string,
    options?: ServiceOptions,
  ): Promise<ApiResponse<Category>> {
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
        API_ENDPOINTS.CATEGORIES.BY_ID(id),
        config,
      );
      return {
        ...response,
        message: "Category retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Category retrieve failed",
      );
    }
  }

  async createCategory(
    data: CreateCategoryData,
  ): Promise<ApiResponse<Category>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("better-auth.session_token")?.value;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      };
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      const response = await this.fetchWithAuth(API_ENDPOINTS.CATEGORIES.BASE, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      return {
        ...response,
        message: "Category created successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Category creation failed",
      );
    }
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryData,
  ): Promise<ApiResponse<Category>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("better-auth.session_token")?.value;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      };
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      const response = await this.fetchWithAuth(
        API_ENDPOINTS.CATEGORIES.BY_ID(id),
        {
          method: "PUT",
          headers,
          body: JSON.stringify(data),
        },
      );
      return {
        ...response,
        message: "Category updated successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Category update failed",
      );
    }
  }

  async deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
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
        API_ENDPOINTS.CATEGORIES.BY_ID(id),
        {
          method: "DELETE",
          headers,
        },
      );
      return {
        ...response,
        message: "Category deleted successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Category delete failed",
      );
    }
  }
}

export const categoryService = new CategoryService();
