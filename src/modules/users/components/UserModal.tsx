// src/modules/users/components/UserModal.tsx

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { User, Role, PermissionGroup } from "../types";
import { validateEmail, validatePhone } from "../validation";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, "id" | "status" | "lastLogin" | "accountCreatedDate">) => void;
  users: User[];
  roles: Role[];
  permissionGroups: PermissionGroup[];
  editingUser?: User | null;
}

export function UserModal({
  isOpen,
  onClose,
  onSubmit,
  users,
  roles,
  permissionGroups,
  editingUser,
}: UserModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [assignedRoleId, setAssignedRoleId] = useState("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingUser) {
      setFullName(editingUser.fullName);
      setEmail(editingUser.email);
      setMobileNumber(editingUser.mobileNumber);
      setDepartment(editingUser.department);
      setDesignation(editingUser.designation);
      setAssignedRoleId(editingUser.assignedRoleId);
      setSelectedGroupIds(editingUser.permissionGroupIds || []);
    } else {
      setFullName("");
      setEmail("");
      setMobileNumber("");
      setDepartment("");
      setDesignation("");
      setAssignedRoleId(roles.find(r => r.status === "active")?.id || "");
      setSelectedGroupIds([]);
    }
    setError("");
  }, [editingUser, isOpen, roles]);

  if (!isOpen) return null;

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !mobileNumber.trim() || !assignedRoleId) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailError = validateEmail(email, users, editingUser?.id);
    if (emailError) {
      setError(emailError);
      return;
    }
    const phoneError = validatePhone(mobileNumber, users, editingUser?.id);
    if (phoneError) {
      setError(phoneError);
      return;
    } 
    onSubmit({
      fullName,
      email,
      mobileNumber,
      department,
      designation,
      assignedRoleId,
      permissionGroupIds: selectedGroupIds,
      mfaStatus: "Disabled", // Default for new users
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-lg text-slate-800">
            {editingUser ? "Edit Platform User" : "Create Platform User"}
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sarah Connor"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:outline-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@internalops.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:outline-slate-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number *</label>
              <input
                type="text"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:outline-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Operations"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:outline-slate-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Manager"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:outline-slate-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Role *</label>
            <select
              value={assignedRoleId}
              onChange={(e) => setAssignedRoleId(e.target.value)}
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

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Assigned Permission Groups</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border border-slate-100 rounded-xl p-3 bg-slate-50/30 max-h-[140px] overflow-y-auto">
              {permissionGroups.map((g) => (
                <label key={g.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGroupIds.includes(g.id)}
                    onChange={() => handleGroupToggle(g.id)}
                    className="rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                  />
                  {g.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-bold cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer">
              {editingUser ? "Save Changes" : "Send Invitation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
