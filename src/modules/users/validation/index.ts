// src/modules/users/validation/index.ts

import type { User, Role, PermissionGroup, PasswordPolicy } from "../types";

export const validateEmail = (email: string, users: User[], currentUserId?: string): string | null => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email address";
  
  const isDuplicate = users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== currentUserId);
  if (isDuplicate) return "Email address must be unique";
  
  return null;
};
export const validatePhone = (phone: string, users: User[], currentUserId?: string): string | null => {
  if (!phone) return "Phone number is required";
  if (!/^\+?[\d\s\-().]{10,20}$/.test(phone)) return "Invalid phone number";
  
  const isDuplicate = users.some(u => u.mobileNumber.toLowerCase() === phone.toLowerCase() && u.id !== currentUserId);
  if (isDuplicate) return "Phone number already registered";
  
  return null;
};

export const validateRoleName = (name: string, roles: Role[], currentRoleId?: string): string | null => {
  if (!name.trim()) return "Role name is required";
  
  const isDuplicate = roles.some(r => r.roleName.toLowerCase() === name.trim().toLowerCase() && r.id !== currentRoleId);
  if (isDuplicate) return "Role name must be unique";
  
  return null;
};

export const validateGroupName = (name: string, groups: PermissionGroup[], currentGroupId?: string): string | null => {
  if (!name.trim()) return "Permission Group name is required";
  
  const isDuplicate = groups.some(g => g.name.toLowerCase() === name.trim().toLowerCase() && g.id !== currentGroupId);
  if (isDuplicate) return "Permission Group name must be unique";
  
  return null;
};

export const validatePassword = (password: string, policy: PasswordPolicy): string[] => {
  const errors: string[] = [];
  
  if (password.length < policy.minimumLength) {
    errors.push(`Password must be at least ${policy.minimumLength} characters long`);
  }
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (policy.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return errors;
};
