import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { ApiResponse, User } from "@/types";
import {
  GenerateReport,
  GetActivities,
  GetAnalytics,
  GetDashboardStats,
  UpdateUserData,
} from "@/types/admin.type";

class AdminService {
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

  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    isActive?: boolean;
    isBanned?: boolean;
    emailVerified?: boolean;
  }): Promise<ApiResponse<User[]>> {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("better-auth.session_token")?.value;

      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.role) queryParams.append("role", params.role);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.isActive !== undefined) queryParams.append("isActive", String(params.isActive));
      if (params?.isBanned !== undefined) queryParams.append("isBanned", String(params.isBanned));
      if (params?.emailVerified !== undefined) queryParams.append("emailVerified", String(params.emailVerified));

      const url = `${API_ENDPOINTS.ADMIN.USERS}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const headers: Record<string, string> = {
        Cookie: cookieStore.toString(),
      };
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      const response = await this.fetchWithAuth(url, {
        headers,
      });
      return {
        ...response,
        message: "All users retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "All users retrieve failed",
      );
    }
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await this.fetchWithAuth(
        API_ENDPOINTS.ADMIN.USER_BY_ID(id),
      );
      return {
        ...response,
        message: "User retrieve successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "User retrieve failed",
      );
    }
  }

  async updateUser(
    id: string,
    data: UpdateUserData,
  ): Promise<ApiResponse<User>> {
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
        API_ENDPOINTS.ADMIN.UPDATE_USER(id),
        {
          method: "PUT",
          headers,
          body: JSON.stringify(data),
        },
      );
      return {
        ...response,
        message: "User updated successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "User update failed",
      );
    }
  }

  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
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
        API_ENDPOINTS.ADMIN.DELETE_USER(id),
        {
          method: "DELETE",
          headers,
        },
      );
      return {
        ...response,
        message: "User deleted successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "User delete failed",
      );
    }
  }

  async getDashboardStats(): Promise<ApiResponse<GetDashboardStats>> {
    try {
      return await this.fetchWithAuth(API_ENDPOINTS.ADMIN.DASHBOARD.STATS);
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Fetch dashboard stats failed",
      );
    }
  }

  async getAnalytics(
    period: string = "month",
  ): Promise<ApiResponse<GetAnalytics>> {
    try {
      const url = `${API_ENDPOINTS.ADMIN.DASHBOARD.ANALYTICS}?period=${period}`;
      return await this.fetchWithAuth(url);
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Fetch analytics failed",
      );
    }
  }

  async getActivities(): Promise<ApiResponse<GetActivities[]>> {
    try {
      return await this.fetchWithAuth(API_ENDPOINTS.ADMIN.DASHBOARD.ACTIVITY);
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Fetch activities failed",
      );
    }
  }

  async clearActivities(): Promise<ApiResponse<void>> {
    try {
      return await this.fetchWithAuth(
        API_ENDPOINTS.ADMIN.DASHBOARD.ACTIVITY_CLEAR,
        {
          method: "POST",
        },
      );
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Clear activities failed",
      );
    }
  }

  async generateReport(type: string): Promise<ApiResponse<GenerateReport>> {
    try {
      const url = `${API_ENDPOINTS.ADMIN.DASHBOARD.REPORTS}?type=${type}`;
      return await this.fetchWithAuth(url);
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Generate report failed",
      );
    }
  }
}

export const adminService = new AdminService();
