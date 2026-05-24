export interface Banner {
  id: string;
  text: string;
  description: string | null;
  image: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerData {
  text?: string;
  description?: string | null;
  image?: string;
  isActive?: boolean;
  order?: number;
  imageFile?: File;
}

export interface UpdateBannerData {
  text?: string;
  description?: string | null;
  image?: string;
  isActive?: boolean;
  order?: number;
  imageFile?: File;
}
