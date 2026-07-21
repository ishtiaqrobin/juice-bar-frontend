import z from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  image: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
