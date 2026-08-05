// src/modules/users/pages/PermissionGroupsPage.tsx

import { useState } from "react";
import { useUserState } from "../hooks/useUserState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { GroupModal } from "../components/GroupModal";
import type { PermissionGroup } from "../types";
import { toast } from "sonner";
import {
  MoreVertical,
  Layers,
  Edit2,
  Trash2,
  Lock,
} from "lucide-react";

export function PermissionGroupsPage() {
  const {
    permissionGroups,
    permissions,
    createGroup,
    updateGroup,
    deleteGroup,
  } = useUserState();

  const [activeMenuGroupId, setActiveMenuGroupId] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const handleEditClick = (group: PermissionGroup) => {
    setEditingGroup(group);
    setIsGroupModalOpen(true);
    setActiveMenuGroupId(null);
  };

  const handleDeleteClick = (group: PermissionGroup) => {
    deleteGroup(group.id);
    toast.success(`Deleted permission group: ${group.name}`);
    setActiveMenuGroupId(null);
  };

  const columns = [
    {
      key: "name",
      header: "Group Name",
      render: (row: PermissionGroup) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <Layers className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="font-bold text-slate-800 text-sm">{row.name}</span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      className: "text-xs font-semibold text-slate-500 max-w-[280px] truncate",
    },
    {
      key: "permissions",
      header: "Mapped Permissions",
      render: (row: PermissionGroup) => {
        const count = row.permissionIds?.length || 0;
        return (
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            {count} {count === 1 ? "permission" : "permissions"}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row: PermissionGroup) => (
        <div className="relative inline-block text-left">
          <button
            onClick={() => setActiveMenuGroupId(activeMenuGroupId === row.id ? null : row.id)}
            className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <MoreVertical className="h-4 w-4 text-slate-500" />
          </button>

          {activeMenuGroupId === row.id && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-200 shadow-xl z-20 overflow-hidden text-left py-1 text-xs">
              <button
                onClick={() => handleEditClick(row)}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Group
              </button>
              <button
                onClick={() => handleDeleteClick(row)}
                className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Group
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
        title="Permission Groups catalog"
        data={permissionGroups}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search permission groups..."
        searchFields={["name", "description"]}
      />

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setEditingGroup(null);
        }}
        onSubmit={(data) => {
          if (editingGroup) {
            updateGroup(editingGroup.id, data);
            toast.success(`Updated permission group: ${data.name}`);
          } else {
            createGroup(data);
            toast.success(`Created permission group: ${data.name}`);
          }
        }}
        groups={permissionGroups}
        permissions={permissions}
        editingGroup={editingGroup}
      />
    </div>
  );
}

export default PermissionGroupsPage;
