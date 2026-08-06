// src/routes/UserRoutes.tsx

import { lazy } from "react";
import { Route } from "react-router-dom";
import { UserLayout } from "@/modules/users/pages/UserLayout";

const UsersPage = lazy(() => import("@/modules/users/pages/UsersPage"));
const RolesPage = lazy(() => import("@/modules/users/pages/RolesPage"));
const PermissionGroupsPage = lazy(() => import("@/modules/users/pages/PermissionGroupsPage"));
const PermissionsPage = lazy(() => import("@/modules/users/pages/PermissionsPage"));
const RoleAssignmentPage = lazy(() => import("@/modules/users/pages/RoleAssignmentPage"));
const SecurityPoliciesPage = lazy(() => import("@/modules/users/pages/SecurityPoliciesPage"));

export const UserRoutes = (
  <Route path="users" element={<UserLayout />}>
    <Route index element={<UsersPage />} />
    <Route path="roles" element={<RolesPage />} />
    <Route path="permission-groups" element={<PermissionGroupsPage />} />
    <Route path="permissions" element={<PermissionsPage />} />
    <Route path="role-assignment" element={<RoleAssignmentPage />} />
    <Route path="security-policies" element={<SecurityPoliciesPage />} />
  </Route>
);

export default UserRoutes;
