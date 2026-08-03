import { create } from "zustand";
import type { BillingPlan, Coupon, TaxRate, Subscription, Invoice, Payment, Refund } from "../types";
import {
  mockPlans,
  mockCoupons,
  mockTaxRates,
  mockSubscriptions,
  mockInvoices,
  mockPayments,
  mockRefunds
} from "../data/mockData";

interface BillingStore {
  plans: BillingPlan[];
  coupons: Coupon[];
  taxRates: TaxRate[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  payments: Payment[];
  refunds: Refund[];

  addPlan: (plan: Omit<BillingPlan, "id" | "subscribersCount" | "status">) => void;
  archivePlan: (id: string) => void;
  addCoupon: (coupon: Omit<Coupon, "id" | "status" | "redeemedCount">) => void;
  addTaxRate: (taxRate: Omit<TaxRate, "id">) => void;
  issueRefund: (refund: Omit<Refund, "id" | "status" | "createdDate">) => void;
  reconcile: () => Promise<boolean>;
}

export const useBillingStore = create<BillingStore>((set) => ({
  plans: mockPlans,
  coupons: mockCoupons,
  taxRates: mockTaxRates,
  subscriptions: mockSubscriptions,
  invoices: mockInvoices,
  payments: mockPayments,
  refunds: mockRefunds,

  addPlan: (newPlan) =>
    set((state) => ({
      plans: [
        ...state.plans,
        {
          ...newPlan,
          id: `plan-${Date.now()}`,
          subscribersCount: 0,
          status: "active",
        },
      ],
    })),

  archivePlan: (id) =>
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === id ? { ...p, status: "archived" as const } : p
      ),
    })),

  addCoupon: (newCoupon) =>
    set((state) => ({
      coupons: [
        ...state.coupons,
        {
          ...newCoupon,
          id: `coupon-${Date.now()}`,
          status: "active" as const,
          redeemedCount: 0,
        },
      ],
    })),

  addTaxRate: (newTax) =>
    set((state) => ({
      taxRates: [
        ...state.taxRates,
        {
          ...newTax,
          id: `tax-${Date.now()}`,
        },
      ],
    })),

  issueRefund: (newRefund) =>
    set((state) => {
      const refundId = `ref-${Date.now()}`;
      const refund: Refund = {
        ...newRefund,
        id: refundId,
        status: "succeeded" as const,
        createdDate: new Date().toISOString().split("T")[0],
      };
      
      // Add refund to the state list
      return {
        refunds: [refund, ...state.refunds],
      };
    }),

  reconcile: async () => {
    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Simulate updating open invoice or syncing subscriptions
    set((state) => {
      // Find open invoices and mark them paid as a simulation of reconciliation
      const updatedInvoices = state.invoices.map((inv) =>
        inv.status === "open" ? { ...inv, status: "paid" as const } : inv
      );
      
      // Update matching payments to succeeded
      const updatedPayments = state.payments.map((pay) =>
        pay.status === "failed" ? { ...pay, status: "succeeded" as const } : pay
      );

      // Resolve past due subscriptions
      const updatedSubscriptions = state.subscriptions.map((sub) =>
        sub.status === "past_due" ? { ...sub, status: "active" as const } : sub
      );

      return {
        invoices: updatedInvoices,
        payments: updatedPayments,
        subscriptions: updatedSubscriptions,
      };
    });
    return true;
  },
}));
