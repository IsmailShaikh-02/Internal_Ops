// src/modules/monitor/validation/index.ts

import { z } from "zod";

// Cron regex validator (simple check for 5 space-separated components)
const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/[0-9]+)\s+(\*|([0-9]|1[0-9]|2[0-9])|\*\/[0-9]+)\s+(\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/[0-9]+)\s+(\*|([1-9]|1[0-2])|\*\/[0-9]+)\s+(\*|[0-7]|\*\/[0-9]+)$/;

export const cronExpressionSchema = z.string().refine((val) => {
  return cronRegex.test(val.trim());
}, {
  message: "Invalid cron expression. Must contain 5 space-separated fields (minutes, hours, day-of-month, month, day-of-week).",
});

export const thresholdSchema = z.object({
  cpuMax: z.number().min(0, "Threshold cannot be negative").max(100, "Percentage cannot exceed 100"),
  memoryMax: z.number().min(0, "Threshold cannot be negative").max(100, "Percentage cannot exceed 100"),
  diskMax: z.number().min(0, "Threshold cannot be negative").max(100, "Percentage cannot exceed 100"),
});

export const dateRangeSchema = z.object({
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end date",
  }),
}).refine((data) => {
  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: "End date must be on or after start date",
  path: ["endDate"],
});

export const queueNameSchema = z.string().min(1, "Queue name is required").regex(/^[a-zA-Z0-9_\-:]+$/, {
  message: "Queue name can only contain alphanumeric characters, underscores, dashes, and colons",
});
