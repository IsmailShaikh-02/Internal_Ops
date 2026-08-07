import { Modal } from "./Modal";
import type { BugReport } from "../types";
import { useSupportStore } from "../hooks/useSupportState";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { User, ShieldAlert, Settings, Calendar } from "lucide-react";
import { toast } from "sonner";

interface BugDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bug: BugReport;
}

export function BugDetailsModal({ isOpen, onClose, bug }: BugDetailsModalProps) {
  const { assignDeveloper, updateBugStatus, updateBugSeverity } = useSupportStore();

  const handleDevChange = (dev: string) => {
    assignDeveloper(bug.id, dev);
    toast.success(`Developer assigned: ${dev}`);
  };

  const handleStatusChange = (status: BugReport["status"]) => {
    updateBugStatus(bug.id, status);
    toast.success(`Bug status changed to ${status.replace("_", " ")}`);
  };

  const handleSeverityChange = (severity: BugReport["severity"]) => {
    updateBugSeverity(bug.id, severity);
    toast.success(`Severity set to ${severity}`);
  };

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bug Report Details">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Title</span>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight mt-1">{bug.title}</h3>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
          <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-xl mt-1 whitespace-pre-line leading-relaxed">
            {bug.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tenant</span>
            <span className="text-sm font-semibold text-slate-800">{bug.tenant}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Release Version</span>
            <span className="text-sm font-semibold text-slate-800">{bug.releaseVersion || "None Linked"}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date Reported</span>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <Calendar className="h-4 w-4 text-slate-400" />
              {bug.createdDate}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-slate-100 py-4">
          {/* Severity Option */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              Severity
            </label>
            <select
              value={bug.severity}
              onChange={(e) => handleSeverityChange(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Dev assignment */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <User className="h-3 w-3" />
              Developer
            </label>
            <select
              value={bug.assignedDeveloper}
              onChange={(e) => handleDevChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="Unassigned">Unassigned</option>
              <option value="Diana Prince">Diana Prince</option>
              <option value="Bruce Wayne">Bruce Wayne</option>
              <option value="Clark Kent">Clark Kent</option>
            </select>
          </div>

          {/* Status option */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Workflow Status
            </label>
            <select
              value={bug.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="new">New</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="testing">Testing</option>
              <option value="fixed">Fixed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Current status display */}
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <StatusBadge variant={getSeverityBadgeVariant(bug.severity)}>
              {bug.severity.toUpperCase()} SEVERITY
            </StatusBadge>
            <StatusBadge variant={getStatusBadgeVariant(bug.status)}>
              {bug.status.replace("_", " ").toUpperCase()}
            </StatusBadge>
          </div>

          <Button onClick={onClose} className="bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs py-1.5 px-4 cursor-pointer font-bold">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
