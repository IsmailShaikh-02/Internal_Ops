import { useState } from "react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { StatCard } from "@/shared/components/ui/StatCard";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { mockActivities } from "../data/mockActivityAudit";
import { type TenantActivity } from "../types";
import { 
  Activity, 
  CheckCircle2, 
  ShieldAlert, 
  UserCheck, 
  ChevronDown, 
  RefreshCw 
} from "lucide-react";

export default function ActivityPage() {
  const [activities, setActivities] = useState<TenantActivity[]>(mockActivities);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleRefresh = () => {
    // Simulate refreshing data
    setActivities([...mockActivities]);
  };

  // KPI Calculations
  const totalLogs = activities.length;
  const successLogs = activities.filter((a) => a.status === "Success").length;
  const successRate = totalLogs > 0 ? Math.round((successLogs / totalLogs) * 100) : 0;
  const securityLogs = activities.filter((a) => a.category === "Security").length;
  const uniqueActors = new Set(activities.map((a) => a.actor.email)).size;

  // Filter logs
  const filteredActivities = activities.filter((a) => {
    const matchesCategory = categoryFilter === "All" || a.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const columns = [
    {
      key: "timestamp",
      header: "Time",
      render: (row: TenantActivity) => {
        const date = new Date(row.timestamp);
        return (
          <div className="text-xs text-slate-500 whitespace-nowrap">
            <span className="font-semibold text-slate-700 block">
              {date.toLocaleDateString()}
            </span>
            <span>{date.toLocaleTimeString()}</span>
          </div>
        );
      },
    },
    {
      key: "tenantName",
      header: "Tenant",
      render: (row: TenantActivity) => (
        <span className="font-semibold text-slate-800">{row.tenantName}</span>
      ),
    },
    {
      key: "actor",
      header: "Actor",
      render: (row: TenantActivity) => {
        const initials = row.actor.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
              {initials}
            </div>
            <div className="truncate max-w-[150px]">
              <div className="font-semibold text-slate-900 leading-none">{row.actor.name}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{row.actor.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "action",
      header: "Action",
      render: (row: TenantActivity) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-800">{row.action}</span>
          <span className="text-xs text-slate-400 font-medium">{row.category}</span>
        </div>
      ),
    },
    {
      key: "details",
      header: "Details",
      className: "text-slate-600 text-xs max-w-xs truncate",
      render: (row: TenantActivity) => (
        <span title={row.details}>{row.details}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: TenantActivity) => {
        const variant =
          row.status === "Success"
            ? "success"
            : row.status === "Failed"
            ? "critical"
            : row.status === "Warning"
            ? "warning"
            : "info";
        return (
          <StatusBadge variant={variant} className="gap-1 px-2 py-0.5">
            <span
              className={`h-1 w-1 rounded-full ${
                row.status === "Success"
                  ? "bg-green-500"
                  : row.status === "Failed"
                  ? "bg-red-500"
                  : row.status === "Warning"
                  ? "bg-amber-500"
                  : "bg-blue-500"
              }`}
            />
            {row.status}
          </StatusBadge>
        );
      },
    },
  ];

  return (
    <div className="max-w-full mx-auto flex flex-col gap-6 p-1">
      <PageHeader
        breadcrumb={[
          { label: "Platform" },
          { label: "Tenant Management" },
          { label: "Activity" }
        ]}
        title="Activity Log"
        description="Real-time stream of activities and modifications across all tenant organizations."
        actions={
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        }
      />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Activities"
          value={totalLogs}
          subtitle="Real-time log events"
          icon={<Activity className="h-4 w-4 text-slate-500" />}
          className="border-slate-200 shadow-xs"
        />
        <StatCard
          title="Success Rate"
          value={`${successRate}%`}
          trend={{ value: "+1.2%", direction: "up" }}
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          className="border-slate-200 shadow-xs"
        />
        <StatCard
          title="Security Events"
          value={securityLogs}
          subtitle="Requires attention"
          icon={<ShieldAlert className="h-4 w-4 text-amber-600" />}
          className="border-slate-200 shadow-xs"
        />
        <StatCard
          title="Active Actors"
          value={uniqueActors}
          subtitle="Unique staff emails"
          icon={<UserCheck className="h-4 w-4 text-blue-600" />}
          className="border-slate-200 shadow-xs"
        />
      </div>

      {/* Logs Table Container */}
      <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <DataTable
            data={filteredActivities}
            columns={columns}
            rowKey={(row) => row.id}
            searchable
            searchPlaceholder="Search by action, tenant, details..."
            searchFields={["action", "tenantName", "details"]}
            selectable={false}
            pageSize={8}
            showColumnsButton={true}
            showExportButton={true}
            toolbarActions={
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer font-medium text-slate-700"
                  >
                    <option value="All">All categories</option>
                    <option value="User Management">User Management</option>
                    <option value="Billing">Billing</option>
                    <option value="Configuration">Configuration</option>
                    <option value="Security">Security</option>
                    <option value="System">System</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 pointer-events-none text-slate-400" />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer font-medium text-slate-700"
                  >
                    <option value="All">All statuses</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                    <option value="Warning">Warning</option>
                    <option value="Pending">Pending</option>
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
