import { z } from "zod";

export const dashboardFilterSchema = z.object({
  dateRange: z.enum(["last_7_days", "last_30_days", "last_90_days", "custom"]).default("last_30_days"),
});
