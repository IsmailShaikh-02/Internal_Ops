import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { FeatureFlag, Module, RolloutOption } from "../types";
import { validateFeatureNameUnique, validateRolloutPercentage } from "../validation";

interface FeatureFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FeatureFlag, "id" | "lastUpdated">) => void;
  modules: Module[];
  featureFlags: FeatureFlag[];
  editingFlag?: FeatureFlag | null;
}

export function FeatureFlagModal({
  isOpen,
  onClose,
  onSubmit,
  modules,
  featureFlags,
  editingFlag,
}: FeatureFlagModalProps) {
  const [name, setName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [status, setStatus] = useState<FeatureFlag["status"]>("inactive");
  const [rolloutOption, setRolloutOption] = useState<RolloutOption>("everyone");
  const [rolloutPercentage, setRolloutPercentage] = useState(100);
  const [targetPlans, setTargetPlans] = useState<string[]>([]);
  const [targetTenants, setTargetTenants] = useState<string[]>([]);
  const [targetGroups, setTargetGroups] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [releaseVersion, setReleaseVersion] = useState("");
  const [error, setError] = useState("");

  const [tenantInput, setTenantInput] = useState("");
  const [groupInput, setGroupInput] = useState("");

  useEffect(() => {
    if (editingFlag) {
      setName(editingFlag.name);
      setModuleName(editingFlag.moduleName);
      setStatus(editingFlag.status);
      setRolloutOption(editingFlag.rolloutOption);
      setRolloutPercentage(editingFlag.rolloutPercentage);
      setTargetPlans(editingFlag.targetPlans || []);
      setTargetTenants(editingFlag.targetTenants || []);
      setTargetGroups(editingFlag.targetGroups || []);
      setScheduleDate(editingFlag.scheduleDate || "");
      setReleaseVersion(editingFlag.releaseVersion || "");
    } else {
      setName("");
      setModuleName(modules[0]?.name || "");
      setStatus("inactive");
      setRolloutOption("everyone");
      setRolloutPercentage(100);
      setTargetPlans([]);
      setTargetTenants([]);
      setTargetGroups([]);
      setScheduleDate("");
      setReleaseVersion("");
    }
    setTenantInput("");
    setGroupInput("");
    setError("");
  }, [editingFlag, isOpen, modules]);

  if (!isOpen) return null;

  const handlePlanToggle = (plan: string) => {
    setTargetPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const handleAddTenant = () => {
    if (tenantInput.trim() && !targetTenants.includes(tenantInput.trim())) {
      setTargetTenants([...targetTenants, tenantInput.trim()]);
      setTenantInput("");
    }
  };

  const handleRemoveTenant = (tenant: string) => {
    setTargetTenants(targetTenants.filter((t) => t !== tenant));
  };

  const handleAddGroup = () => {
    if (groupInput.trim() && !targetGroups.includes(groupInput.trim())) {
      setTargetGroups([...targetGroups, groupInput.trim()]);
      setGroupInput("");
    }
  };

  const handleRemoveGroup = (group: string) => {
    setTargetGroups(targetGroups.filter((g) => g !== group));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !moduleName) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateFeatureNameUnique(name, moduleName, featureFlags, editingFlag?.id)) {
      setError(`Feature flag name "${name}" is already taken in module "${moduleName}".`);
      return;
    }

    if (rolloutOption === "percentage" && !validateRolloutPercentage(rolloutPercentage)) {
      setError("Rollout percentage must be between 0 and 100.");
      return;
    }

    onSubmit({
      name,
      moduleName,
      status,
      rolloutOption,
      rolloutPercentage: rolloutOption === "percentage" ? rolloutPercentage : rolloutOption === "everyone" ? 100 : 0,
      targetPlans: rolloutOption === "plan" ? targetPlans : [],
      targetTenants: rolloutOption === "tenant" ? targetTenants : [],
      targetGroups: rolloutOption === "group" ? targetGroups : [],
      scheduleDate: scheduleDate || undefined,
      releaseVersion: releaseVersion || undefined,
    });
    onClose();
  };

  const plansList = ["Starter", "Professional", "Business", "Enterprise"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-lg text-slate-800">
            {editingFlag ? "Edit Feature Flag" : "New Feature Flag"}
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
              <label className="text-xs font-bold text-slate-600 block">Feature Flag Name*</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI Resume Screener"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:border-slate-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Module*</label>
              <select
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-hidden focus:border-slate-400 bg-white"
                required
              >
                {modules.map((mod) => (
                  <option key={mod.id} value={mod.name}>
                    {mod.displayName} ({mod.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Current Status</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("active")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                    status === "active"
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("inactive")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                    status === "inactive"
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Rollout Strategy</label>
              <select
                value={rolloutOption}
                onChange={(e) => setRolloutOption(e.target.value as RolloutOption)}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-hidden focus:border-slate-400 bg-white"
              >
                <option value="everyone">Enable for Everyone</option>
                <option value="plan">Enable by Subscription Plan</option>
                <option value="tenant">Enable by Tenant</option>
                <option value="percentage">Enable by Percentage Rollout</option>
                <option value="group">Enable by User Group</option>
              </select>
            </div>
          </div>

          {/* Conditional Strategic Render */}
          {rolloutOption === "percentage" && (
            <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-600">Rollout Percentage</label>
                <span className="text-sm font-bold text-slate-800">{rolloutPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rolloutPercentage}
                onChange={(e) => setRolloutPercentage(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>
          )}

          {rolloutOption === "plan" && (
            <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-xs font-bold text-slate-600 block">Target Plans</label>
              <div className="grid grid-cols-2 gap-2">
                {plansList.map((plan) => (
                  <label
                    key={plan}
                    className="flex items-center gap-2 p-2 bg-white border border-slate-150 rounded-xl cursor-pointer hover:bg-slate-50 transition"
                  >
                    <input
                      type="checkbox"
                      checked={targetPlans.includes(plan)}
                      onChange={() => handlePlanToggle(plan)}
                      className="rounded text-slate-800 focus:ring-0"
                    />
                    <span className="text-xs font-semibold text-slate-700">{plan}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {rolloutOption === "tenant" && (
            <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-xs font-bold text-slate-600 block">Target Tenants</label>
              <div className="flex gap-2">
                <input
                  value={tenantInput}
                  onChange={(e) => setTenantInput(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="flex-1 text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTenant();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddTenant}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold px-3 py-2 cursor-pointer"
                >
                  Add
                </Button>
              </div>
              {targetTenants.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {targetTenants.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg text-[10px] font-bold"
                    >
                      {t}
                      <X
                        className="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        onClick={() => handleRemoveTenant(t)}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {rolloutOption === "group" && (
            <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-xs font-bold text-slate-600 block">Target User Groups</label>
              <div className="flex gap-2">
                <input
                  value={groupInput}
                  onChange={(e) => setGroupInput(e.target.value)}
                  placeholder="e.g. Beta Testers"
                  className="flex-1 text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGroup();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddGroup}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold px-3 py-2 cursor-pointer"
                >
                  Add
                </Button>
              </div>
              {targetGroups.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {targetGroups.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg text-[10px] font-bold"
                    >
                      {g}
                      <X
                        className="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        onClick={() => handleRemoveGroup(g)}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Schedule Activation</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-200 pl-9 pr-3.5 py-2 focus:outline-hidden focus:border-slate-400 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Release Version</label>
              <input
                value={releaseVersion}
                onChange={(e) => setReleaseVersion(e.target.value)}
                placeholder="e.g. v2.6.0"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2 focus:outline-hidden focus:border-slate-400"
              />
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
              {editingFlag ? "Save Flag" : "Create Flag"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
