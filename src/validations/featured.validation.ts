import z from "zod";

export const featuredSchema = z.object({
  name: z.string().min(1, "Featured option name is required"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type FeaturedFormValues = z.infer<typeof featuredSchema>;
