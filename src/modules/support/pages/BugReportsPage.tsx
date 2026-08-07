import { useState, useMemo } from "react";
import { useSupportStore } from "../hooks/useSupportState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { BugDetailsModal } from "../components/BugDetailsModal";
import type { BugReport } from "../types";
import { Eye, Bug, ShieldAlert, Code } from "lucide-react";

export function BugReportsPage() {
  const { bugs } = useSupportStore();
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      const matchSeverity = severityFilter === "all" || bug.severity === severityFilter;
      const matchStatus = statusFilter === "all" || bug.status === statusFilter;
      return matchSeverity && matchStatus;
    });
  }, [bugs, severityFilter, statusFilter]);

  // KPIs
  const criticalBugs = bugs.filter(b => b.severity === "critical" && b.status !== "closed").length;
  const inProgressBugs = bugs.filter(b => b.status === "in_progress").length;
  const totalBugs = bugs.length;

  const getSeverityBadgeVariant = (severity: BugReport["severity"]) => {
    switch (severity) {
      case "critical": return "critical";
      case "high": return "warning";
      case "medium": return "info";
      default: return "neutral";
    }
  };

  const getStatusBadgeVariant = (status: BugReport["status"]) => {
    switch (status) {
      case "closed":
      case "fixed":
        return "success";
      case "testing":
        return "info";
      case "in_progress":
        return "warning";
      default:
        return "neutral";
    }
  };

  const columns = [
    {
      key: "title",
      header: "Defect Title",
      className: "font-semibold text-slate-900 max-w-sm truncate",
    },
    {
      key: "tenant",
      header: "Reporting Source",
      className: "text-sm text-slate-600 font-semibold",
    },
    {
      key: "severity",
      header: "Severity",
      render: (row: BugReport) => (
        <StatusBadge variant={getSeverityBadgeVariant(row.severity)}>
          {row.severity.toUpperCase()}
        </StatusBadge>
      ),
    },
    {
      key: "status",
      header: "Workflow Status",
      render: (row: BugReport) => (
        <StatusBadge variant={getStatusBadgeVariant(row.status)}>
          {row.status.replace("_", " ").toUpperCase()}
        </StatusBadge>
      ),
    },
    {
      key: "assignedDeveloper",
      header: "Assigned Dev",
      className: "text-xs font-semibold text-slate-800",
    },
    {
      key: "releaseVersion",
      header: "Release target",
      className: "text-xs text-slate-500 font-mono",
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row: BugReport) => (
        <Button
          size="sm"
          variant="outline"
          className="gap-1 rounded-lg text-xs font-bold py-1 h-7 cursor-pointer"
          onClick={() => {
            setSelectedBug(row);
            setIsDetailsOpen(true);
          }}
        >
          <Eye className="h-3 w-3" />
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Bug specific mini-dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tracked Defects</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{totalBugs}</span>
          </div>
          <Bug className="h-8 w-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active In Development</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{inProgressBugs}</span>
          </div>
          <Code className="h-8 w-8 text-amber-500 bg-amber-50 p-1.5 rounded-lg" />
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Critical Unfixed Issues</span>
            <span className="text-2xl font-extrabold text-red-700 mt-1 block">{criticalBugs}</span>
          </div>
          <ShieldAlert className="h-8 w-8 text-red-500 bg-red-50 p-1.5 rounded-lg" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Severity Level
          </label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-500 min-w-36"
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-500 min-w-36"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="testing">Testing</option>
            <option value="fixed">Fixed</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Datatable list */}
      <DataTable
        data={filteredBugs}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search bug titles..."
        searchFields={["title", "tenant", "assignedDeveloper"]}
        pageSize={6}
        emptyMessage="No defect reports found matching the filters."
      />

      {/* Details modal */}
      {selectedBug && (
        <BugDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedBug(null);
          }}
          bug={selectedBug}
        />
      )}
    </div>
  );
}
export default BugReportsPage;
