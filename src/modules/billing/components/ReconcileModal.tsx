import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "@/shared/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

interface ReconcileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
}

export function ReconcileModal({ isOpen, onClose, onConfirm }: ReconcileModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleReconcile = async () => {
    setStatus("loading");
    try {
      await onConfirm();
      setStatus("success");
    } catch {
      setStatus("idle");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reconcile Billing System">
      <div className="text-center py-4">
        {status === "idle" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to trigger a manual reconciliation check with the payment gateway (Stripe Live)?
            </p>
            <p className="text-xs text-amber-600 bg-amber-50 rounded-xl p-3 border border-amber-100 font-semibold">
              This will verify all pending/failed webhooks, resolve past-due subscriptions, and sync invoice transaction logs.
            </p>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" className="rounded-xl cursor-pointer" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer" onClick={handleReconcile}>
                Start Sync
              </Button>
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <div>
              <p className="text-sm font-bold text-slate-800">Syncing with Stripe...</p>
              <p className="text-xs text-slate-500 mt-1">Verifying subscription states, failed payments & tax calculations.</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 flex flex-col items-center py-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">Reconciliation Complete</p>
              <p className="text-xs text-slate-500">
                All subscriptions, invoices, and payments have been successfully verified and synchronized.
              </p>
            </div>
            <div className="w-full flex justify-center pt-4 border-t border-slate-100">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 cursor-pointer" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
