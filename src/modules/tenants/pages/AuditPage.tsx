import { useState } from "react";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { StatCard } from "@/shared/components/ui/StatCard";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { mockAuditLogs } from "../data/mockActivityAudit";
import { type TenantAuditLog } from "../types";
import { 
  ShieldAlert, 
  UserCheck, 
  Terminal, 
  AlertTriangle,
  ChevronDown, 
  RefreshCw 
} from "lucide-react";

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<TenantAuditLog[]>(mockAuditLogs);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  const handleRefresh = () => {
    setAuditLogs([...mockAuditLogs]);
  };

  // KPI Calculations
  const totalAudits = auditLogs.length;
  const criticalAudits = auditLogs.filter((a) => a.severity === "Critical").length;
  const highOrCriticalAudits = auditLogs.filter((a) => a.severity === "High" || a.severity === "Critical").length;
  const uniqueOperators = new Set(auditLogs.map((a) => a.actorEmail)).size;

  // Filter logs
  const filteredAudits = auditLogs.filter((a) => {
    const matchesCategory = categoryFilter === "All" || a.category === categoryFilter;
    const matchesSeverity = severityFilter === "All" || a.severity === severityFilter;
    return matchesCategory && matchesSeverity;
  });

  const columns = [
    {
      key: "timestamp",
      header: "Timestamp",
      render: (row: TenantAuditLog) => {
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
      render: (row: TenantAuditLog) => (
        <span className="font-semibold text-slate-800">{row.tenantName}</span>
      ),
    },
    {
      key: "event",
      header: "Event / Operation",
      render: (row: TenantAuditLog) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-800">{row.event}</span>
          <span className="text-xs text-slate-400 font-medium">{row.category}</span>
        </div>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      render: (row: TenantAuditLog) => {
        let variant: "success" | "warning" | "critical" | "info" | "neutral" = "info";
        let dotColor = "bg-blue-500";

        if (row.severity === "Critical") {
          variant = "critical";
          dotColor = "bg-red-600 animate-pulse";
        } else if (row.severity === "High") {
          variant = "critical";
          dotColor = "bg-red-500";
        } else if (row.severity === "Medium") {
          variant = "warning";
          dotColor = "bg-amber-500";
        } else if (row.severity === "Low") {
          variant = "neutral";
          dotColor = "bg-slate-400";
        } else if (row.severity === "Info") {
          variant = "success";
          dotColor = "bg-green-500";
        }

        return (
          <StatusBadge variant={variant} className="gap-1.5 px-2 py-0.5">
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
            {row.severity}
          </StatusBadge>
        );
      },
    },
    {
      key: "actorEmail",
      header: "Operator",
      className: "text-slate-700 font-medium text-xs",
    },
    {
      key: "ipAddress",
      header: "IP Address",
      className: "text-slate-500 text-xs font-mono",
    },
    {
      key: "resourceId",
      header: "Resource ID",
      className: "text-slate-500 text-xs font-mono max-w-[120px] truncate",
      render: (row: TenantAuditLog) => (
        <span title={row.resourceId}>{row.resourceId}</span>
      ),
    },
  ];

  return (
    <div className="max-w-full mx-auto flex flex-col gap-6 p-1">
      <PageHeader
        breadcrumb={[
          { label: "Platform" },
          { label: "Tenant Management" },
          { label: "Audit" }
        ]}
        title="Audit Log"
        description="Immutable record of administrative operations and security events."
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
          title="Total Audits"
          value={totalAudits}
          subtitle="System audits tracked"
          icon={<Terminal className="h-4 w-4 text-slate-500" />}
          className="border-slate-200 shadow-xs"
        />
        <StatCard
          title="Critical Alerts"
          value={criticalAudits}
          subtitle="Require immediate review"
          icon={<ShieldAlert className="h-4 w-4 text-red-600 animate-pulse" />}
          className="border-slate-200 shadow-xs"
        />
        <StatCard
          title="High/Critical Severity"
          value={highOrCriticalAudits}
          subtitle="Elevated security actions"
          icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
          className="border-slate-200 shadow-xs"
        />
        <StatCard
          title="Active Operators"
          value={uniqueOperators}
          subtitle="Unique console admin emails"
          icon={<UserCheck className="h-4 w-4 text-blue-600" />}
          className="border-slate-200 shadow-xs"
        />
      </div>

      {/* Audit Logs Table */}
      <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <DataTable
            data={filteredAudits}
            columns={columns}
            rowKey={(row) => row.id}
            searchable
            searchPlaceholder="Search by event, operator, resource..."
            searchFields={["event", "actorEmail", "resourceId"]}
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
                    <option value="Access Control">Access Control</option>
                    <option value="Data Export">Data Export</option>
                    <option value="Settings Change">Settings Change</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Security">Security</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 pointer-events-none text-slate-400" />
                </div>

                <div className="relative">
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer font-medium text-slate-700"
                  >
                    <option value="All">All severities</option>
                    <option value="Info">Info</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
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
