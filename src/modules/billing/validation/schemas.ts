import { z } from "zod";

export const planSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  interval: z.enum(["month", "year"]),
  seats: z.coerce.number().int().min(1, "Must have at least 1 seat"),
  storageGb: z.coerce.number().min(1, "Storage must be at least 1 GB"),
  featuresCount: z.coerce.number().int().min(0, "Features count must be 0 or more"),
});

export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().min(1, "Discount value must be at least 1"),
  duration: z.enum(["once", "repeating", "forever"]),
  durationMonths: z.coerce.number().int().min(1, "Months must be at least 1").optional(),
});

export const taxRateSchema = z.object({
  country: z.string().min(2, "Country code is required (e.g., US, EU)"),
  name: z.string().min(1, "Tax name is required"),
  rate: z.coerce.number().min(0).max(100, "Tax rate must be between 0% and 100%"),
  description: z.string().optional(),
});

export const refundSchema = z.object({
  paymentId: z.string().min(1, "Payment is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  reason: z.string().min(5, "Reason must be at least 5 characters long"),
});
