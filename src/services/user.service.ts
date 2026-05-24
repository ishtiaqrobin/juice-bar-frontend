import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { ApiResponse, GetDashboardStats, User } from "@/types";
import { authClient } from "@/lib/auth-client";

interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  imageFile?: File;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

class UserService {
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

  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await this.fetchWithAuth(API_ENDPOINTS.USERS.PROFILE);
      return {
        ...response,
        message: "Profile retrieved successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Profile retrieval failed",
      );
    }
  }

  async updateProfile(
    data: UpdateProfileData & { imageFile?: File },
  ): Promise<ApiResponse<User>> {
    try {
      // If there's an image file, use FormData for multipart upload (Cloudinary)
      if (data.imageFile) {
        const formData = new FormData();
        formData.append("image", data.imageFile);
        if (data.name !== undefined) formData.append("name", data.name);
        if (data.email !== undefined) formData.append("email", data.email);
        if (data.phone !== undefined) formData.append("phone", data.phone);

        const response = await fetch(API_ENDPOINTS.USERS.UPDATE_PROFILE, {
          method: "PUT",
          body: formData,
          credentials: "include",
        });

        const jsonData = await response.json();

        if (!response.ok) {
          throw new Error(jsonData.message || "Request failed");
        }

        return {
          ...jsonData,
          message: "Profile updated successfully",
        };
      }

      // Otherwise, send JSON
      const response = await this.fetchWithAuth(
        API_ENDPOINTS.USERS.UPDATE_PROFILE,
        {
          method: "PUT",
          body: JSON.stringify(data),
        },
      );
      return {
        ...response,
        message: "Profile updated successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Profile update failed",
      );
    }
  }

  async deleteAccount(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.fetchWithAuth(
        API_ENDPOINTS.USERS.DELETE_ACCOUNT,
        {
          method: "DELETE",
        },
      );
      return {
        ...response,
        message: "Account deleted successfully",
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Account deletion failed",
      );
    }
  }

  async changePassword(
    data: ChangePasswordData,
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      // Use better-auth client for password change
      await authClient.changePassword({
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: false,
      });

      return {
        success: true,
        message: "Password changed successfully",
        data: { message: "Password changed successfully" },
      };
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Password change failed",
      );
    }
  }

  async uploadProfileImage(
    file: File,
  ): Promise<ApiResponse<{ url: string; filename: string; path: string }>> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(API_ENDPOINTS.UPLOAD.PROFILE, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      return data;
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Image upload failed",
      );
    }
  }

  async getDashboardStats(): Promise<ApiResponse<GetDashboardStats>> {
    try {
      return await this.fetchWithAuth(API_ENDPOINTS.USERS.DASHBOARD_STATS);
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error ? error.message : "Fetch dashboard stats failed",
      );
    }
  }
}

export const userService = new UserService();
