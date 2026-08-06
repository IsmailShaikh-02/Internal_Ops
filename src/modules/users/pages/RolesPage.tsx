// src/modules/users/pages/RolesPage.tsx

import { useState } from "react";
import { useUserState } from "../hooks/useUserState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { RoleModal } from "../components/RoleModal";
import type { Role } from "../types";
import { toast } from "sonner";
import {
  MoreVertical,
  Copy,
  Archive,
  Edit3,
  Users,
  Shield,
  // ShieldCheck,
} from "lucide-react";

export function RolesPage() {
  const {
    users,
    roles,
    updateRole,
    cloneRole,
    archiveRole,
  } = useUserState();

  const [activeMenuRoleId, setActiveMenuRoleId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [cloneSourceRole, setCloneSourceRole] = useState<Role | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const handleEditClick = (role: Role) => {
    setEditingRole(role);
    setCloneSourceRole(null);
    setIsRoleModalOpen(true);
    setActiveMenuUserId(null);
  };

  const handleCloneClick = (role: Role) => {
    setCloneSourceRole(role);
    setEditingRole(null);
    setIsRoleModalOpen(true);
    setActiveMenuUserId(null);
  };

  const handleArchiveClick = (role: Role) => {
    if (role.roleName === "Platform Owner") {
      toast.error("Validation Error: The Platform Owner role cannot be archived or deleted.");
      setActiveMenuUserId(null);
      return;
    }
    archiveRole(role.id);
    toast.warning(`Archived system role: ${role.roleName}`);
    setActiveMenuUserId(null);
  };

  const setActiveMenuUserId = (id: string | null) => {
    setActiveMenuRoleId(id);
  };

  const getUserCount = (roleId: string) => {
    return users.filter((u) => u.assignedRoleId === roleId).length;
  };

  const columns = [
    {
      key: "roleName",
      header: "Role Title",
      render: (row: Role) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <Shield className="h-4 w-4 text-indigo-600 stroke-2" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm">{row.roleName}</span>
            {row.roleName === "Platform Owner" && (
              <span className="text-[10px] text-indigo-700 bg-indigo-100 font-extrabold px-1.5 py-0.5 rounded-full w-max mt-0.5 uppercase tracking-wide">
                Primary Owner
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Access Description",
      className: "text-xs font-semibold text-slate-500 max-w-[320px] truncate",
    },
    {
      key: "userCount",
      header: "Assigned Users",
      render: (row: Role) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
          <Users className="h-3.5 w-3.5 text-slate-500" />
          {getUserCount(row.id)} {getUserCount(row.id) === 1 ? "user" : "users"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Role) => {
        const variant = row.status === "active" ? ("success" as const) : ("neutral" as const);
        return <StatusBadge variant={variant}>{row.status}</StatusBadge>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row: Role) => (
        <div className="relative inline-block text-left">
          <button
            onClick={() => setActiveMenuUserId(activeMenuRoleId === row.id ? null : row.id)}
            className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <MoreVertical className="h-4 w-4 text-slate-500" />
          </button>

          {activeMenuRoleId === row.id && (
            <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl z-20 overflow-hidden text-left py-1 text-xs">
              <button
                onClick={() => handleEditClick(row)}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit Role
              </button>

              <button
                onClick={() => handleCloneClick(row)}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                Clone Role
              </button>

              {row.status === "active" && (
                <>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    disabled={row.roleName === "Platform Owner"}
                    onClick={() => handleArchiveClick(row)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    Archive Role
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Role Configurations & Privileges"
        data={roles}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search roles by title..."
        searchFields={["roleName", "description"]}
      />

      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setEditingRole(null);
          setCloneSourceRole(null);
        }}
        onSubmit={(data) => {
          if (editingRole) {
            updateRole(editingRole.id, data);
            toast.success(`Updated role: ${data.roleName}`);
          } else if (cloneSourceRole) {
            cloneRole(cloneSourceRole.id, data.roleName);
            toast.success(`Successfully cloned role: ${data.roleName}`);
          }
        }}
        roles={roles}
        editingRole={editingRole}
        cloneSourceRole={cloneSourceRole}
      />
    </div>
  );
}

export default RolesPage;
