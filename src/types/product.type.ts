import { Category } from "./category.type";
import { UnitType } from "./enums";

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  categoryId?: string;
  description?: string;
  isActive?: boolean;
  featured?: string | null;
  stock?: number;
  unitType?: UnitType;
  addedDate?: string;
  discountPrice?: number | null;
  discountPercentage?: number | null;
  category?: Category;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId?: string;
  featured?: string | null;
  isActive?: boolean;
  stock?: number;
  unitType?: UnitType;
  addedDate?: string;
  discountPrice?: number | null;
  discountPercentage?: number | null;
  imageFile?: File;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  categoryId?: string;
  featured?: string | null;
  isActive?: boolean;
  stock?: number;
  unitType?: UnitType;
  addedDate?: string;
  discountPrice?: number | null;
  discountPercentage?: number | null;
  imageFile?: File;
}

export interface ActiveFilters {
  isActive?: string;
  category?: string;
  search?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsClientProps {
  products: Product[];
  categories: Category[];
  activeFilters: ActiveFilters;
  pagination: PaginationInfo;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  stock: number;
  unitType: UnitType;
  featured: string | null;
  addedDate: string;
  discountPrice: number | null;
  discountPercentage: number | null;
  isActive: boolean;
}

export interface SaveProductResult {
  error: string | null;
}
