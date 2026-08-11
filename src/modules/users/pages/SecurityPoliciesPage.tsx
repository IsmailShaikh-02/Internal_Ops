// src/modules/users/pages/SecurityPoliciesPage.tsx

import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";

export function SecurityPoliciesPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-md">
          <Shield className="h-6 w-6 text-indigo-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Advanced Security & Governance</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Platform password policies, lockout configurations, concurrent session controls, MFA rules, and IP blacklists are now managed from the centralized Security Control Panel.
          </p>
        </div>

        {/* Basic Read-Only Policy Summary indicators */}
        <div className="grid grid-cols-2 gap-3 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>MFA Enforced</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Lockout: 5 Attempts</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Min Length: 12 Chars</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Timeout: 30 Mins</span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={() => navigate("/security/policies")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs py-3 px-6 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            Open Security Policies Panel
            <ArrowRight className="h-4 w-4 text-indigo-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SecurityPoliciesPage;
