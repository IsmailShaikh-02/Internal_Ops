import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { TenantOverride, FeatureFlag } from "../types";

interface TenantOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<TenantOverride, "id">) => void;
  featureFlags: FeatureFlag[];
  editingOverride?: TenantOverride | null;
}

export function TenantOverrideModal({
  isOpen,
  onClose,
  onSubmit,
  featureFlags,
  editingOverride,
}: TenantOverrideModalProps) {
  const [tenantName, setTenantName] = useState("");
  const [currentPlan, setCurrentPlan] = useState("Starter");
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
  const [disabledFeatures, setDisabledFeatures] = useState<string[]>([]);
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState<TenantOverride["status"]>("active");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingOverride) {
      setTenantName(editingOverride.tenantName);
      setCurrentPlan(editingOverride.currentPlan);
      setEnabledFeatures(editingOverride.enabledFeatures || []);
      setDisabledFeatures(editingOverride.disabledFeatures || []);
      setExpiryDate(editingOverride.expiryDate || "");
      setStatus(editingOverride.status);
    } else {
      setTenantName("");
      setCurrentPlan("Starter");
      setEnabledFeatures([]);
      setDisabledFeatures([]);
      setExpiryDate("");
      setStatus("active");
    }
    setError("");
  }, [editingOverride, isOpen]);

  if (!isOpen) return null;

  const handleToggleEnabled = (name: string) => {
    if (disabledFeatures.includes(name)) {
      setDisabledFeatures(disabledFeatures.filter((f) => f !== name));
    }
    setEnabledFeatures((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const handleToggleDisabled = (name: string) => {
    if (enabledFeatures.includes(name)) {
      setEnabledFeatures(enabledFeatures.filter((f) => f !== name));
    }
    setDisabledFeatures((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim()) {
      setError("Tenant Name is required.");
      return;
    }

    onSubmit({
      tenantName: tenantName.trim(),
      currentPlan,
      enabledFeatures,
      disabledFeatures,
      expiryDate: expiryDate || undefined,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-lg text-slate-800">
            {editingOverride ? "Edit Tenant Override" : "Add Tenant Override"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs font-semibold border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Tenant Name*</label>
              <input
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:border-slate-400"
                required
                disabled={!!editingOverride}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Current Plan*</label>
              <select
                value={currentPlan}
                onChange={(e) => setCurrentPlan(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-hidden focus:border-slate-400 bg-white"
                required
              >
                <option value="Starter">Starter</option>
                <option value="Professional">Professional</option>
                <option value="Business">Business</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Expiry Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-200 pl-9 pr-3.5 py-2 focus:outline-hidden focus:border-slate-400 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TenantOverride["status"])}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-hidden focus:border-slate-400 bg-white"
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Feature Matrix Selector */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Feature Override Settings</h4>
            <div className="border border-slate-100 rounded-2xl divide-y divide-slate-100 overflow-hidden max-h-60 overflow-y-auto bg-slate-50">
              {featureFlags.map((flag) => {
                const isEnabled = enabledFeatures.includes(flag.name);
                const isDisabled = disabledFeatures.includes(flag.name);

                return (
                  <div key={flag.id} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50/50">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{flag.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">Module: {flag.moduleName}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleEnabled(flag.name)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                          isEnabled
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Force Enable
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleDisabled(flag.name)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                          isDisabled
                            ? "bg-rose-600 border-rose-600 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Force Disable
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl px-4 py-2 font-semibold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 font-semibold text-xs cursor-pointer"
            >
              {editingOverride ? "Save Override" : "Add Override"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
