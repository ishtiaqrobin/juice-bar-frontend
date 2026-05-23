import z from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters long")
    .max(15, "Name must be less than 15 characters"),
  description: z
    .string()
    .max(50, "Description must be less than 50 characters")
    .optional(),
  isActive: z.boolean().optional(),
  image: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
