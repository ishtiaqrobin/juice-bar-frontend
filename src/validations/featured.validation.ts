import z from "zod";

export const featuredSchema = z.object({
  name: z
    .string()
    .min(2, "Featured option name must be at least 2 characters long")
    .max(15, "Name must be less than 15 characters"),
  description: z
    .string()
    .max(50, "Description must be less than 50 characters")
    .optional(),
  isActive: z.boolean(),
});

export type FeaturedFormValues = z.infer<typeof featuredSchema>;
