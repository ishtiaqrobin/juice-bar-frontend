import z from "zod";

export const bannerSchema = z.object({
  image: z.string("Image is required"),
  text: z.string().optional(),
  description: z.string().optional(),
  order: z.number().positive("Order must be a positive number").optional(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
