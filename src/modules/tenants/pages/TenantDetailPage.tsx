import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Switch } from "@/shared/components/ui/Switch";
import { useTenantStore } from "../data/tenantStore";
import {
  ArrowLeft,
  DollarSign,
  Users,
  Database,
  Globe,
  ArrowUpRight,
  User,
  KeyRound,
  UserCog,
} from "lucide-react";
import BillingDetails from "../components/BillingDetails";
import UsersTab from "../components/UsersTab";
import ModulesTab from "../components/ModulesTab";
import StorageTab from "../components/StorageTab";
import BrandingTab from "../components/BrandingTab";
import ActivityTab from "../components/ActivityTab";
import AuditTab from "../components/AuditTab";
import TimelineTab from "../components/TimelineTab";

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tenants, updateTenant, updateTenantModules } = useTenantStore();

  const tenant = tenants.find((t) => t.id === id);

  const [activeTab, setActiveTab] = useState("Overview");

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Tenant not found</h2>
        <p className="text-slate-500 mb-4">The tenant with ID "{id}" could not be located.</p>
        <Button onClick={() => navigate("/tenants")}>Back to Tenants</Button>
      </div>
    );
  }

  const handleToggleModule = (moduleKey: keyof typeof tenant.modules) => {
    const updatedModules = {
      ...tenant.modules,
      [moduleKey]: !tenant.modules[moduleKey],
    };
    updateTenantModules(tenant.id, updatedModules);
  };

  const handleToggleSuspend = () => {
    const newStatus = tenant.status === "Suspended" ? "Active" : "Suspended";
    updateTenant(tenant.id, { status: newStatus });
  };

  const tabs = [
    { name: "Overview" },
    { name: "Subscription" },
    { name: "Users", count: tenant.users },
    { name: "Modules" },
    { name: "Storage" },
    { name: "Branding" },
    { name: "Activity" },
    { name: "Audit" },
    { name: "Timeline" },
  ];

  return (
    <div className="max-w mx-auto flex flex-col gap-6 p-1">
      {/* Top Breadcrumb & Metadata Line */}
      <div>
        <nav className="flex item s-center text-sm text-slate-500 mb-3">
          <span>Platform</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="hover:text-slate-800 cursor-pointer" onClick={() => navigate("/tenants")}>
            Tenants
          </span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-800 font-medium">{tenant.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{tenant.name}</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/tenants")}
                  className="h-7 text-xs border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Impersonate
                </Button>
                <Button
                  variant={tenant.status === "Suspended" ? "default" : "destructive"}
                  size="sm"
                  onClick={handleToggleSuspend}
                  className={`h-7 text-xs font-semibold ${
                    tenant.status === "Suspended"
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : "bg-red-600 hover:bg-red-500 text-white"
                  }`}
                >
                  {tenant.status === "Suspended" ? "Activate" : "Suspend"}
                </Button>
              </div>
            </div>
            <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <span>{tenant.domain}</span>
              <span>•</span>
              <span>{tenant.region}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <StatusBadge
                variant={
                  tenant.status === "Active"
                    ? "success"
                    : tenant.status === "Trial"
                    ? "info"
                    : "critical"
                }
                className="font-medium"
              >
                {tenant.status}
              </StatusBadge>
              <StatusBadge variant="neutral" className="bg-slate-50 border-slate-200 text-slate-700 font-medium">
                {tenant.plan} plan
              </StatusBadge>
              <StatusBadge variant="neutral" className="bg-slate-50 border-slate-200 text-slate-700 font-medium">
                {tenant.users} users
              </StatusBadge>
              <StatusBadge variant="neutral" className="bg-slate-50 border-slate-200 text-slate-700 font-medium">
                Created {tenant.createdDate}
              </StatusBadge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex space-x-8 mb-px min-w-max ">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`py-3.5 border-b-2 font-semibold text-sm transition-all duration-150 whitespace-nowrap cursor-pointer focus:outline-none ${
                  isActive
                    ? "border-slate-800 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.name}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs font-semibold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Contents */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="MRR"
              value={`$${tenant.mrr.toLocaleString()}`}
              icon={<DollarSign className="h-4 w-4 text-slate-500" />}
              className="border-slate-200 shadow-xs"
            />
            <StatCard
              title="Active users"
              value={tenant.users.toLocaleString()}
              icon={<Users className="h-4 w-4 text-slate-500" />}
              className="border-slate-200 shadow-xs"
            />
            <StatCard
              title="Storage"
              value={`${tenant.storageUsed} / ${tenant.storageLimit} GB`}
              icon={<Database className="h-4 w-4 text-slate-500" />}
              className="border-slate-200 shadow-xs"
            />
            <StatCard
              title="Region"
              value={tenant.region}
              icon={<Globe className="h-4 w-4 text-slate-500" />}
              className="border-slate-200 shadow-xs"
            />
          </div>

          {/* Module Toggles & Owner Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Modules Enabled */}
            <div className="lg:col-span-7 border border-slate-200 bg-white rounded-xl p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-5">Modules enabled</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(tenant.modules).map(([key, isEnabled]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition"
                  >
                    <span className="text-sm font-semibold text-slate-700">{key}</span>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => handleToggleModule(key as keyof typeof tenant.modules)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Section */}
            <div className="lg:col-span-5 border border-slate-200 bg-white rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4">Owner</h3>
                <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{tenant.owner.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{tenant.owner.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left border-slate-200 text-slate-700 font-semibold"
                >
                  <ArrowUpRight className="h-4 w-4 mr-2 text-slate-400" />
                  Impersonate owner
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left border-slate-200 text-slate-700 font-semibold"
                >
                  <KeyRound className="h-4 w-4 mr-2 text-slate-400" />
                  Send password reset
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left border-slate-200 text-slate-700 font-semibold"
                >
                  <UserCog className="h-4 w-4 mr-2 text-slate-400" />
                  Change owner
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === "Subscription" && <BillingDetails tenant={tenant} />}
      {activeTab === "Users" && <UsersTab tenant={tenant} />}
      {activeTab === "Modules" && <ModulesTab tenant={tenant} />}
      {activeTab === "Storage" && <StorageTab tenant={tenant} />}
      {activeTab === "Branding" && <BrandingTab tenant={tenant} />}
      {activeTab === "Activity" && <ActivityTab tenant={tenant} />}
      {activeTab === "Audit" && <AuditTab tenant={tenant} />}
      {activeTab === "Timeline" && <TimelineTab tenant={tenant} />}
    </div>
  );
}
