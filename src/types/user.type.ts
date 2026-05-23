export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  phone?: string | null;
  emailVerified?: boolean;
  isActive?: boolean;
  isBanned?: boolean;
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
