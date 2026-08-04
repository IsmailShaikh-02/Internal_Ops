import { X, Check, ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { PlanFeatureMapping } from "../types";

interface PlanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapping: PlanFeatureMapping | null;
}

export function PlanPreviewModal({ isOpen, onClose, mapping }: PlanPreviewModalProps) {
  if (!isOpen || !mapping) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Plan Simulation Preview</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Simulating active capabilities for {mapping.planName} tier
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Card representation */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  CURRENT TIER
                </span>
                <h4 className="text-xl font-extrabold tracking-tight mt-0.5">{mapping.planName} Plan</h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                ACTIVE
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
              <div>
                <div className="text-[10px] text-slate-400 font-bold">AI CREDITS</div>
                <div className="text-sm font-extrabold mt-0.5">
                  {mapping.aiCredits.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold">STORAGE</div>
                <div className="text-sm font-extrabold mt-0.5">{mapping.storage} GB</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold">USER SEATS</div>
                <div className="text-sm font-extrabold mt-0.5">
                  {mapping.userLimits === 9999 ? "Unlimited" : mapping.userLimits}
                </div>
              </div>
            </div>
          </div>

          {/* Enabled Modules */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Enabled Modules</h5>
            {mapping.enabledModules.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {mapping.enabledModules.map((modName) => (
                  <div
                    key={modName}
                    className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl"
                  >
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">{modName}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-xl text-xs font-semibold border border-amber-100">
                <ShieldAlert className="h-4 w-4" />
                No modules enabled for this plan.
              </div>
            )}
          </div>

          {/* Enabled Features */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Enabled Features</h5>
            {mapping.enabledFeatures.length > 0 ? (
              <div className="space-y-1.5">
                {mapping.enabledFeatures.map((featName) => (
                  <div key={featName} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full shrink-0" />
                    {featName}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">No advanced features enabled.</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-slate-100 bg-slate-50">
          <Button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 cursor-pointer"
          >
            Done Previewing
          </Button>
        </div>
      </div>
    </div>
  );
}
