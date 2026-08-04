import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Release, FeatureFlag } from "../types";
import { validateReleaseVersionUnique, validateReleaseDateNotInPast } from "../validation";

interface ReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Release, "id">) => void;
  releases: Release[];
  featureFlags: FeatureFlag[];
  editingRelease?: Release | null;
}

export function ReleaseModal({
  isOpen,
  onClose,
  onSubmit,
  releases,
  featureFlags,
  editingRelease,
}: ReleaseModalProps) {
  const [versionNumber, setVersionNumber] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [status, setStatus] = useState<Release["status"]>("draft");
  const [featuresIncluded, setFeaturesIncluded] = useState<string[]>([]);
  const [rolloutPercentage, setRolloutPercentage] = useState(0);
  const [releaseOwner, setReleaseOwner] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingRelease) {
      setVersionNumber(editingRelease.versionNumber);
      setReleaseDate(editingRelease.releaseDate);
      setStatus(editingRelease.status);
      setFeaturesIncluded(editingRelease.featuresIncluded || []);
      setRolloutPercentage(editingRelease.rolloutPercentage);
      setReleaseOwner(editingRelease.releaseOwner);
      setReleaseNotes(editingRelease.releaseNotes);
    } else {
      setVersionNumber("");
      setReleaseDate("");
      setStatus("draft");
      setFeaturesIncluded([]);
      setRolloutPercentage(0);
      setReleaseOwner("");
      setReleaseNotes("");
    }
    setError("");
  }, [editingRelease, isOpen]);

  if (!isOpen) return null;

  const handleFeatureToggle = (name: string) => {
    setFeaturesIncluded((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionNumber.trim() || !releaseDate || !releaseOwner.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateReleaseVersionUnique(versionNumber, releases, editingRelease?.id)) {
      setError("Release version number must be unique.");
      return;
    }

    // Only enforce future release date when creating a scheduled/new release
    if (!editingRelease && (status === "scheduled" || status === "draft")) {
      if (!validateReleaseDateNotInPast(releaseDate)) {
        setError("Release date cannot be in the past.");
        return;
      }
    }

    onSubmit({
      versionNumber: versionNumber.trim(),
      releaseDate,
      status,
      featuresIncluded,
      rolloutPercentage,
      releaseOwner: releaseOwner.trim(),
      releaseNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-lg text-slate-800">
            {editingRelease ? "Edit Release Pipeline" : "Create Release Pipeline"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs font-semibold border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Version Number*</label>
              <input
                value={versionNumber}
                onChange={(e) => setVersionNumber(e.target.value)}
                placeholder="e.g. v2.6.0"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:border-slate-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Release Owner*</label>
              <input
                value={releaseOwner}
                onChange={(e) => setReleaseOwner(e.target.value)}
                placeholder="e.g. Ada Turing"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:border-slate-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Release Date*</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-200 pl-9 pr-3.5 py-2 focus:outline-hidden focus:border-slate-400 bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Initial Pipeline Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Release["status"])}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-hidden focus:border-slate-400 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active (Deploy)</option>
                <option value="paused">Paused</option>
                <option value="rolled_back">Rolled Back</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-600">Pipeline Rollout Percentage</label>
              <span className="text-sm font-bold text-slate-800">{rolloutPercentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rolloutPercentage}
              onChange={(e) => setRolloutPercentage(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">Select Features Included</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-slate-100 p-2 rounded-xl bg-slate-50">
              {featureFlags.map((flag) => (
                <label
                  key={flag.id}
                  className="flex items-center gap-2 p-2 bg-white border border-slate-150 rounded-xl cursor-pointer hover:bg-slate-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={featuresIncluded.includes(flag.name)}
                    onChange={() => handleFeatureToggle(flag.name)}
                    className="rounded text-slate-800"
                  />
                  <span className="text-xs font-semibold text-slate-700">{flag.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 block">Release Notes</label>
            <textarea
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              placeholder="Provide information on what this release updates..."
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:border-slate-400 h-24 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl px-4 py-2 font-semibold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 font-semibold text-xs cursor-pointer"
            >
              {editingRelease ? "Save Release" : "Publish Release"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
