import { useState } from "react";
import { useFeatureStore } from "../hooks/useFeatureState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { ReleaseModal } from "../components/ReleaseModal";
import { Button } from "@/shared/components/ui/button";
import { Play, Pause, RotateCcw, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import type { Release } from "../types";
import { validateCanApplyKillSwitch } from "../validation";

export function ReleaseManagementPage() {
  const {
    releases,
    featureFlags,
    publishRelease,
    pauseRelease,
    resumeRelease,
    rollbackRelease,
    applyKillSwitch,
    createRelease
  } = useFeatureStore();

  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePublish = (row: Release) => {
    publishRelease(row.id);
    toast.success(`Published release: ${row.versionNumber}`);
  };

  const handlePause = (row: Release) => {
    pauseRelease(row.id);
    toast.success(`Paused release: ${row.versionNumber}`);
  };

  const handleResume = (row: Release) => {
    resumeRelease(row.id);
    toast.success(`Resumed release: ${row.versionNumber}`);
  };

  const handleRollback = (row: Release) => {
    rollbackRelease(row.id);
    toast.success(`Rolled back release: ${row.versionNumber}`);
  };

  const handleKillSwitch = (row: Release) => {
    if (!validateCanApplyKillSwitch(row)) {
      toast.error("Kill switch can only be applied to active releases.");
      return;
    }
    applyKillSwitch(row.id);
    toast.error(`EMERGENCY KILL SWITCH TRIGGERED: ${row.versionNumber} has been rolled back!`, {
      duration: 5000,
    });
  };

  const getStatusBadge = (status: Release["status"]) => {
    switch (status) {
      case "active":
        return <StatusBadge variant="success">Active</StatusBadge>;
      case "paused":
        return <StatusBadge variant="warning">Paused</StatusBadge>;
      case "scheduled":
        return <StatusBadge variant="info">Scheduled</StatusBadge>;
      case "rolled_back":
        return <StatusBadge variant="critical">Rolled Back</StatusBadge>;
      default:
        return <StatusBadge variant="neutral">Draft</StatusBadge>;
    }
  };

  const columns = [
    {
      key: "versionNumber",
      header: "Release Version",
      render: (row: Release) => (
        <div>
          <div className="font-bold text-slate-800 text-sm">{row.versionNumber}</div>
          <div className="text-[10px] text-slate-400 font-semibold">{row.releaseDate}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Release) => getStatusBadge(row.status),
    },
    {
      key: "featuresIncluded",
      header: "Features Included",
      render: (row: Release) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {row.featuresIncluded && row.featuresIncluded.length > 0 ? (
            row.featuresIncluded.map((f) => (
              <span
                key={f}
                className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-slate-150"
              >
                {f}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">None</span>
          )}
        </div>
      ),
    },
    {
      key: "rolloutPercentage",
      header: "Rollout Progress",
      render: (row: Release) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
            <div
              className={`h-full ${
                row.status === "active"
                  ? "bg-emerald-500"
                  : row.status === "paused"
                  ? "bg-amber-500"
                  : row.status === "rolled_back"
                  ? "bg-rose-500"
                  : "bg-slate-300"
              }`}
              style={{ width: `${row.rolloutPercentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-600">{row.rolloutPercentage}%</span>
        </div>
      ),
    },
    {
      key: "releaseOwner",
      header: "Owner",
      render: (row: Release) => <span className="text-xs text-slate-600 font-semibold">{row.releaseOwner}</span>,
    },
    {
      key: "releaseNotes",
      header: "Release Notes",
      render: (row: Release) => (
        <span className="text-xs text-slate-500 font-medium truncate max-w-xs block">
          {row.releaseNotes}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: Release) => (
        <div className="flex items-center gap-1">
          {row.status === "draft" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePublish(row)}
              className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer"
              title="Publish Release"
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          )}

          {row.status === "scheduled" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePublish(row)}
              className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer"
              title="Deploy Now"
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          )}

          {row.status === "active" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePause(row)}
              className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer"
              title="Pause Rollout"
            >
              <Pause className="h-3.5 w-3.5" />
            </Button>
          )}

          {row.status === "paused" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResume(row)}
              className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer"
              title="Resume Rollout"
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          )}

          {row.status !== "rolled_back" && row.status !== "draft" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRollback(row)}
              className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer"
              title="Rollback Release"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}

          {row.status === "active" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleKillSwitch(row)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 border-red-100 cursor-pointer"
              title="EMERGENCY KILL SWITCH"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={releases}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search releases..."
        searchFields={["versionNumber", "releaseOwner", "releaseNotes"]}
      />

      <ReleaseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRelease(null);
        }}
        onSubmit={(data) => {
          createRelease(data);
          toast.success(`Successfully updated release pipeline.`);
        }}
        releases={releases}
        featureFlags={featureFlags}
        editingRelease={editingRelease}
      />
    </div>
  );
}
export default ReleaseManagementPage;
