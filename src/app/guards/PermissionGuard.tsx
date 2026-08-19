import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import type { PlatformPermission } from '@/shared/types/auth.types';

interface PermissionGuardProps {
  requiredPermission: PlatformPermission;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermission,
  children,
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(requiredPermission)) {
    return <Navigate to="/403-unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
