import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  tags: z.array(z.string()),
});