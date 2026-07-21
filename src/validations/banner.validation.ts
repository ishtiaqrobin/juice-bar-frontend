import z from "zod";

export const bannerSchema = z.object({
  text: z.string().optional(),
  description: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  imageFile: z.instanceof(File).optional(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
