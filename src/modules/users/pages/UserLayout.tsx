// src/modules/users/pages/UserLayout.tsx

import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserState } from "../hooks/useUserState";
import { UserModal } from "../components/UserModal";
import { RoleModal } from "../components/RoleModal";
import { GroupModal } from "../components/GroupModal";
import { RoleAssignmentModal } from "../components/RoleAssignmentModal";
import { Button } from "@/shared/components/ui/button";
import { Plus, UserPlus, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    users,
    roles,
    permissionGroups,
    permissions,
    createUser,
    createRole,
    createGroup,
    assignRoleAndGroups,
  } = useUserState();

  // Modals visibility state
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const tabs = [
    { name: "Users", path: "/users", count: users.length },
    { name: "Roles", path: "/users/roles", count: roles.filter(r => r.status === "active").length },
    { name: "Permission Groups", path: "/users/permission-groups", count: permissionGroups.length },
    { name: "Permissions", path: "/users/permissions", count: permissions.length },
    { name: "Role Assignment", path: "/users/role-assignment" },
    { name: "Security Policies", path: "/users/security-policies" },
  ];

  const renderActionButtons = () => {
    if (location.pathname === "/users" || location.pathname === "/users/") {
      return (
        <Button
          onClick={() => setIsUserOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold text-xs py-2 px-4 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      );
    }
    if (location.pathname === "/users/roles") {
      return (
        <Button
          onClick={() => setIsRoleOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold text-xs py-2 px-4 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Role
        </Button>
      );
    }
    if (location.pathname === "/users/permission-groups") {
      return (
        <Button
          onClick={() => setIsGroupOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold text-xs py-2 px-4 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Group
        </Button>
      );
    }
    if (location.pathname === "/users/role-assignment") {
      return (
        <Button
          onClick={() => setIsAssignOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold text-xs py-2 px-4 cursor-pointer"
        >
          <KeyRound className="h-4 w-4" />
          Assign Access
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="max-w-full mx-auto flex flex-col gap-6 p-1">
      
      <PageHeader
        breadcrumb={[
          { label: "Platform" },
          { label: "Platform Users" },
        ]}
        title="Platform Users"
        description="Manage console administrators, role settings, permissions, assignments, and governance."
        actions={
          <>
            {renderActionButtons()}
          </>
        }
      />
     
      {/* Tab bar */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex gap-6 min-w-max pb-px">
          {tabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              (tab.path === "/users" && location.pathname === "/users/");
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`py-3.5 border-b-2 font-semibold text-sm transition duration-150 relative cursor-pointer ${
                  isActive
                    ? "border-slate-800 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-500"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Page Content */}
      <Outlet />

      {/* Modals Containers */}
      <UserModal
        isOpen={isUserOpen}
        onClose={() => setIsUserOpen(false)}
        onSubmit={(data) => {
          createUser(data);
          toast.success(`Successfully invited: ${data.fullName}`);
        }}
        users={users}
        roles={roles}
        permissionGroups={permissionGroups}
      />

      <RoleModal
        isOpen={isRoleOpen}
        onClose={() => setIsRoleOpen(false)}
        onSubmit={(data) => {
          createRole(data);
          toast.success(`Successfully created role: ${data.roleName}`);
        }}
        roles={roles}
      />

      <GroupModal
        isOpen={isGroupOpen}
        onClose={() => setIsGroupOpen(false)}
        onSubmit={(data) => {
          createGroup(data);
          toast.success(`Successfully created group: ${data.name}`);
        }}
        groups={permissionGroups}
        permissions={permissions}
      />

      <RoleAssignmentModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        onSubmit={(userId, roleId, groupIds) => {
          assignRoleAndGroups(userId, roleId, groupIds);
          const uName = users.find(u => u.id === userId)?.fullName || "User";
          toast.success(`Updated role assignments for ${uName}`);
        }}
        users={users}
        roles={roles}
        permissionGroups={permissionGroups}
        permissions={permissions}
      />
    </div>
  );
}

export default UserLayout;
