/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DATE UTILITIES
 * Standardized date formatting functions
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  return date.toLocaleDateString("en-US", options || defaultOptions);
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(dateString: string): string {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Calculate days since a date
 */
export function daysSince(dateString: string): number {
  if (!dateString) return 0;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 0;

  return Math.floor(
    (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Calculate relative time string (e.g., "2 hrs ago", "3 days ago")
 */
export function getRelativeTime(dateString: string): string {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return formatDate(dateString);
}

/**
 * Calculate asset age in human-readable format
 */
export function calculateAssetAge(createdDate: string): string {
  if (!createdDate) return "—";

  const created = new Date(createdDate);
  if (isNaN(created.getTime())) return "—";

  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;

  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);

  return remainingMonths > 0 ? `${years}y ${remainingMonths}mo` : `${years}y`;
}