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

  async createProduct(
    data: CreateProductData & { imageFile?: File },
  ): Promise<ApiResponse<Product>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("better-auth.session_token")?.value;

      // If there's an image file, use FormData for multipart upload (Cloudinary)
      if (data.imageFile) {
        const formData = new FormData();
        formData.append("image", data.imageFile);
        formData.append("name", data.name);
        formData.append("description", data.description || "");
        formData.append("price", String(data.price || 0));
        formData.append("categoryId", data.categoryId || "");
        formData.append("stock", String(data.stock ?? 0));
        formData.append("unitType", data.unitType || "piece");
        formData.append("featured", data.featured || "");
        formData.append(
          "addedDate",
          data.addedDate || new Date().toISOString().split("T")[0],
        );
        formData.append("discountPrice", String(data.discountPrice ?? ""));
        formData.append(
          "discountPercentage",
          String(data.discountPercentage ?? ""),
        );
        formData.append("isActive", String(data.isActive ?? true));

        const headers: Record<string, string> = {
          Cookie: cookieStore.toString(),
        };
        if (sessionToken) {
          headers["Authorization"] = `Bearer ${sessionToken}`;
        }

        const response = await fetch(API_ENDPOINTS.PRODUCTS.BASE, {
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
          message: "Product created successfully",
        };
      }

      // Otherwise, send JSON (for image URL passed from client)
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      };
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      const response = await this.fetchWithAuth(API_ENDPOINTS.PRODUCTS.BASE, {
        method: "POST",
        headers,
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
    data: UpdateProductData & { imageFile?: File },
  ): Promise<ApiResponse<Product>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("better-auth.session_token")?.value;

      // If there's an image file, use FormData for multipart upload (Cloudinary)
      if (data.imageFile) {
        const formData = new FormData();
        formData.append("image", data.imageFile);
        if (data.name !== undefined) formData.append("name", data.name);
        if (data.description !== undefined)
          formData.append("description", data.description);
        if (data.price !== undefined)
          formData.append("price", String(data.price));
        if (data.categoryId !== undefined)
          formData.append("categoryId", data.categoryId);
        if (data.stock !== undefined)
          formData.append("stock", String(data.stock));
        if (data.unitType !== undefined)
          formData.append("unitType", data.unitType);
        if (data.featured !== undefined)
          formData.append("featured", data.featured || "");
        if (data.addedDate !== undefined)
          formData.append("addedDate", data.addedDate);
        if (data.discountPrice !== undefined)
          formData.append("discountPrice", String(data.discountPrice ?? ""));
        if (data.discountPercentage !== undefined)
          formData.append(
            "discountPercentage",
            String(data.discountPercentage ?? ""),
          );
        if (data.isActive !== undefined)
          formData.append("isActive", String(data.isActive));

        const headers: Record<string, string> = {
          Cookie: cookieStore.toString(),
        };
        if (sessionToken) {
          headers["Authorization"] = `Bearer ${sessionToken}`;
        }

        const response = await fetch(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
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
          message: "Product updated successfully",
        };
      }

      // Otherwise, send JSON (for image URL passed from client)
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      };
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      const response = await this.fetchWithAuth(
        API_ENDPOINTS.PRODUCTS.BY_ID(id),
        {
          method: "PUT",
          headers,
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
      const sessionToken = cookieStore.get("better-auth.session_token")?.value;

      const headers: Record<string, string> = {
        Cookie: cookieStore.toString(),
      };
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      const response = await this.fetchWithAuth(
        API_ENDPOINTS.PRODUCTS.BY_ID(id),
        {
          method: "DELETE",
          headers,
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
