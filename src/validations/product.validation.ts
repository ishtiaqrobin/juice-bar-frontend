import { UnitType } from "@/types/enums";
import z from "zod";

const unitTypeValues = Object.values(UnitType) as [string, ...string[]];

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional().default(""),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => parseFloat(v) > 0, {
      message: "Price must be greater than 0",
    }),
  image: z.string().optional(),
  categoryId: z
    .string()
    .min(1, "Category is required"),
  stock: z
    .string()
    .refine((v) => v === "" || (parseInt(v) >= 0), {
      message: "Stock cannot be negative",
    })
    .optional()
    .default("0"),
  unitType: z.enum(unitTypeValues).default(UnitType.PIECE),
  featured: z.string().nullable().optional().default(""),
  addedDate: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  discountPercentage: z.string().optional().default(""),
  discountPrice: z.string().optional().default(""),
  isActive: z.boolean().optional().default(true),
  imageFile: z.instanceof(File).optional(),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>;
