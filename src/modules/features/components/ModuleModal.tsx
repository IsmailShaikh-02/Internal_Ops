import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Module } from "../types";
import { validateModuleNameUnique } from "../validation";

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Module, "id" | "updatedAt" | "tenantCount">) => void;
  modules: Module[];
  editingModule?: Module | null;
}

export function ModuleModal({
  isOpen,
  onClose,
  onSubmit,
  modules,
  editingModule,
}: ModuleModalProps) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [version, setVersion] = useState("");
  const [routeName, setRouteName] = useState("");
  const [defaultAvailability, setDefaultAvailability] = useState<"enabled" | "disabled">("enabled");
  const [status, setStatus] = useState<Module["status"]>("active");
  const [assignedPlans, setAssignedPlans] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingModule) {
      setName(editingModule.name);
      setDisplayName(editingModule.displayName);
      setDescription(editingModule.description);
      setCategory(editingModule.category);
      setVersion(editingModule.version);
      setRouteName(editingModule.routeName);
      setDefaultAvailability(editingModule.defaultAvailability);
      setStatus(editingModule.status);
      setAssignedPlans(editingModule.assignedPlans || []);
    } else {
      setName("");
      setDisplayName("");
      setDescription("");
      setCategory("");
      setVersion("");
      setRouteName("");
      setDefaultAvailability("enabled");
      setStatus("active");
      setAssignedPlans([]);
    }
    setError("");
  }, [editingModule, isOpen]);

  if (!isOpen) return null;

  const handlePlanToggle = (plan: string) => {
    setAssignedPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !displayName.trim() || !version.trim() || !routeName.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateModuleNameUnique(name, modules, editingModule?.id)) {
      setError("Module name must be unique.");
      return;
    }

    onSubmit({
      name,
      displayName,
      description,
      category,
      version,
      routeName,
      defaultAvailability,
      status,
      assignedPlans,
      icon: "Boxes", // Default icon
    });
    onClose();
  };

  const plansList = ["Starter", "Professional", "Business", "Enterprise"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-lg text-slate-800">
            {editingModule ? "Edit Module" : "Create New Module"}
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
              <label className="text-xs font-bold text-slate-600 block">Module Name (Unique)*</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. HR"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:border-slate-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Display Name*</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. HR Management"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:border-slate-400"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Module description..."
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:border-slate-400 h-20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Human Resources"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:border-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Version*</label>
              <input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. v2024.10"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:border-slate-400"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 block">Route Name (Route Path)*</label>
            <input
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="e.g. /hr"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:border-slate-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Default Availability</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDefaultAvailability("enabled")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                    defaultAvailability === "enabled"
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Enabled
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultAvailability("disabled")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                    defaultAvailability === "disabled"
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Disabled
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Module["status"])}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-hidden focus:border-slate-400 bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-600 block">Assign to Subscription Plans</label>
            <div className="grid grid-cols-2 gap-2">
              {plansList.map((plan) => (
                <label
                  key={plan}
                  className="flex items-center gap-2 p-2.5 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={assignedPlans.includes(plan)}
                    onChange={() => handlePlanToggle(plan)}
                    className="rounded-md border-slate-300 text-slate-800"
                  />
                  <span className="text-xs font-semibold text-slate-700">{plan}</span>
                </label>
              ))}
            </div>
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
              {editingModule ? "Save Changes" : "Create Module"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
