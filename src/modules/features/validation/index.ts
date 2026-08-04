import type { Module, FeatureFlag, Release } from "../types";

/**
 * Validates if a module name is unique among existing modules.
 */
export function validateModuleNameUnique(name: string, modules: Module[], currentModuleId?: string): boolean {
  return !modules.some(
    (m) => m.name.trim().toLowerCase() === name.trim().toLowerCase() && m.id !== currentModuleId
  );
}

/**
 * Validates if a feature flag name is unique within its module.
 */
export function validateFeatureNameUnique(
  name: string,
  moduleName: string,
  featureFlags: FeatureFlag[],
  currentFeatureId?: string
): boolean {
  return !featureFlags.some(
    (f) =>
      f.name.trim().toLowerCase() === name.trim().toLowerCase() &&
      f.moduleName === moduleName &&
      f.id !== currentFeatureId
  );
}

/**
 * Validates if a rollout percentage is within the bounds [0, 100].
 */
export function validateRolloutPercentage(percentage: number): boolean {
  return percentage >= 0 && percentage <= 100;
}

/**
 * Validates if a release version is unique among existing releases.
 */
export function validateReleaseVersionUnique(
  versionNumber: string,
  releases: Release[],
  currentReleaseId?: string
): boolean {
  return !releases.some(
    (r) =>
      r.versionNumber.trim().toLowerCase() === versionNumber.trim().toLowerCase() &&
      r.id !== currentReleaseId
  );
}

/**
 * Validates if a release date is not in the past.
 * Expects date in "YYYY-MM-DD" format or similar parsable formats.
 */
export function validateReleaseDateNotInPast(dateStr: string): boolean {
  const inputDate = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
}

/**
 * Validates if the kill switch can be applied (only to active releases).
 */
export function validateCanApplyKillSwitch(release: Release): boolean {
  return release.status === "active";
}
