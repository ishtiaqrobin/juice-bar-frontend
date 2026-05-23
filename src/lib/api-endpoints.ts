import { env } from "@/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    SESSION: `${env.NEXT_PUBLIC_AUTH_URL}/get-session`,
    SIGN_IN: `${env.NEXT_PUBLIC_AUTH_URL}/sign-in/email`,
    SIGN_UP: `${env.NEXT_PUBLIC_AUTH_URL}/sign-up/email`,
    SIGN_OUT: `${env.NEXT_PUBLIC_AUTH_URL}/sign-out`,
  },
  EMAIL_OTP: {
    SEND_VERIFICATION: `${env.NEXT_PUBLIC_AUTH_URL}/email-otp/send-verification-otp`,
    RESET_PASSWORD: `${env.NEXT_PUBLIC_AUTH_URL}/email-otp/reset-password`,
  },
  USERS: {
    PROFILE: `${API_BASE_URL}/users/me`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
    DELETE_ACCOUNT: `${API_BASE_URL}/users/account`,
    DASHBOARD_STATS: `${API_BASE_URL}/users/dashboard/stats`,
  },
  ADMIN: {
    USERS: `${API_BASE_URL}/admin/users`,
    USER_BY_ID: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
    UPDATE_USER: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
    DELETE_USER: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
    UPDATE_ROLE: (id: string) => `${API_BASE_URL}/admin/users/${id}/role`,
    DASHBOARD: {
      STATS: `${API_BASE_URL}/admin/dashboard/stats`,
      ANALYTICS: `${API_BASE_URL}/admin/dashboard/analytics`,
      ACTIVITY: `${API_BASE_URL}/admin/dashboard/activity`,
      ACTIVITY_CLEAR: `${API_BASE_URL}/admin/dashboard/activity/clear`,
      REPORTS: `${API_BASE_URL}/admin/dashboard/reports`,
    },
  },
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    BY_ID: (id: string) => `${API_BASE_URL}/products/${id}`,
    BY_CATEGORY: (categoryId: string) =>
      `${API_BASE_URL}/products/category/${categoryId}`,
    FEATURED: (type: string) => `${API_BASE_URL}/products/featured/${type}`,
  },
  CATEGORIES: {
    BASE: `${API_BASE_URL}/categories`,
    BY_ID: (id: string) => `${API_BASE_URL}/categories/${id}`,
  },
  BANNERS: {
    BASE: `${API_BASE_URL}/banners`,
    BY_ID: (id: string) => `${API_BASE_URL}/banners/${id}`,
  },
  FEATURED: {
    BASE: `${API_BASE_URL}/featured`,
    BY_ID: (id: string) => `${API_BASE_URL}/featured/${id}`,
  },
  UPLOAD: {
    PROFILE: `${API_BASE_URL}/upload/profile`,
    PRODUCT: `${API_BASE_URL}/upload/product`,
    BANNER: `${API_BASE_URL}/upload/banner`,
  },
} as const;
