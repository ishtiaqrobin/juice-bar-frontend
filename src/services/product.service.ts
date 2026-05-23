import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  ApiResponse,
  CreateProductData,
  PaginationInfo,
  Product,
  UpdateProductData,
} from "@/types";

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

interface ProductParams {
  category?: string;
  categoryId?: string;
  search?: string;
  featured?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

class ProductService {
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

  async getProducts(
    params?: ProductParams,
    options?: ServiceOptions,
  ): Promise<ApiResponse<Product[]>> {
    try {
      const url = new URL(API_ENDPOINTS.PRODUCTS.BASE);

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

      config.next = { ...config.next, tags: ["products"] };

      const response = await this.fetchWithAuth(url.toString(), config);
      return {
        ...response,
        message: "All products retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "All products retrieve failed",
      );
    }
  }

  async getProductsPaginated(
    params?: ProductParams,
    options?: ServiceOptions,
  ): Promise<{ data: Product[]; pagination: PaginationInfo }> {
    try {
      const url = new URL(API_ENDPOINTS.PRODUCTS.BASE);

      // Force page-based pagination — backend returns { data, pagination }
      const merged = { page: 1, limit: 12, ...params };

      Object.entries(merged).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });

      const config: RequestInit = {
        headers: { "Content-Type": "application/json" },
      };

      if (options?.cache) config.cache = options.cache;
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }
      config.next = { ...config.next, tags: ["products"] };

      const response = await this.fetchWithAuth(url.toString(), config);

      return {
        data: response.data ?? [],
        pagination: response.pagination ?? {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
        },
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Paginated products retrieve failed",
      );
    }
  }

  async getProductById(
    id: string,
    options?: ServiceOptions,
  ): Promise<ApiResponse<Product>> {
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
        API_ENDPOINTS.PRODUCTS.BY_ID(id),
        config,
      );
      return {
        ...response,
        message: "Product retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Product retrieve failed",
      );
    }
  }

  async getProductsByCategory(
    categoryId: string,
    options?: ServiceOptions,
  ): Promise<ApiResponse<Product[]>> {
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
        API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId),
        config,
      );
      return {
        ...response,
        message: "Category products retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Category products retrieve failed",
      );
    }
  }

  async getFeaturedProducts(
    type: string,
    options?: ServiceOptions,
  ): Promise<ApiResponse<Product[]>> {
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
        API_ENDPOINTS.PRODUCTS.FEATURED(type),
        config,
      );
      return {
        ...response,
        message: "Featured products retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Featured products retrieve failed",
      );
    }
  }

  async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();

      const response = await this.fetchWithAuth(API_ENDPOINTS.PRODUCTS.BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(data),
      });
      return {
        ...response,
        message: "Product created successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Product creation failed",
      );
    }
  }

  async updateProduct(
    id: string,
    data: UpdateProductData,
  ): Promise<ApiResponse<Product>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();

      const response = await this.fetchWithAuth(
        API_ENDPOINTS.PRODUCTS.BY_ID(id),
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
        message: "Product updated successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Product update failed",
      );
    }
  }

  async deleteProduct(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();

      const response = await this.fetchWithAuth(
        API_ENDPOINTS.PRODUCTS.BY_ID(id),
        {
          method: "DELETE",
          headers: {
            Cookie: cookieStore.toString(),
          },
        },
      );
      return {
        ...response,
        message: "Product deleted successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Product delete failed",
      );
    }
  }
}

export const productService = new ProductService();
