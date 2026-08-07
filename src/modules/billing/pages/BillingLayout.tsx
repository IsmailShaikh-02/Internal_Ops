import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useBillingStore } from "../hooks/useBillingState";
import { ReconcileModal } from "../components/ReconcileModal";
import { NewPlanModal } from "../components/NewPlanModal";
import { NewCouponModal } from "../components/NewCouponModal";
import { AddTaxRateModal } from "../components/AddTaxRateModal";
import { IssueRefundModal } from "../components/IssueRefundModal";
import { Button } from "@/shared/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner"; // Sonner is in package.json!

export function BillingLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state and actions from store
  const {
    plans,
    subscriptions,
    invoices,
    payments,
    addPlan,
    addCoupon,
    addTaxRate,
    issueRefund,
    reconcile
  } = useBillingStore();

  // Modal open states
  const [isReconcileOpen, setIsReconcileOpen] = useState(false);
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
  const [isNewCouponOpen, setIsNewCouponOpen] = useState(false);
  const [isAddTaxOpen, setIsAddTaxOpen] = useState(false);
  const [isIssueRefundOpen, setIsIssueRefundOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsNewPlanOpen(true);
    window.addEventListener("open-new-plan-modal", handleOpenModal);
    return () => window.removeEventListener("open-new-plan-modal", handleOpenModal);
  }, []);

  // Tab definitions
  const tabs = [
    { name: "Revenue Dashboard", path: "/billing/dashboard" },
    { name: "Plans", path: "/billing/plans", count: plans.filter(p => p.status === "active").length },
    { name: "Plan Comparison", path: "/billing/comparison" },
    { name: "Subscriptions", path: "/billing/subscriptions", count: subscriptions.length },
    { name: "Invoices", path: "/billing/invoices", count: invoices.length },
    { name: "Payments", path: "/billing/payments" },
    { name: "Refunds", path: "/billing/refunds" },
    { name: "Coupons", path: "/billing/coupons" },
    { name: "Taxes", path: "/billing/taxes" },
    { name: "Revenue Reports", path: "/billing/reports" },
  ];

  // Actions handler
  const handleReconcileConfirm = async () => {
    const success = await reconcile();
    if (success) {
      toast.success("Billing data successfully reconciled with Stripe!");
    }
    return success;
  };

  // Determine path-specific actions
  const renderActionButtons = () => {
    const actions = [
      <Button
        key="reconcile"
        variant="outline"
        className="rounded-xl flex items-center gap-1.5 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
        onClick={() => setIsReconcileOpen(true)}
      >
        <RefreshCw className="h-4 w-4" />
        Reconcile
      </Button>
    ];

    if (location.pathname === "/billing/plans" || location.pathname === "/billing/dashboard") {
      actions.push(
        <Button
          key="new-plan"
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
          onClick={() => setIsNewPlanOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New plan
        </Button>
      );
    } else if (location.pathname === "/billing/coupons") {
      actions.push(
        <Button
          key="new-coupon"
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
          onClick={() => setIsNewCouponOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New coupon
        </Button>
      );
    } else if (location.pathname === "/billing/taxes") {
      actions.push(
        <Button
          key="add-tax"
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
          onClick={() => setIsAddTaxOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add rate
        </Button>
      );
    } else if (location.pathname === "/billing/refunds") {
      actions.push(
        <Button
          key="issue-refund"
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
          onClick={() => setIsIssueRefundOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Issue refund
        </Button>
      );
    }

    return actions;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <span>Platform</span>
        <span>&gt;</span>
        <span className="text-slate-800">Subscription &amp; Billing</span>
      </div>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Subscription &amp; Billing</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Plans catalog, active subscriptions, invoicing and finance operations.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-xs font-bold border border-slate-200">
            <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse" />
            Stripe live mode
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          {renderActionButtons()}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex gap-6 min-w-max pb-px">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`py-3.5 border-b-2 font-semibold text-sm transition duration-150 relative cursor-pointer ${
                  isActive
                    ? "border-slate-800 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-500"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Subpage Container */}
      {/* <div className="bg-white rounded-2xl border border-slate-200 p-0 shadow-xs min-h-[500px]"> */}
        <Outlet />
      {/* </div> */}

      {/* Modals Containers */}
      <ReconcileModal
        isOpen={isReconcileOpen}
        onClose={() => setIsReconcileOpen(false)}
        onConfirm={handleReconcileConfirm}
      />
      <NewPlanModal
        isOpen={isNewPlanOpen}
        onClose={() => setIsNewPlanOpen(false)}
        onSubmit={(data) => {
          addPlan(data);
          toast.success(`Successfully created new plan: ${data.name}`);
        }}
      />
      <NewCouponModal
        isOpen={isNewCouponOpen}
        onClose={() => setIsNewCouponOpen(false)}
        onSubmit={(data) => {
          addCoupon(data);
          toast.success(`Successfully created coupon: ${data.code}`);
        }}
      />
      <AddTaxRateModal
        isOpen={isAddTaxOpen}
        onClose={() => setIsAddTaxOpen(false)}
        onSubmit={(data) => {
          addTaxRate(data);
          toast.success(`Successfully added tax rate: ${data.name}`);
        }}
      />
      <IssueRefundModal
        isOpen={isIssueRefundOpen}
        onClose={() => setIsIssueRefundOpen(false)}
        payments={payments}
        onSubmit={(data) => {
          issueRefund(data);
          toast.success(`Successfully refunded $${data.amount} to ${data.tenantName}`);
        }}
      />
    </div>
  );
}
export default BillingLayout;
