import { Role } from "./enums";

export interface UpdateUserData {
  name?: string;
  phone?: string;
  role?: Role;
  isActive?: boolean;
  isBanned?: boolean;
}

export interface GetDashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalBanners: number;
  activeUsers: number;
  activeProducts: number;
  recentUsers: number;
}

export interface GetAnalytics {
  userGrowth: {
    date: string;
    count: number;
  }[];
  productStats: {
    category: string;
    count: number;
  }[];
  topProducts: {
    id: string;
    name: string;
  }[];
}

export interface GetActivities {
  type: string;
  description: string;
  timestamp: string;
  metadata: {
    name: string;
  };
}

export interface GenerateReport {
  type: string;
  generatedAt: string;
  data: {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalBanners: number;
    activeUsers: number;
    activeProducts: number;
    recentUsers: number;
  };
}
