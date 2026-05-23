import { Product } from "./product.type";

export interface ProductFormProps {
  product?: Product;
}

export interface FormData {
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId: string;
  stock: string;
  unitType: string;
  featured: string;
  addedDate: string;
  discountPrice: string;
  discountPercentage: string;
  isActive: boolean;
}
