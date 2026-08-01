import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/shared/components/ui/StatCard";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { useTenantStore } from "../data/tenantStore";
import { Building2, CheckCircle2, Clock, AlertTriangle, ChevronDown } from "lucide-react";
import { type Tenant } from "../data/mockTenants";

export default function AllTenantsPage() {
  const navigate = useNavigate();
  const { tenants } = useTenantStore();
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");

  // Calculate statistics dynamically
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === "Active").length;
  const trialTenants = tenants.filter((t) => t.status === "Trial").length;
  const suspendedTenants = tenants.filter((t) => t.status === "Suspended").length;

  // Filter tenants
  const filteredTenants = tenants.filter((t) => {
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesPlan = planFilter === "All" || t.plan === planFilter;
    return matchesStatus && matchesPlan;
  });

  const columns = [
    {
      key: "name",
      header: "Tenant",
      render: (row: Tenant) => {
        const initials = row.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();
        return (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/tenants/${row.id}`)}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700 text-sm">
              {initials}
            </div>
            <div>
              <div className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                {row.name}
              </div>
              <div className="text-xs text-slate-500">{row.domain}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "plan",
      header: "Plan",
      render: (row: Tenant) => <span className="text-slate-700 font-medium">{row.plan}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row: Tenant) => {
        const variant =
          row.status === "Active"
            ? "success"
            : row.status === "Trial"
            ? "info"
            : "critical";
        return (
          <StatusBadge variant={variant} className="gap-1.5 font-medium">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                row.status === "Active"
                  ? "bg-green-500"
                  : row.status === "Trial"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            />
            {row.status}
          </StatusBadge>
        );
      },
    },
    {
      key: "users",
      header: "Users",
      className: "text-slate-700 font-medium",
      render: (row: Tenant) => <span>{row.users.toLocaleString()}</span>,
    },
    {
      key: "mrr",
      header: "MRR",
      className: "text-slate-700 font-medium",
      render: (row: Tenant) => <span>${row.mrr.toLocaleString()}</span>,
    },
    {
      key: "storageUsed",
      header: "Storage",
      render: (row: Tenant) => {
        const percentage = Math.min(100, (row.storageUsed / row.storageLimit) * 100);
        return (
          <div className="w-32 sm:min-w-[140px]">
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>{row.storageUsed} GB</span>
              <span className="text-slate-400">{row.storageLimit} GB</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-800 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 overflow-x-hidden">
      

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total tenants"
          value={totalTenants}
          subtitle="All statuses"
          icon={<Building2 className="h-4 w-4 text-slate-500" />}
          className="border-slate-200 shadow-xs"
        />
        <StatCard
          title="Active"
          value={activeTenants}
          trend={{ value: "+6", direction: "up" }}
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          className="border-slate-200 shadow-xs"
        />
        <StatCard
          title="Trial"
          value={trialTenants}
          trend={{ value: "+2", direction: "up" }}
          icon={<Clock className="h-4 w-4 text-blue-600" />}
          className="border-slate-200 shadow-xs"
        />
        <StatCard
          title="Suspended"
          value={suspendedTenants}
          icon={<AlertTriangle className="h-4 w-4 text-red-600" />}
          className="border-slate-200 shadow-xs"
        />
      </div>

      {/* Data Table Container with Horizontal Scroll Wrapper */}
      <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <DataTable
            data={filteredTenants}
            columns={columns}
            rowKey={(row) => row.id}
            searchable
            searchPlaceholder="Search by name, domain, owner..."
            searchFields={["name", "domain"]}
            selectable
            pageSize={8}
            showColumnsButton={true}
            showExportButton={true}
            toolbarActions={
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer font-medium text-slate-700"
                  >
                    <option value="All">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Trial">Trial</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 pointer-events-none text-slate-400" />
                </div>

                <div className="relative">
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer font-medium text-slate-700"
                  >
                    <option value="All">All plans</option>
                    <option value="Growth">Growth</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 pointer-events-none text-slate-400" />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}