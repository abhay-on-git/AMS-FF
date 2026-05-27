/**
 * Shared UI Components
 * Reusable components that don't belong to a specific feature
 */

import React from "react";
import { cn } from "../../lib/cn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Page Header Component
export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

// Section Header Component
export interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// Empty State Component
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {icon && (
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

// Loading Skeleton Component
export interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({
  rows = 5,
  className,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-12 bg-muted rounded animate-pulse"
        />
      ))}
    </div>
  );
}

// Data Table Row Component
export interface DataTableRowProps {
  cells: React.ReactNode[];
  className?: string;
  onClick?: () => void;
}

export function DataTableRow({ cells, className, onClick }: DataTableRowProps) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {cells.map((cell, index) => (
        <td key={index} className="px-4 py-3">
          {cell}
        </td>
      ))}
    </tr>
  );
}

// Status Badge Component
export type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "success"
  | "warning"
  | "error"
  | "draft";

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  active: "bg-green-500/10 text-green-700 border-green-200",
  inactive: "bg-gray-500/10 text-gray-700 border-gray-200",
  pending: "bg-blue-500/10 text-blue-700 border-blue-200",
  success: "bg-green-500/10 text-green-700 border-green-200",
  warning: "bg-amber-500/10 text-amber-700 border-amber-200",
  error: "bg-red-500/10 text-red-700 border-red-200",
  draft: "bg-gray-500/10 text-gray-700 border-gray-200",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(statusStyles[status], className)}
    >
      {label || status}
    </Badge>
  );
}

// Quick Filter Component
export interface QuickFilterOption {
  value: string;
  label: string;
}

export interface QuickFilterProps {
  options: QuickFilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function QuickFilter({
  options,
  value,
  onChange,
  placeholder = "Filter...",
  className,
}: QuickFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Search Input Component
export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn("max-w-xs", className)}
    />
  );
}

// Stat Card Component
export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  up?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  up,
  icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {change && (
              <p
                className={cn(
                  "text-sm mt-1",
                  up ? "text-green-600" : "text-muted-foreground"
                )}
              >
                {change}
              </p>
            )}
          </div>
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Info Row Component
export interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  className?: string;
}

export function InfoRow({ label, value, mono, className }: InfoRowProps) {
  return (
    <div className={cn("flex items-start gap-3 py-2", className)}>
      <Label className="text-muted-foreground text-sm min-w-[120px]">
        {label}
      </Label>
      <p className={cn(mono && "font-mono text-sm")}>
        {value || "—"}
      </p>
    </div>
  );
}

// Confirm Dialog Helper
export interface ConfirmDialogState {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
}

export function createConfirmDialogState(): ConfirmDialogState {
  return {
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    variant: "default",
  };
}
