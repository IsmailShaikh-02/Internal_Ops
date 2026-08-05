// src/modules/users/components/GroupModal.tsx

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { PermissionGroup, Permission } from "../types";
import { validateGroupName } from "../validation";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PermissionGroup, "id">) => void;
  groups: PermissionGroup[];
  permissions: Permission[];
  editingGroup?: PermissionGroup | null;
}

export function GroupModal({
  isOpen,
  onClose,
  onSubmit,
  groups,
  permissions,
  editingGroup,
}: GroupModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingGroup) {
      setName(editingGroup.name);
      setDescription(editingGroup.description);
      setSelectedPermissionIds(editingGroup.permissionIds || []);
    } else {
      setName("");
      setDescription("");
      setSelectedPermissionIds([]);
    }
    setError("");
  }, [editingGroup, isOpen]);

  if (!isOpen) return null;

  const handlePermissionToggle = (permId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Permission group name is required.");
      return;
    }

    const nameError = validateGroupName(name, groups, editingGroup?.id);
    if (nameError) {
      setError(nameError);
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      permissionIds: selectedPermissionIds,
    });
    onClose();
  };

  // Group permissions by their module name for clear user-friendly selection
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const mod = perm.moduleName;
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-lg text-slate-800">
            {editingGroup ? "Edit Permission Group" : "Create Permission Group"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl px-4 py-3 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Group Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tenant Management"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:outline-slate-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about what access this group provides."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:outline-slate-300 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Assigned Permissions</label>
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30 space-y-4 max-h-[220px] overflow-y-auto">
              {Object.entries(groupedPermissions).map(([modName, perms]) => (
                <div key={modName} className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wide border-b pb-1">
                    {modName}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {perms.map((p) => (
                      <label key={p.id} className="flex items-start gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissionIds.includes(p.id)}
                          onChange={() => handlePermissionToggle(p.id)}
                          className="mt-0.5 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                        />
                        <div>
                          <span className="font-bold text-slate-700 block">{p.code}</span>
                          <span className="text-[10px] text-slate-400">{p.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-bold cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer">
              {editingGroup ? "Save Changes" : "Create Group"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
