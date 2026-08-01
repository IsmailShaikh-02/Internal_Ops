import React from "react";
import { Switch } from "@/shared/components/ui/Switch";
import { useTenantStore } from "../data/tenantStore";
import { type Tenant } from "../data/mockTenants";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { 
  Users, 
  Coins, 
  Target, 
  FolderGit2, 
  FileText, 
  BarChart3, 
  Boxes
} from "lucide-react";

interface ModulesTabProps {
  tenant: Tenant;
}

const moduleMetaData: Record<string, { desc: string; icon: React.ReactNode; category: string }> = {
  HR: { desc: "Employee directory, payroll, leaves and onboarding flows.", icon: <Users className="h-5 w-5 text-indigo-600" />, category: "Core Operations" },
  Finance: { desc: "Ledgers, invoicing, accounts payable, receivable and budgets.", icon: <Coins className="h-5 w-5 text-emerald-600" />, category: "Financials" },
  CRM: { desc: "Lead tracking, contacts, customer pipeline and sales pipelines.", icon: <Target className="h-5 w-5 text-amber-600" />, category: "Sales & Marketing" },
  Inventory: { desc: "Stock levels, warehouses, orders tracking and supply chain.", icon: <Boxes className="h-5 w-5 text-blue-600" />, category: "Logistics" },
  Projects: { desc: "Task tracking, Gantt charts, sprint cycles and time logging.", icon: <FolderGit2 className="h-5 w-5 text-purple-600" />, category: "Core Operations" },
  Docs: { desc: "Collaborative text editor, shared knowledge base and file storage.", icon: <FileText className="h-5 w-5 text-sky-600" />, category: "Information" },
  Analytics: { desc: "Realtime data visualizer, custom report generation and BI tools.", icon: <BarChart3 className="h-5 w-5 text-rose-600" />, category: "Intelligence" },
};

export default function ModulesTab({ tenant }: ModulesTabProps) {
  const { updateTenantModules } = useTenantStore();

  const handleToggleModule = (key: string) => {
    const updatedModules = {
      ...tenant.modules,
      [key]: !tenant.modules[key as keyof typeof tenant.modules],
    };
    updateTenantModules(tenant.id, updatedModules);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Platform Modules</h3>
        <p className="text-xs text-slate-500 mt-0.5">Toggle and configure product features available for this tenant.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(tenant.modules).map(([key, isEnabled]) => {
          const meta = moduleMetaData[key] || {
            desc: "Additional platform feature module.",
            icon: <Boxes className="h-5 w-5 text-slate-600" />,
            category: "General",
          };
          return (
            <div 
              key={key} 
              className={`border border-slate-200 bg-white rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all duration-200 ${
                isEnabled ? "ring-1 ring-slate-800 border-slate-800" : "hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                    {meta.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{key}</h4>
                      <StatusBadge variant={isEnabled ? "success" : "neutral"} className="text-[10px] py-0 px-2 font-semibold">
                        {isEnabled ? "Enabled" : "Disabled"}
                      </StatusBadge>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{meta.category}</span>
                  </div>
                </div>
                <Switch 
                  checked={isEnabled} 
                  onCheckedChange={() => handleToggleModule(key)} 
                />
              </div>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">{meta.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
