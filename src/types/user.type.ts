import { Role } from "./enums";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: Role;
  phone?: string | null;
  emailVerified?: boolean;
  isActive?: boolean;
  isBanned?: boolean;
  lastLoginMethod?: string | null;
  needPasswordChange?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token?: string;
  [key: string]: unknown; // Allow additional properties from Better Auth
}

export interface GetDashboardStats {
  membershipDays: number;
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
  rewardPoints: number;
}
