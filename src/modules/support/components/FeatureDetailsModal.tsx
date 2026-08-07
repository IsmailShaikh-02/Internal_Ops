import { useState } from "react";
import { Modal } from "./Modal";
import type { FeatureRequest } from "../types";
import { useSupportStore } from "../hooks/useSupportState";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { ThumbsUp, Calendar, Layers } from "lucide-react";
import { toast } from "sonner";

interface FeatureDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: FeatureRequest;
}

export function FeatureDetailsModal({ isOpen, onClose, feature }: FeatureDetailsModalProps) {
  const { voteFeatureRequest, updateFeatureStatus } = useSupportStore();
  const [plannedRelease, setPlannedRelease] = useState(feature.plannedRelease || "");

  const handleVote = () => {
    // Simulating vote by Ada Turing
    voteFeatureRequest(feature.id, "Ada Turing");
    toast.success("Vote updated!");
  };

  const handleStatusChange = (status: FeatureRequest["status"]) => {
    updateFeatureStatus(feature.id, status, plannedRelease || undefined);
    toast.success(`Feature status set to ${status.replace("_", " ")}`);
  };

  const getStatusBadgeVariant = (status: FeatureRequest["status"]) => {
    switch (status) {
      case "released": return "success";
      case "approved":
      case "planned":
      case "in_development":
        return "info";
      case "under_review": return "warning";
      default: return "neutral";
    }
  };

  const userVoted = feature.votedBy.includes("Ada Turing");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Feature Request Details">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Title</span>
          <h3 className="text-base font-bold text-slate-800 tracking-tight mt-1">{feature.title}</h3>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
          <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-xl mt-1 leading-relaxed">
            {feature.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 pt-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</span>
            <span className="text-sm font-semibold text-slate-800">{feature.category}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Created By</span>
            <span className="text-sm font-semibold text-slate-800">{feature.createdBy}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date Submitted</span>
            <span className="text-sm font-semibold text-slate-800">{feature.createdDate}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upvotes</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Button
                onClick={handleVote}
                variant="outline"
                className={`py-1 h-7 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                  userVoted ? "bg-blue-50 text-blue-600 border-blue-200" : ""
                }`}
              >
                <ThumbsUp className="h-3 w-3 animate-bounce-subtle" />
                {feature.votes} Upvotes
              </Button>
            </div>
          </div>
        </div>

        {/* Product Manager Review Controls */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1 text-blue-600">
            <Layers className="h-3 w-3" />
            Product Management Review
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Development Status
              </label>
              <select
                value={feature.status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="new">New</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="planned">Planned</option>
                <option value="in_development">In Development</option>
                <option value="released">Released</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Planned Release Version
              </label>
              <input
                value={plannedRelease}
                onChange={(e) => setPlannedRelease(e.target.value)}
                placeholder="e.g. v2.5.0"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => handleStatusChange(feature.status)}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs py-1.5 px-4 cursor-pointer font-bold"
            >
              Update Status & Release
            </Button>
          </div>
        </div>

        {/* Current status display */}
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <StatusBadge variant={getStatusBadgeVariant(feature.status)}>
              {feature.status.replace("_", " ").toUpperCase()}
            </StatusBadge>
            {feature.plannedRelease && (
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Target Release: {feature.plannedRelease}
              </span>
            )}
          </div>

          <Button onClick={onClose} variant="outline" className="rounded-xl text-xs py-1.5 px-4 cursor-pointer font-bold border-slate-200 text-slate-700">
            Close Panel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
