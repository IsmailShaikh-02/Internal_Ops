// src/modules/users/components/RoleAssignmentModal.tsx

import React, { useState, useEffect } from "react";
import { X, ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { User, Role, PermissionGroup, Permission } from "../types";

interface RoleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string, roleId: string, groupIds: string[]) => void;
  users: User[];
  roles: Role[];
  permissionGroups: PermissionGroup[];
  permissions: Permission[];
  selectedUser?: User | null;
}

export function RoleAssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  users,
  roles,
  permissionGroups,
  permissions,
  selectedUser,
}: RoleAssignmentModalProps) {
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

  useEffect(() => {
    if (selectedUser) {
      setUserId(selectedUser.id);
      setRoleId(selectedUser.assignedRoleId);
      setSelectedGroupIds(selectedUser.permissionGroupIds || []);
    } else if (users.length > 0) {
      setUserId(users[0].id);
      setRoleId(users[0].assignedRoleId);
      setSelectedGroupIds(users[0].permissionGroupIds || []);
    }
  }, [selectedUser, users, isOpen]);

  // Sync user change
  const handleUserChange = (uId: string) => {
    setUserId(uId);
    const u = users.find((x) => x.id === uId);
    if (u) {
      setRoleId(u.assignedRoleId);
      setSelectedGroupIds(u.permissionGroupIds || []);
    }
  };

  if (!isOpen) return null;

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !roleId) return;
    onSubmit(userId, roleId, selectedGroupIds);
    onClose();
  };

  // Calculate effective permissions: union of permissions in selected groups
  const effectivePermissionIds = new Set<string>();
  selectedGroupIds.forEach((gId) => {
    const group = permissionGroups.find((g) => g.id === gId);
    if (group) {
      group.permissionIds.forEach((pId) => effectivePermissionIds.add(pId));
    }
  });

  const activeEffectivePermissions = permissions.filter((p) => effectivePermissionIds.has(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-lg text-slate-800">Assign Roles & Permissions</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">User *</label>
              <select
                disabled={!!selectedUser}
                value={userId}
                onChange={(e) => handleUserChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:outline-slate-300"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Role *</label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:outline-slate-300"
              >
                {roles
                  .filter((r) => r.status === "active")
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.roleName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
            {/* Permission Group Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Assign Permission Groups
              </label>
              <div className="space-y-2 max-h-[220px] overflow-y-auto border border-slate-100 rounded-xl p-3 bg-slate-50/30">
                {permissionGroups.map((g) => (
                  <label
                    key={g.id}
                    className="flex items-start gap-2.5 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroupIds.includes(g.id)}
                      onChange={() => handleGroupToggle(g.id)}
                      className="mt-0.5 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                    />
                    <div>
                      <span className="block font-bold">{g.name}</span>
                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                        {g.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Effective Permissions Preview */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Effective Permissions Preview
              </label>
              <div className="max-h-[220px] overflow-y-auto border border-slate-100 rounded-xl p-3 bg-slate-50/30 space-y-2">
                {activeEffectivePermissions.length > 0 ? (
                  activeEffectivePermissions.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-100/50 text-[11px] font-bold text-emerald-800"
                    >
                      <span>{p.code}</span>
                      <span className="text-[9px] bg-emerald-200/50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        {p.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                    <ShieldAlert className="h-6 w-6 stroke-1.5 mb-1" />
                    <span className="text-[10px] font-semibold">No permissions active.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-bold cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer">
              Apply Configuration
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
