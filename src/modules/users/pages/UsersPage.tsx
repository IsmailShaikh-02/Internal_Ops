// src/modules/users/pages/UsersPage.tsx

import { useState } from "react";
import { useUserState } from "../hooks/useUserState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { UserModal } from "../components/UserModal";
import type { User } from "../types";
import { toast } from "sonner";
import {
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserMinus,
  KeyRound,
  RotateCcw,
  LogOut,
  Trash2,
  Edit2,
  Mail,
  CheckCircle,
} from "lucide-react";

export function UsersPage() {
  const {
    users,
    roles,
    permissionGroups,
    updateUser,
    suspendUser,
    activateUser,
    deleteUser,
    resetPassword,
    resendInvitation,
    acceptInvitation,
  } = useUserState();

  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
    setActiveMenuUserId(null);
  };

  const handleStatusToggle = (user: User) => {
    if (user.status === "active") {
      suspendUser(user.id);
      toast.warning(`Suspended user: ${user.fullName}`);
    } else {
      activateUser(user.id);
      toast.success(`Activated user: ${user.fullName}`);
    }
    setActiveMenuUserId(null);
  };

  const handleResetPassword = (user: User) => {
    const tempPass = resetPassword(user.id);
    toast.success(`Password reset link dispatched. Temporary password: ${tempPass}`, {
      duration: 8000,
    });
    setActiveMenuUserId(null);
  };

  const handleForceLogout = (user: User) => {
    toast.info(`Active sessions terminated for ${user.fullName}`);
    setActiveMenuUserId(null);
  };

  const handleResendInvitation = (user: User) => {
    resendInvitation(user.id);
    toast.success(`Invitation link re-sent to ${user.email}`);
    setActiveMenuUserId(null);
  };

  const handleAcceptInvitation = (user: User) => {
    acceptInvitation(user.id);
    toast.success(`Account activated for ${user.fullName}`);
    setActiveMenuUserId(null);
  };

  const handleDelete = (user: User) => {
    if (roles.find(r => r.id === user.assignedRoleId)?.roleName === "Platform Owner") {
      const ownerCount = users.filter(u => {
        const uRole = roles.find(r => r.id === u.assignedRoleId);
        return uRole?.roleName === "Platform Owner";
      }).length;

      if (ownerCount <= 1) {
        toast.error("Validation Error: At least one Platform Owner must always exist!");
        setActiveMenuUserId(null);
        return;
      }
    }
    
    deleteUser(user.id);
    toast.success(`Deleted user: ${user.fullName}`);
    setActiveMenuUserId(null);
  };

  const getRoleName = (roleId: string) => {
    return roles.find((r) => r.id === roleId)?.roleName || "Unknown Role";
  };

  const columns = [
    {
      key: "fullName",
      header: "Full Name",
      render: (row: User) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-sm">{row.fullName}</span>
          {/* <span className="text-slate-400 text-xs mt-0.5">{row.designation || "No Title"}</span> */}
        </div>
      ),
    },
    {
      key: "email",
      header: "Contact Info",
      render: (row: User) => (
        <div className="flex flex-col text-xs font-semibold">
          <span className="text-slate-700">{row.email}</span>
          <span className="text-slate-400 mt-0.5">{row.mobileNumber}</span>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      className: "text-xs font-semibold text-slate-600",
    },
    {
      key: "assignedRoleId",
      header: "System Role",
      render: (row: User) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <ShieldCheck className="h-3.5 w-3.5 stroke-2 text-indigo-500" />
          {getRoleName(row.assignedRoleId)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: User) => {
        const statusMap: Record<User["status"], { variant: "success" | "warning" | "critical"; label: string }> = {
          active: { variant: "success", label: "Active" },
          suspended: { variant: "critical", label: "Suspended" },
          pending: { variant: "warning", label: "Invited" },
        };
        const config = statusMap[row.status] || { variant: "neutral", label: row.status };
        return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
      },
    },
    {
      key: "mfaStatus",
      header: "MFA Status",
      render: (row: User) => (
        <span className={`inline-flex items-center gap-1 text-xs font-bold ${row.mfaStatus === "Enabled" ? "text-emerald-600" : "text-slate-400"}`}>
          {row.mfaStatus === "Enabled" ? (
            <ShieldCheck className="h-3.5 w-3.5 stroke-2" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5 stroke-2" />
          )}
          {row.mfaStatus}
        </span>
      ),
    },
    {
      key: "lastLogin",
      header: "Last Activity",
      render: (row: User) => (
        <div className="flex flex-col text-xs font-semibold text-slate-500">
          <span>{row.lastLogin}</span>
          {/* <span className="text-[10px] text-slate-400 mt-0.5">Created: {row.accountCreatedDate}</span> */}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row: User) => (
        <div className="relative inline-block text-left">
          <button
            onClick={() => setActiveMenuUserId(activeMenuUserId === row.id ? null : row.id)}
            className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <MoreVertical className="h-4 w-4 text-slate-500" />
          </button>

          {activeMenuUserId === row.id && (
            <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white border border-slate-200 shadow-xl z-20 overflow-hidden text-left py-1 text-xs">
              <button
                onClick={() => handleEditClick(row)}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Profile
              </button>

              {row.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleAcceptInvitation(row)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-emerald-600 hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Accept Invitation (Demo)
                  </button>
                  <button
                    onClick={() => handleResendInvitation(row)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Resend Invitation
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleStatusToggle(row)}
                  className={`w-full flex items-center gap-2 px-3 py-2 font-semibold cursor-pointer ${
                    row.status === "active" ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {row.status === "active" ? (
                    <>
                      <UserMinus className="h-3.5 w-3.5" />
                      Suspend User
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-3.5 w-3.5" />
                      Activate User
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => handleResetPassword(row)}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Password
              </button>

              {row.status === "active" && (
                <button
                  onClick={() => handleForceLogout(row)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Force Logout
                </button>
              )}

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => handleDelete(row)}
                className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete User
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Active Console Administrators"
        data={users}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search users by name, email, department..."
        searchFields={["fullName", "email", "department", "designation"]}
      />

      <UserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={(data) => {
          if (editingUser) {
            updateUser(editingUser.id, data);
            toast.success(`Successfully updated profile: ${data.fullName}`);
          }
        }}
        users={users}
        roles={roles}
        permissionGroups={permissionGroups}
        editingUser={editingUser}
      />
    </div>
  );
}

export default UsersPage;
