// src/modules/security/validation/index.ts

/**
 * Validates standard IPv4 addresses and CIDR notation (e.g., 192.168.1.1 or 10.0.0.0/8)
 */
export function validateIpAddress(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const cidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(?:[0-9]|[1-2][0-9]|3[0-2])$/;
  return ipv4Regex.test(ip) || cidrRegex.test(ip);
}

/**
 * Validates minimum password length meets platform standard
 */
export function validatePasswordLength(length: number): string | null {
  if (length < 8) {
    return "Minimum password length must be at least 8 characters.";
  }
  if (length > 128) {
    return "Password length cannot exceed 128 characters.";
  }
  return null;
}

/**
 * Validates session timeout is positive
 */
export function validateTimeout(minutes: number): string | null {
  if (minutes <= 0) {
    return "Session timeout must be greater than zero minutes.";
  }
  if (minutes > 1440) {
    return "Session timeout cannot exceed 24 hours (1440 minutes).";
  }
  return null;
}

/**
 * Validates failed login threshold is positive
 */
export function validateFailedLimit(limit: number): string | null {
  if (limit < 1) {
    return "Failed login lock threshold must be at least 1 attempt.";
  }
  if (limit > 20) {
    return "Failed login threshold cannot exceed 20 attempts.";
  }
  return null;
}
