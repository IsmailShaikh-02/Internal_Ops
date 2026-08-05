// src/modules/users/pages/RoleAssignmentPage.tsx

import { useState } from "react";
import { useUserState } from "../hooks/useUserState";
import { RoleAssignmentModal } from "../components/RoleAssignmentModal";
import { Button } from "@/shared/components/ui/button";
import { Shield, ShieldAlert, KeyRound, ArrowRight, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export function RoleAssignmentPage() {
  const {
    users,
    roles,
    permissionGroups,
    permissions,
    assignRoleAndGroups,
  } = useUserState();

  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || "");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  if (!selectedUser) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <span className="text-slate-400 font-semibold">No platform users found. Please create users first.</span>
      </div>
    );
  }

  // Calculate effective permissions: union of permissions in selected groups
  const getEffectivePermissions = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return [];

    const effectiveSet = new Set<string>();
    user.permissionGroupIds.forEach((gId) => {
      const group = permissionGroups.find((g) => g.id === gId);
      if (group) {
        group.permissionIds.forEach((pId) => effectiveSet.add(pId));
      }
    });

    return permissions.filter((p) => effectiveSet.has(p.id));
  };

  const activeEffectivePermissions = getEffectivePermissions(selectedUser.id);
  const selectedUserRole = roles.find((r) => r.id === selectedUser.assignedRoleId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Users Selector column */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
          Select User
        </h3>
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {users.map((u) => {
            const isSelected = u.id === selectedUser.id;
            const uRole = roles.find((r) => r.id === u.assignedRoleId)?.roleName || "No Role";
            return (
              <button
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-slate-50/50 border-slate-100 hover:bg-slate-100/50 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-500"}`}>
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs">{u.fullName}</span>
                    {/* <span className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-400"} mt-0.5`}>
                      {u.email}
                    </span> */}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"
                  }`}>
                    {uRole}
                  </span>
                  <ArrowRight className={`h-3 w-3 ${isSelected ? "text-white" : "text-slate-300"}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Assignment Preview Panel */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{selectedUser.fullName}</h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Department: <span className="text-slate-600">{selectedUser.department || "N/A"}</span> | Designation: <span className="text-slate-600">{selectedUser.designation || "N/A"}</span>
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsAssignModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-bold text-xs py-2.5 px-4 cursor-pointer"
            >
              <KeyRound className="h-4 w-4" />
              Change Assignment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Roles and groups info */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Assigned System Role
                </span>
                <span className="block font-bold text-slate-800 text-sm">
                  {selectedUserRole?.roleName || "No Role"}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  {selectedUserRole?.description || "No description provided."}
                </p>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Permission Groups
                </span>
                <div className="space-y-2">
                  {selectedUser.permissionGroupIds.length > 0 ? (
                    selectedUser.permissionGroupIds.map((gId) => {
                      const gp = permissionGroups.find((g) => g.id === gId);
                      return (
                        <div key={gId} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-1">
                          <span className="text-xs font-bold text-slate-800">{gp?.name || "Unknown Group"}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{gp?.description}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block">No explicit groups assigned.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Effective permissions tree */}
            <div className="space-y-3">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Effective System Privileges
              </span>
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 max-h-[380px] overflow-y-auto space-y-2">
                {activeEffectivePermissions.length > 0 ? (
                  activeEffectivePermissions.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-800"
                    >
                      <div className="flex flex-col">
                        <span>{p.code}</span>
                        <span className="text-[9px] text-emerald-600 font-normal mt-0.5">{p.description}</span>
                      </div>
                      <span className="text-[9px] bg-emerald-200/50 text-emerald-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        {p.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-2">
                    <ShieldAlert className="h-8 w-8 stroke-1 text-slate-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">No Active Privileges</span>
                      <span className="text-[10px] text-slate-400 mt-1 block max-w-[200px] leading-relaxed mx-auto font-medium">
                        Assign one or more permission groups to grant console administration capabilities.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <RoleAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={(userId, roleId, groupIds) => {
          assignRoleAndGroups(userId, roleId, groupIds);
          toast.success(`Updated access configuration for ${selectedUser.fullName}`);
        }}
        users={users}
        roles={roles}
        permissionGroups={permissionGroups}
        permissions={permissions}
        selectedUser={selectedUser}
      />
    </div>
  );
}

export default RoleAssignmentPage;
