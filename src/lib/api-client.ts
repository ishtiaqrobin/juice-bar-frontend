import axios, { AxiosInstance, AxiosResponse } from "axios";

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or sessionStorage
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || sessionStorage.getItem("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Only redirect if NOT already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// API methods
export const api = {
  // Auth endpoints
  auth: {
    register: (data: {
      name: string;
      email?: string;
      phone?: string;
      password: string;
    }) => apiClient.post("/auth/register", data),

    login: (data: {
      email?: string;
      phone?: string;
      password: string;
      rememberMe?: boolean;
    }) => apiClient.post("/auth/login", data),

    refresh: (refreshToken: string) =>
      apiClient.post("/auth/refresh", { refreshToken }),

    getProfile: () => apiClient.get("/auth/profile"),

    changePassword: (data: { oldPassword: string; newPassword: string }) =>
      apiClient.put("/auth/change-password", data),

    forgotPassword: (email: string) =>
      apiClient.post("/auth/forgot-password", { email }),

    resetPassword: (data: { token: string; newPassword: string }) =>
      apiClient.post("/auth/reset-password", data),
  },

  // Product endpoints
  products: {
    getAll: (params?: {
      categoryId?: string;
      featured?: string;
      isActive?: boolean;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      limit?: number;
      offset?: number;
    }) => apiClient.get("/products", { params }),

    getById: (id: string) => apiClient.get(`/products/${id}`),

    getByCategory: (categoryId: string) =>
      apiClient.get(`/products/category/${categoryId}`),

    getFeatured: (featured: string) =>
      apiClient.get(`/products/featured/${featured}`),

    create: (data: Record<string, unknown>) =>
      apiClient.post("/products", data),

    update: (id: string, data: Record<string, unknown>) =>
      apiClient.put(`/products/${id}`, data),

    delete: (id: string) => apiClient.delete(`/products/${id}`),
  },

  // Category endpoints
  categories: {
    getAll: (params?: { isActive?: boolean }) =>
      apiClient.get("/categories", { params }),

    getById: (id: string) => apiClient.get(`/categories/${id}`),

    create: (data: { name: string; description?: string; image?: string }) =>
      apiClient.post("/categories", data),

    update: (id: string, data: Record<string, unknown>) =>
      apiClient.put(`/categories/${id}`, data),

    delete: (id: string) => apiClient.delete(`/categories/${id}`),
  },

  // Banner endpoints
  banners: {
    getAll: (params?: { isActive?: boolean }) =>
      apiClient.get("/banners", { params }),

    getById: (id: string) => apiClient.get(`/banners/${id}`),

    create: (data: {
      image: string;
      text?: string;
      description?: string;
      order?: number;
    }) => apiClient.post("/banners", data),

    update: (id: string, data: Record<string, unknown>) =>
      apiClient.put(`/banners/${id}`, data),

    delete: (id: string) => apiClient.delete(`/banners/${id}`),
  },

  // Featured options endpoints
  featured: {
    getAll: (params?: { isActive?: boolean }) =>
      apiClient.get("/featured", { params }),

    getById: (id: string) => apiClient.get(`/featured/${id}`),

    create: (data: { name: string; description?: string }) =>
      apiClient.post("/featured", data),

    update: (id: string, data: Record<string, unknown>) =>
      apiClient.put(`/featured/${id}`, data),

    delete: (id: string) => apiClient.delete(`/featured/${id}`),
  },

  // User endpoints
  users: {
    getAll: (params?: {
      search?: string;
      role?: string;
      page?: number;
      limit?: number;
    }) => apiClient.get("/users", { params }),

    getById: (id: string) => apiClient.get(`/users/${id}`),

    updateProfile: (data: { name?: string; image?: string; phone?: string }) =>
      apiClient.put("/users/profile", data),

    update: (
      id: string,
      data: { name?: string; phone?: string; role?: string }
    ) => apiClient.put(`/users/${id}`, data),

    updateRole: (id: string, role: "USER" | "ADMIN") =>
      apiClient.put(`/users/${id}/role`, { role }),

    delete: (id: string) => apiClient.delete(`/users/${id}`),

    deleteAccount: () => apiClient.delete("/users/account"),
  },

  // Upload endpoints
  upload: {
    profile: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return apiClient.post("/upload/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    product: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return apiClient.post("/upload/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    banner: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return apiClient.post("/upload/banner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    products: (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
      return apiClient.post("/upload/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  },
};

// Export axios instance for custom requests
export default apiClient;
