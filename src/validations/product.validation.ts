import z from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required").max(50),
  description: z.string().default(""),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => parseFloat(v) > 0, {
      message: "Price must be greater than 0",
    }),
  image: z.string().min(1, "Product image is required"),
  categoryId: z
    .string()
    .min(1, "Category is required")
    .nonempty("Please select a category"),
  stock: z
    .string()
    .min(1, "Stock is required")
    .refine((v) => parseInt(v) >= 0, {
      message: "Stock cannot be negative",
    }),
  unitType: z.string().default("piece"),
  featured: z.string().default("none"),
  addedDate: z.string().default(() => new Date().toISOString().split("T")[0]),
  discountPercentage: z.string().default(""),
  discountPrice: z.string().default(""),
  isActive: z.boolean().default(true),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>;
