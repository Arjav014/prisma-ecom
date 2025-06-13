import { z } from "zod";

export const ChangeStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "ACCEPTED",
    "CANCELLED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ]),
});
