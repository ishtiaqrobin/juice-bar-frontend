import z from "zod";

export const bannerSchema = z.object({
  text: z.string().optional(),
  description: z.string().optional(),
  order: z.number().int().min(0, "Order must be a positive number").optional(),
  isActive: z.boolean().optional(),
  imageFile: z.instanceof(File, { message: "Image must be a file" }).optional(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
