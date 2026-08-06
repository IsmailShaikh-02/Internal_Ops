import { useState } from "react";
import { useFeatureStore } from "../hooks/useFeatureState";
import { PlanPreviewModal } from "../components/PlanPreviewModal";
import { Button } from "@/shared/components/ui/button";
import { Check, X, Copy, Eye, Settings } from "lucide-react";
import { toast } from "sonner";
import type { PlanFeatureMapping } from "../types";

export function PlanFeatureMappingPage() {
  const { planMappings, modules, featureFlags, updatePlanMapping, copyPlanMapping } = useFeatureStore();
  const [selectedPlan, setSelectedPlan] = useState<PlanFeatureMapping["planName"]>("Starter");
  const [previewMapping, setPreviewMapping] = useState<PlanFeatureMapping | null>(null);

  const activeMapping = planMappings.find((pm) => pm.planName === selectedPlan) || planMappings[0];

  // Forms edit state for resources
  const [isEditingLimits, setIsEditingLimits] = useState(false);
  const [aiCreditsInput, setAiCreditsInput] = useState(activeMapping.aiCredits);
  const [storageInput, setStorageInput] = useState(activeMapping.storage);
  const [userLimitsInput, setUserLimitsInput] = useState(activeMapping.userLimits);

  // Copy mapping state
  const [copySource, setCopySource] = useState<PlanFeatureMapping["planName"]>("Starter");

  const startLimitEdit = () => {
    setAiCreditsInput(activeMapping.aiCredits);
    setStorageInput(activeMapping.storage);
    setUserLimitsInput(activeMapping.userLimits);
    setIsEditingLimits(true);
  };

  const handleSaveLimits = () => {
    updatePlanMapping(selectedPlan, {
      aiCredits: Number(aiCreditsInput),
      storage: Number(storageInput),
      userLimits: Number(userLimitsInput),
    });
    setIsEditingLimits(false);
    toast.success(`Successfully updated resource limits for ${selectedPlan} plan.`);
  };

  const handleToggleModule = (moduleName: string) => {
    const isEnabled = activeMapping.enabledModules.includes(moduleName);
    const newModules = isEnabled
      ? activeMapping.enabledModules.filter((m) => m !== moduleName)
      : [...activeMapping.enabledModules, moduleName];

    updatePlanMapping(selectedPlan, { enabledModules: newModules });
    toast.success(`${moduleName} module is now ${isEnabled ? "disabled" : "enabled"} for ${selectedPlan}.`);
  };

  const handleToggleFeature = (featureName: string) => {
    const isEnabled = activeMapping.enabledFeatures.includes(featureName);
    const newFeatures = isEnabled
      ? activeMapping.enabledFeatures.filter((f) => f !== featureName)
      : [...activeMapping.enabledFeatures, featureName];

    updatePlanMapping(selectedPlan, { enabledFeatures: newFeatures });
    toast.success(`${featureName} feature is now ${isEnabled ? "disabled" : "enabled"} for ${selectedPlan}.`);
  };

  const handleCopy = () => {
    if (copySource === selectedPlan) {
      toast.error("Source and target plans cannot be the same.");
      return;
    }
    copyPlanMapping(copySource, selectedPlan);
    toast.success(`Copied configuration from ${copySource} to ${selectedPlan}.`);
  };

  const plansList: PlanFeatureMapping["planName"][] = ["Starter", "Professional", "Business", "Enterprise"];

  return (
    <div className="space-y-6">
      {/* Plan selection buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex gap-2">
          {plansList.map((plan) => (
            <button
              key={plan}
              onClick={() => {
                setSelectedPlan(plan);
                setIsEditingLimits(false);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                selectedPlan === plan
                  ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {plan} Plan
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMapping(activeMapping)}
            className="rounded-xl flex items-center gap-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            Preview Customer View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Limits Editor */}
        <div className="bg-white rounded-2xl border border-slate-150 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-slate-500" />
              Resource &amp; Quotas
            </h4>
            {!isEditingLimits ? (
              <Button
                variant="outline"
                size="sm"
                onClick={startLimitEdit}
                className="p-1 px-2.5 rounded-lg border-slate-250 hover:bg-slate-100 text-slate-700 font-bold text-[10px] cursor-pointer"
              >
                Edit Quotas
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={handleSaveLimits}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingLimits(false)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">AI CREDITS</label>
              {isEditingLimits ? (
                <input
                  type="number"
                  value={aiCreditsInput}
                  onChange={(e) => setAiCreditsInput(Number(e.target.value))}
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white"
                />
              ) : (
                <div className="text-lg font-extrabold text-slate-800">
                  {activeMapping.aiCredits.toLocaleString()}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">STORAGE LIMIT (GB)</label>
              {isEditingLimits ? (
                <input
                  type="number"
                  value={storageInput}
                  onChange={(e) => setStorageInput(Number(e.target.value))}
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white"
                />
              ) : (
                <div className="text-lg font-extrabold text-slate-800">{activeMapping.storage} GB</div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">USER SEATS LIMIT</label>
              {isEditingLimits ? (
                <input
                  type="number"
                  value={userLimitsInput}
                  onChange={(e) => setUserLimitsInput(Number(e.target.value))}
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white"
                />
              ) : (
                <div className="text-lg font-extrabold text-slate-800">
                  {activeMapping.userLimits === 9999 ? "Unlimited" : activeMapping.userLimits}
                </div>
              )}
            </div>
          </div>

          {/* Copy mapping feature */}
          <div className="border-t border-slate-200 pt-4 mt-2 space-y-3">
            <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Copy className="h-3.5 w-3.5" />
              Sync Mapping
            </h5>
            <div className="flex flex-col gap-2">
              <select
                value={copySource}
                onChange={(e) => setCopySource(e.target.value as PlanFeatureMapping["planName"])}
                className="flex-1 text-xs font-bold rounded-lg border border-slate-200 bg-white px-1 py-1 cursor-pointer"
              >
                {plansList.map((p) => (
                  <option key={p} value={p}>
                    From {p}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="rounded-lg text-xs font-bold cursor-pointer"
              >
                Copy to {selectedPlan}
              </Button>
            </div>
          </div>
        </div>

        {/* Enabled Modules Checker */}
        <div className="bg-primary rounded-2xl border border-slate-200 p-5 space-y-3">
          <h4 className="text-sm font-bold text-white border-b border-slate-100 pb-2">
            Modules Access Config
          </h4>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {modules
              .filter((m) => m.status !== "archived")
              .map((mod) => {
                const isChecked = activeMapping.enabledModules.includes(mod.name);
                return (
                  <label
                    key={mod.id}
                    onClick={() => handleToggleModule(mod.name)}
                    className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition ${
                      isChecked ? "border-slate-350 bg-white" : "border-slate-150 bg-slate-300"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{mod.displayName}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{mod.category}</div>
                    </div>
                    {isChecked ? (
                      <span className="p-1 rounded-full bg-emerald-200 text-emerald-700">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-full bg-red-200 text-red-700">
                        <X className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </label>
                );
              })}
          </div>
        </div>

        {/* Enabled Features Checker */}
        <div className="bg-primary rounded-2xl border border-slate-200 p-5 space-y-3">
          <h4 className="text-sm font-bold text-white border-b border-slate-100 pb-2">
            Features Access Config
          </h4>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {featureFlags.map((flag) => {
              const isChecked = activeMapping.enabledFeatures.includes(flag.name);
              return (
                <label
                  key={flag.id}
                  onClick={() => handleToggleFeature(flag.name)}
                  className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition ${
                      isChecked ? "border-slate-350 bg-white" : "border-slate-150 bg-slate-300"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800">{flag.name}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">Module: {flag.moduleName}</div>
                  </div>
                  {isChecked ? (
                    <span className="p-1 rounded-full bg-emerald-200 text-emerald-700">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-full bg-red-200 text-red-700">
                      <X className="h-3.5 w-3.5" />
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <PlanPreviewModal
        isOpen={!!previewMapping}
        onClose={() => setPreviewMapping(null)}
        mapping={previewMapping}
      />
    </div>
  );
}
export default PlanFeatureMappingPage;
