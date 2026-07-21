export interface FeaturedOption {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeaturedData {
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateFeaturedData {
  name?: string;
  description?: string | null;
  isActive?: boolean;
}
