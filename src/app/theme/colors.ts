/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COLOR UTILITIES
 * Centralized color functions for consistent status/badge styling
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type StatusColor =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "active"
  | "inactive"
  | "maintenance"
  | "disposed"
  | "missing"
  | "in-transit";

export type ConditionColor = "new" | "good" | "fair" | "poor" | "damaged";

/**
 * Get Tailwind classes for asset status badges
 * WHY: Status colors are used across multiple components
 * ENTERPRISE BENEFIT: Single source of truth for status styling
 */
export function getStatusColorClasses(status: string): string {
  const colorMap: Record<string, string> = {
    active: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
    inactive: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
    maintenance: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700",
    disposed: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
    missing: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
    "in-transit": "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  };

  return colorMap[status] || colorMap.inactive;
}

/**
 * Get Tailwind classes for asset condition badges
 */
export function getConditionColorClasses(condition: string): string {
  const colorMap: Record<string, string> = {
    new: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
    good: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
    fair: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700",
    poor: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700",
    damaged: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
  };

  return colorMap[condition] || colorMap.good;
}

/**
 * Get Tailwind classes for inspection status badges
 */
export function getInspectionStatusColorClasses(status: string): string {
  const colorMap: Record<string, string> = {
    passed: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
    failed: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
    conditional: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700",
    pending: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  };

  return colorMap[status] || colorMap.pending;
}

/**
 * Get color classes for urgency indicators
 */
export function getUrgencyColorClasses(urgency: string): string {
  const colorMap: Record<string, string> = {
    high: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    low: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  };

  return colorMap[urgency] || "bg-gray-500/10 text-gray-700 dark:text-gray-300";
}

/**
 * Get color classes for activity status indicators
 */
export function getActivityColorClasses(status: string): string {
  const colorMap: Record<string, string> = {
    success: "bg-green-500",
    pending: "bg-amber-500",
    warning: "bg-red-500",
    info: "bg-blue-500",
  };

  return colorMap[status] || "bg-gray-400";
}

/**
 * Get lifecycle stage color classes
 */
export function getLifecycleStageColorClasses(stage: string): string {
  const colorMap: Record<string, string> = {
    registered: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
    active: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
    maintenance: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700",
    survey: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
    "pending-disposal": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700",
    disposed: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
  };

  return colorMap[stage] || "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
}

/**
 * Get survey status color classes
 */
export function getSurveyStatusColorClasses(status: string): string {
  const colorMap: Record<string, string> = {
    "not-surveyed": "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600",
    "survey-pending": "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
    surveyed: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
    "recommended-disposal": "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  };

  return colorMap[status] || "bg-gray-500/10 text-gray-600 dark:text-gray-400";
}

/**
 * Format lifecycle stage for display
 */
export function formatLifecycleStage(stage: string): string {
  return stage
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format survey status for display
 */
export function formatSurveyStatus(status: string): string {
  const formatMap: Record<string, string> = {
    "not-surveyed": "Not Surveyed",
    "survey-pending": "Survey Pending",
    surveyed: "Surveyed",
    "recommended-disposal": "Disposal Recommended",
  };

  return formatMap[status] || status;
}