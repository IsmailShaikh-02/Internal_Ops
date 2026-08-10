// src/shared/components/layout/ActivityAttentionSheet.tsx
import { useEffect } from "react";
import {
  X,
  AlertTriangle,
  History,
  FileEdit,
  ArrowRight,
  TrendingUp
} from "lucide-react";

interface ActivityAttentionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export function ActivityAttentionSheet({
  isOpen,
  onClose,
  onNavigate,
}: ActivityAttentionSheetProps) {
  useEffect(() => {
    if (isOpen) {
      // Force suppression/dismissal of mobile keyboard by blurring any active input element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mockRedZoneAlerts = [
    { id: "a1", msg: "SLA Breach detected for Stark Industries", type: "SLA breach" },
    { id: "a2", msg: "Invoice INV-2026-001 overdue by $15,400.00", type: "Finance" },
    { id: "a3", msg: "VM cluster ops-prod-01 spiked to 94.2% CPU", type: "Infrastructure" },
  ];

  const mockRecentSubmodules = [
    { name: "Billing Plans", path: "/billing/plans" },
    { name: "Support Tickets", path: "/support/tickets" },
    { name: "Feature Flags", path: "/features/flags" },
  ];

  const mockDrafts = [
    { title: "Create Tenant Wizard", step: "Step 3 of 6", path: "/tenants/create" },
    { title: "Knowledge Base Article Draft", step: "Pending publish", path: "/support/knowledge" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/65 backdrop-blur-sm animate-fade-in">
      {/* Background overlay click-off handler */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Slide-Up Bottom Drawer Sheet */}
      <div className="relative mt-auto w-full max-h-[85vh] bg-slate-100 border-t border-slate-300 rounded-t-3xl shadow-2xl flex flex-col z-10 p-6 pb-safe animate-slide-up">
        
        {/* Pull Handle Visual Element */}
        <div className="w-12 h-1.5 bg-slate-850 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Activity & Attention Hub
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 transition cursor-pointer"
            aria-label="Close Bottom Sheet"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          
          {/* Section 1: Red Zone Alerts */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-rose-800 animate-pulse" />
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-widest">
                🚨 Red Zone Alerts
              </h4>
            </div>
            <div className="space-y-2">
              {mockRedZoneAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-rose-500/50 border border-rose-700 text-rose-900"
                >
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold">{alert.msg}</span>
                    <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wide mt-0.5">
                      {alert.type}
                    </span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-rose-950 animate-ping shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Recently Visited Submodules */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest">
                🕒 Recently Visited Submodules
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {mockRecentSubmodules.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(sub.path);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-primary border border-slate-850 hover:border-slate-700 transition text-left cursor-pointer active:scale-98"
                >
                  <span className="text-xs font-bold text-slate-200">{sub.name}</span>
                  <ArrowRight className="h-3 w-3 text-slate-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Draft Workflows */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileEdit className="h-4 w-4 text-amber-500" />
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest">
                Draft Workflows
              </h4>
            </div>
            <div className="space-y-2">
              {mockDrafts.map((draft, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(draft.path);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between p-3 rounded-xl bg-primary border border-slate-850 hover:border-slate-700 transition text-left cursor-pointer active:scale-98"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-100">{draft.title}</span>
                    <span className="text-[10px] text-amber-400 font-bold uppercase mt-0.5">
                      {draft.step}
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-950/30 border border-amber-900/40 text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Resume
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
