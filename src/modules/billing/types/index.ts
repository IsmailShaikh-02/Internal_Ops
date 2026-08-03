export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  seats: number;
  storageGb: number;
  featuresCount: number;
  subscribersCount: number;
  status: "active" | "archived";
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  duration: "once" | "repeating" | "forever";
  durationMonths?: number;
  status: "active" | "expired";
  redeemedCount: number;
}

export interface TaxRate {
  id: string;
  country: string;
  name: string;
  rate: number; // percentage, e.g. 18 for 18%
  description?: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  tenantName: string;
  planId: string;
  planName: string;
  status: "active" | "past_due" | "canceled" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  tenantName: string;
  amount: number;
  status: "paid" | "open" | "uncollectible" | "void";
  dueDate: string;
  createdDate: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  tenantName: string;
  amount: number;
  status: "succeeded" | "failed" | "processing";
  method: string;
  createdDate: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  tenantName: string;
  amount: number;
  reason: string;
  status: "succeeded" | "pending" | "failed";
  createdDate: string;
}

export interface RevenueMetric {
  mrr: number;
  mrrGrowthPercent: number;
  arr: number;
  arrGrowthPercent: number;
  netNewMtd: number;
  netNewGrowthPercent: number;
  churnMtd: number;
  churnGrowthPercent: number;
}
