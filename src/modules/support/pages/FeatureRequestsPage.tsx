import { useState, useMemo } from "react";
import { useSupportStore } from "../hooks/useSupportState";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { FeatureDetailsModal } from "../components/FeatureDetailsModal";
import type { FeatureRequest } from "../types";
import { ThumbsUp, Search, Filter } from "lucide-react";
import { toast } from "sonner";

export function FeatureRequestsPage() {
  const { featureRequests, voteFeatureRequest } = useSupportStore();
  const [selectedFeature, setSelectedFeature] = useState<FeatureRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filters State
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFeatures = useMemo(() => {
    return featureRequests.filter((f) => {
      const matchStatus = statusFilter === "all" || f.status === statusFilter;
      const matchSearch =
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [featureRequests, statusFilter, searchTerm]);

  const handleVote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    voteFeatureRequest(id, "Ada Turing");
    toast.success("Vote registered!");
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

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search feature requests..."
            className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 min-w-40"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="planned">Planned</option>
            <option value="in_development">In Development</option>
            <option value="released">Released</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Grid of requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeatures.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-400 font-semibold bg-white border border-slate-200 rounded-xl">
            No feature requests found.
          </div>
        ) : (
          filteredFeatures.map((feat) => {
            const hasVoted = feat.votedBy.includes("Ada Turing");
            return (
              <div
                key={feat.id}
                onClick={() => {
                  setSelectedFeature(feat);
                  setIsDetailsOpen(true);
                }}
                className="bg-white border border-slate-200 hover:border-slate-350 p-5 rounded-2xl shadow-xs transition duration-150 flex flex-col justify-between cursor-pointer space-y-4 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold border border-slate-200 uppercase tracking-wider">
                      {feat.category}
                    </span>
                    <StatusBadge variant={getStatusBadgeVariant(feat.status)}>
                      {feat.status.toUpperCase()}
                    </StatusBadge>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug line-clamp-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
                  <span>By {feat.createdBy} • {feat.createdDate}</span>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={(e) => handleVote(e, feat.id)}
                      variant="outline"
                      className={`h-7 rounded-lg px-2.5 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition ${
                        hasVoted ? "bg-blue-50 border-blue-200 text-blue-600" : ""
                      }`}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {feat.votes}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] py-1 h-7 cursor-pointer font-bold"
                    >
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details modal */}
      {selectedFeature && (
        <FeatureDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedFeature(null);
          }}
          feature={selectedFeature}
        />
      )}
    </div>
  );
}
export default FeatureRequestsPage;
