// src/modules/users/components/RoleModal.tsx

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Role } from "../types";
import { validateRoleName } from "../validation";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Role, "id" | "status">) => void;
  roles: Role[];
  editingRole?: Role | null;
  cloneSourceRole?: Role | null;
}

export function RoleModal({
  isOpen,
  onClose,
  onSubmit,
  roles,
  editingRole,
  cloneSourceRole,
}: RoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingRole) {
      setRoleName(editingRole.roleName);
      setDescription(editingRole.description);
    } else if (cloneSourceRole) {
      setRoleName(`${cloneSourceRole.roleName} (Copy)`);
      setDescription(cloneSourceRole.description);
    } else {
      setRoleName("");
      setDescription("");
    }
    setError("");
  }, [editingRole, cloneSourceRole, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setError("Role name is required.");
      return;
    }

    const nameError = validateRoleName(roleName, roles, editingRole?.id);
    if (nameError) {
      setError(nameError);
      return;
    }

    onSubmit({
      roleName: roleName.trim(),
      description: description.trim(),
    });
    onClose();
  };

  const getTitle = () => {
    if (editingRole) return "Edit Role";
    if (cloneSourceRole) return `Clone Role: ${cloneSourceRole.roleName}`;
    return "Create Role";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-lg text-slate-800">{getTitle()}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl px-4 py-3 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role Name *</label>
            <input
              type="text"
              required
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Finance Administrator"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:outline-slate-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a concise description of what tasks this role performs."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:outline-slate-300 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-bold cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer">
              {editingRole ? "Save Changes" : cloneSourceRole ? "Clone Role" : "Create Role"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
