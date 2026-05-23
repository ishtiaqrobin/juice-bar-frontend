export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
}
