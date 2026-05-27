import { ArrowBack as ArrowLeft } from '@mui/icons-material';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface DetailPageLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  onBack?: () => void;
  headerActions?: React.ReactNode;
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  bottomSections?: React.ReactNode;
}

export default function DetailPageLayout({
  title,
  subtitle,
  breadcrumbs = [],
  onBack,
  headerActions,
  leftColumn,
  rightColumn,
  bottomSections
}: DetailPageLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb>
          
        </Breadcrumb>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>
        {headerActions && <div className="flex gap-2">{headerActions}</div>}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Information */}
        <div className="space-y-6">
          {leftColumn}
        </div>

        {/* Right column - Actions */}
        <div className="space-y-6">
          {rightColumn}
        </div>
      </div>

      {/* Bottom sections (full width) */}
      {bottomSections && (
        <div className="space-y-6">
          {bottomSections}
        </div>
      )}
    </div>
  );
}
