/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CLASS NAME UTILITY (cn)
 * Combines clsx and tailwind-merge for optimal className generation
 *
 * WHY: Repeated Tailwind classes in component props are:
 *   - Error-prone (typos, inconsistency)
 *   - Hard to maintain
 *   - Contradict DRY principles
 *
 * ENTERPRISE BENEFIT:
 *   - Merges Tailwind classes intelligently
 *   - Handles conditional classes cleanly
 *   - Prevents conflicting className overrides
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export default cn;