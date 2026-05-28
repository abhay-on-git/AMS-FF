# AMS Frontend — Execution-Ready Refactoring Plan

---

## Revision History

| Version | Date       | Summary                          |
|---------|------------|----------------------------------|
| v1.0    | 2026-05-28 | Initial corrected generation     |

**Document Purpose:**
This document is the single source of truth for the AMS (Asset Management System) frontend refactoring effort. It is designed to be executed phase-by-phase by a developer working in Cursor. Every section contains specific file paths, complete TypeScript implementations, and verifiable acceptance criteria. No section should require external research to execute — all decisions are made, all patterns are defined, and all code examples use real AMS domain types.

---

---

# PHASE 0 — SAFE CLEANUP

**PURPOSE:** Stop the bleeding before any refactoring begins. Can be executed in under 2 hours.

> **SAFETY RULE:** Run `git add -A && git commit -m "snapshot: pre-refactor"` BEFORE executing any deletion. This is your rollback point.

---

## 0.1 — THREE-TIER DELETION LIST

### TIER A — DELETE NOW (safe on day 1, no dependencies)

These paths have **zero runtime imports** from the live application. Deleting them removes confusion and reduces cognitive load immediately.

```
DELETE NOW: src/features/                — 73 files, ~90% byte-identical copies of src/app/components/, zero runtime imports
DELETE NOW: src/pages/                   — 14 one-line re-export wrappers + index.ts, all point to app/components
DELETE NOW: src/layouts/DashboardLayout.tsx — unused copy of Layout.tsx (DetailPageLayout.tsx and index.ts also unused)
DELETE NOW: src/layouts/DetailPageLayout.tsx — unused layout scaffold
DELETE NOW: src/layouts/index.ts         — barrel for unused layouts
DELETE NOW: src/components/              — 66 files in parallel tree, zero @/components imports in live codebase
DELETE NOW: src/schemas/index.ts         — empty placeholder barrel (not the zod schemas in features)
DELETE NOW: src/store/index.ts           — empty placeholder barrel (2 lines, exports nothing)
DELETE NOW: src/config/index.ts          — empty placeholder barrel (exports nothing)
DELETE NOW: src/app/App-2.tsx            — orphan dead file (302 lines, alternate app shell never imported)
DELETE NOW: src/app/imports/             — 8 files of AI markdown clutter + workflow-management.tsx, excluded from TS compilation
DELETE NOW: src/imports/                 — root-level design paste-ins, excluded from TS compilation
DELETE NOW: src/services/               — apiClient.ts imports axios (not installed), authInterceptor.ts, errorHandler.ts, index.ts — zero consumers
```

**Verification after Tier A deletion:**
```bash
npm run build
```
If build passes, commit:
```bash
git add -A && git commit -m "chore: remove dead scaffold (Tier A cleanup)"
```

---

### TIER B — DELETE AFTER PHASE [X] (has a live dependency)

```
DELETE AFTER Phase 1 complete: src/lib/
Verify before deleting: cn.ts and dateFormatter.ts have been moved to src/lib/ in the new
  canonical structure and all 49 shadcn primitives import cn from '@/lib/cn'
Reason: cn.ts is imported by all 49 shadcn primitives in src/app/components/ui/ — deleting
  it now breaks the entire UI kit

DELETE AFTER Phase 4 complete: src/providers/
Verify before deleting: ThemeProvider and LanguageProvider are re-created in the new
  src/providers/ structure and AppProviders.tsx imports from the new canonical paths
Reason: Re-exports ThemeContext + LanguageContext consumed by the live app via
  src/app/providers.tsx

DELETE AFTER Phase 3 complete: src/routes/
Verify before deleting: routeConfig.ts content has been migrated into the new
  src/routes/routeConfig.ts with createBrowserRouter and React Router is wired and rendering
Reason: Contains route definitions and ProtectedRoute/AuthRoute stubs that Phase 3 will
  replace with real implementations

DELETE AFTER Phase 1 audit: src/hooks/index.ts
Verify before deleting: Confirmed that usePagination, useSelection, useToggle, useDebounce,
  useLocalStorage, useAsyncState are either duplicates of src/app/hooks/index.ts or have been
  migrated to the new src/hooks/ canonical location
Reason: Contains 6 hooks (~256 lines) that may have unique implementations not present in
  src/app/hooks/index.ts — audit diff before deleting
```

---

### TIER C — MIGRATE, NEVER BULK DELETE

`src/app/components/*` is the live product. Individual files are retired one-by-one only when their replacement feature module is complete, wired to React Router, and verified.

| Screen File | Replaced By | Safe to Delete After Sprint |
|-------------|-------------|----------------------------|
| `Assets.tsx` (3,400 lines) | `src/features/assets/` | Sprint 5B |
| `ReportingAnalytics.tsx` (4,256 lines) | `src/features/reports/` | Sprint 8 |
| `assets/AssetDetailView.tsx` (2,216 lines) | `src/features/assets/components/AssetDetail.tsx` | Sprint 5B |
| `UserManagement.tsx` (1,978 lines) | `src/features/users/` | Sprint 6 |
| `WorkflowManagement.tsx` (1,671 lines) | `src/features/settings/` | Sprint 8 |
| `Layout.tsx` (1,066 lines) | `src/components/layout/AppShell.tsx` | Sprint 2 |
| `AuthScreen.tsx` (985 lines) | `src/features/auth/` | Sprint 4 |
| `Dashboard.tsx` (1,063 lines) | `src/features/dashboard/` | Sprint 8 |
| `RFIDSettings.tsx` (1,429 lines) | `src/features/settings/` | Sprint 8 |
| `AssetLifecycle.tsx` (1,032 lines) | `src/features/assets/` | Sprint 5B |
| `ActionLog.tsx` (923 lines) | `src/features/audit/` | Sprint 8 |
| `RoleManagement.tsx` (1,170 lines) | `src/features/access/` | Sprint 6 |
| `DraftAssets.tsx` (1,184 lines) | `src/features/inventory/` | Sprint 8 |
| `InventorySheets.tsx` | `src/features/inventory/` | Sprint 8 |
| `FindExtra.tsx` | `src/features/inventory/` | Sprint 8 |
| `Locations.tsx` | `src/features/locations/` | Sprint 8 |
| `FieldOffices.tsx` | `src/features/locations/` | Sprint 8 |
| `Categories.tsx` | `src/features/assets/` | Sprint 8 |
| `Warehouses.tsx` | `src/features/locations/` | Sprint 8 |
| `RequestsCases.tsx` | `src/features/requests/` | Sprint 8 |
| `NotificationCenter.tsx` | `src/features/notifications/` | Sprint 8 |
| `Help.tsx` | `src/features/help/` | Sprint 8 |
| `SystemConfig.tsx` | `src/features/settings/` | Sprint 8 |
| `Integrations.tsx` | `src/features/settings/` | Sprint 8 |
| `ProfilePage.tsx` | `src/features/profile/` | Sprint 8 |
| `UsersAccessManagement.tsx` | `src/features/users/` | Sprint 6 |

---

## 0.2 — DEPENDENCY INSTALLS

**Runtime dependencies:**
```bash
npm install react-router-dom @tanstack/react-query axios zustand
```

**Dev dependencies:**
```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom msw @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh lint-staged husky prettier
```

---

## 0.3 — TSCONFIG TIGHTENING

**Before** (`tsconfig.app.json` lines 13-15):
```json
"strict": true,
"noUnusedLocals": false,
"noUnusedParameters": false,
```

**After:**
```json
"strict": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
```

This will surface dead imports and unused variables immediately. Fix them as they appear — do not suppress with `// @ts-ignore`.

---

## 0.4 — PATH ALIAS ENFORCEMENT

### Canonical @/ alias map

All path aliases resolve through a single `@` → `src` mapping in Vite. The granular `tsconfig.app.json` paths exist for IDE autocompletion only — Vite resolves them all via the single `@` prefix.

**vite.config.ts** (no change needed — already correct):
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Import Rule

**ALL imports use `@/` aliases. Relative `../../` paths beyond one level are banned.**

Valid:
```typescript
import { Button } from '@/app/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/cn'
```

Invalid:
```typescript
import { Button } from '../../components/ui/button'
import { useAuthStore } from '../../../store/authStore'
```

### ESLint enforcement (add to eslint.config.js rules):

```javascript
'no-restricted-imports': ['error', {
  patterns: [
    {
      group: ['../../*', '../../../*'],
      message: 'Use @/ path aliases instead of deep relative imports.'
    }
  ]
}]
```

---

---

# PHASE 1 — ARCHITECTURE BLUEPRINT

---

## 1.1 — CANONICAL FOLDER STRUCTURE

```
src/
├── main.tsx                    # Vite entry — mounts App
├── App.tsx                     # Root component — providers + router
├── components/                 # Shared UI components
│   ├── ui/                     # shadcn/Radix primitives (49 files, moved from app/components/ui/)
│   ├── shared/                 # Composite shared components (PageHeader, StatCard, etc.)
│   ├── layout/                 # AppShell, Sidebar, TopBar
│   └── forms/                  # Form primitives (FormInput, FormSelect, etc.)
├── features/                   # Domain feature modules (one folder per business domain)
│   ├── assets/                 # Asset management feature
│   ├── auth/                   # Authentication feature
│   ├── users/                  # User management feature
│   ├── access/                 # Role & permission management
│   ├── reports/                # Reporting & analytics
│   ├── locations/              # Location hierarchy
│   ├── inventory/              # Inventory sheets, drafts, find-extra
│   ├── settings/               # RFID, workflow, system config, integrations
│   ├── audit/                  # Action log / audit trail
│   ├── requests/               # Transfers, surveys, inspections, disposals
│   ├── notifications/          # Notification center + bell
│   ├── dashboard/              # Dashboard KPIs + charts
│   ├── profile/                # User profile + password change
│   └── help/                   # Help documentation
├── pages/                      # Route-level page components (thin orchestrators)
│   ├── DashboardPage.tsx
│   ├── AssetsPage.tsx
│   ├── AssetDetailPage.tsx
│   ├── UsersPage.tsx
│   ├── RolesPage.tsx
│   ├── ReportsPage.tsx
│   ├── LocationsPage.tsx
│   ├── InventoryPage.tsx
│   ├── SettingsPage.tsx
│   ├── AuditPage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   └── AccessDeniedPage.tsx
├── routes/                     # React Router configuration
│   ├── routeConfig.tsx         # createBrowserRouter definition
│   ├── ProtectedRoute.tsx      # Auth guard
│   ├── AuthRoute.tsx           # Redirect-if-authenticated guard
│   └── RoleGuard.tsx           # Role-based access guard
├── providers/                  # Context providers composition
│   ├── AppProviders.tsx        # Provider tree root
│   ├── ThemeProvider.tsx       # Theme context
│   └── LanguageProvider.tsx    # i18n context
├── store/                      # Zustand stores (client state)
│   ├── authStore.ts            # Authentication state
│   └── uiStore.ts              # UI state (sidebar, drawers, modals)
├── services/                   # API layer (feature-specific services live in features/)
│   └── apiClient.ts            # Axios instance + interceptors
├── hooks/                      # Shared custom hooks
│   ├── useDebounce.ts
│   ├── useTableState.ts
│   ├── useLocalStorage.ts
│   └── usePagination.ts
├── lib/                        # Pure utility functions
│   ├── cn.ts                   # clsx + tailwind-merge
│   ├── queryClient.ts          # TanStack Query client config
│   ├── queryKeys.ts            # Query key factory
│   └── dateFormatter.ts        # Date formatting utils
├── theme/                      # Design token TypeScript mirrors
│   ├── tokens.ts               # Token constants (mirrors CSS vars)
│   └── colors.ts               # Status color helpers
├── types/                      # Shared TypeScript types
│   └── index.ts                # ColumnConfig<T>, ApiResponse<T>, etc.
├── constants/                  # App-wide constants
│   ├── routes.ts               # Route path constants
│   ├── roles.ts                # Role enum/constants
│   └── permissions.ts          # Permission constants
├── schemas/                    # Shared zod schemas (feature-specific live in features/)
│   └── common.ts               # Shared validators (email, phone, etc.)
└── styles/                     # Global CSS
    ├── theme.css               # Tailwind v4 @theme tokens (SOURCE OF TRUTH)
    ├── globals.css             # Global base styles
    ├── fonts.css               # Font imports
    └── index.css               # CSS entry point
```

---

## 1.2 — FEATURE MODULE CONTRACT

Every feature folder follows this internal structure. Using `assets/` as the concrete example:

```
src/features/assets/
├── components/
│   ├── AssetList.tsx              # Main list view with DataTable
│   ├── AssetFilters.tsx           # Filter toolbar for asset list
│   ├── AssetDetail.tsx            # Full asset detail view
│   ├── AssetStats.tsx             # KPI stat cards for asset overview
│   └── drawers/
│       ├── AddAssetDrawer.tsx     # Add new asset form drawer
│       ├── EditAssetDrawer.tsx    # Edit existing asset form drawer
│       ├── TransferDrawer.tsx     # Initiate transfer workflow
│       ├── LifecycleDrawer.tsx    # Change lifecycle status
│       ├── InspectionDrawer.tsx   # Initiate inspection
│       └── DisposalDrawer.tsx     # Initiate disposal
├── hooks/
│   ├── useAssets.ts              # TanStack Query hook for asset list
│   ├── useAssetFilters.ts        # Filter state management
│   ├── useAssetSelection.ts     # Row selection state
│   └── useAssetMutations.ts     # Create/update/delete mutations
├── services/
│   └── assetsService.ts          # API calls for assets resource
├── schemas/
│   └── assetSchemas.ts           # Zod schemas for asset forms
├── types/
│   └── index.ts                  # Asset domain types
├── constants/
│   ├── assetColumns.ts           # ColumnConfig<Asset>[] definition
│   └── assetStatuses.ts          # Asset status enum + labels
└── index.ts                      # Public API barrel
```

### Barrel pattern (`index.ts`):

```typescript
// src/features/assets/index.ts
// Public API — explicit named exports only, no wildcard re-exports

export { AssetList } from './components/AssetList'
export { AssetDetail } from './components/AssetDetail'
export { AssetFilters } from './components/AssetFilters'
export { AddAssetDrawer } from './components/drawers/AddAssetDrawer'
export { EditAssetDrawer } from './components/drawers/EditAssetDrawer'
export { TransferDrawer } from './components/drawers/TransferDrawer'
export { useAssets } from './hooks/useAssets'
export { useAssetFilters } from './hooks/useAssetFilters'
export { useAssetMutations } from './hooks/useAssetMutations'
export type { Asset, AssetFormValues, AssetStatus } from './types'
```

**Rules:**
- NO wildcard re-exports (`export * from './components'` is banned)
- Only export what other modules need — internal helpers stay private
- Pages import from the barrel: `import { AssetList } from '@/features/assets'`

---

## 1.3 — LAYER DEPENDENCY RULES

```
┌─────────────────────────────────────────────────────────────────┐
│                        IMPORT DIRECTION                          │
│                                                                  │
│  pages/ ──────► features/ ──────► components/                   │
│                     │              hooks/                         │
│                     │              services/                      │
│                     │                  │                          │
│                     ▼                  ▼                          │
│                 lib/, types/, theme/, constants/, store/          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  FORBIDDEN:                                                      │
│  • features/assets/ CANNOT import from features/users/          │
│  • components/ CANNOT import from features/                     │
│  • lib/ CANNOT import from features/ or components/             │
│  • pages/ CANNOT contain business logic (orchestration only)    │
└─────────────────────────────────────────────────────────────────┘
```

**Cross-feature communication:**
- Shared state: Zustand stores in `src/store/`
- Shared UI: Components in `src/components/shared/`
- Shared hooks: Hooks in `src/hooks/`
- Shared types: Types in `src/types/`

Features NEVER import from other features directly. If feature A needs data from feature B, it goes through a shared store or the page orchestrator passes it as props.

---

## 1.4 — FILE SIZE BUDGET

| File Type | Max Lines | Reason |
|-----------|-----------|--------|
| Page component | 150 | Orchestrator only — imports features, composes layout |
| Feature component | 400 | Single responsibility — if exceeding, extract sub-components |
| Hook | 200 | One concern per hook — split if managing multiple resources |
| Service | 150 | One resource per service — CRUD operations only |
| Utility/helper | 100 | Pure functions only — no side effects |
| Zod schema file | 150 | One domain's schemas per file |
| Constants file | 100 | Static data only |

**Enforcement:** PR review rejects any new file over its budget without a decomposition plan in the PR description.

---

## 1.5 — STRANGLER FIG MIGRATION CONTRACT

> ### THE GOLDEN RULE
>
> `src/app/components/[Screen].tsx` is the **LIVE PRODUCT**.
> It is **NEVER** deleted until **ALL FOUR** conditions are true:
>
> 1. Its replacement in `src/features/[domain]/` is **complete**
> 2. The React Router route for it is **wired and rendering correctly**
> 3. `src/pages/[Screen]Page.tsx` imports from `src/features/[domain]/index.ts`
> 4. `npm run build` passes and the screen **renders correctly in browser**
>
> Only when all four are confirmed is the `src/app/components/` file deleted.

> ### THE PARALLEL RUN RULE
>
> During Sprints 1-5, `src/app/components/` and `src/features/` coexist.
> This is intentional. The temporary duplication is **controlled and bounded**.
> Maximum acceptable coexistence: **end of Sprint 5B**.
> After Sprint 8, zero files should remain in `src/app/components/`.

### Migration State Tracker

| Screen File | Replaced By | Sprint | Status |
|-------------|-------------|--------|--------|
| `Assets.tsx` | `features/assets/` | 5B | [ ] Not Started |
| `ReportingAnalytics.tsx` | `features/reports/` | 8 | [ ] Not Started |
| `AssetDetailView.tsx` | `features/assets/` | 5B | [ ] Not Started |
| `UserManagement.tsx` | `features/users/` | 6 | [ ] Not Started |
| `WorkflowManagement.tsx` | `features/settings/` | 8 | [ ] Not Started |
| `Layout.tsx` | `components/layout/AppShell.tsx` | 2 | [ ] Not Started |
| `AuthScreen.tsx` | `features/auth/` | 4 | [ ] Not Started |
| `Dashboard.tsx` | `features/dashboard/` | 8 | [ ] Not Started |
| `RFIDSettings.tsx` | `features/settings/` | 8 | [ ] Not Started |
| `AssetLifecycle.tsx` | `features/assets/` | 5B | [ ] Not Started |
| `ActionLog.tsx` | `features/audit/` | 8 | [ ] Not Started |
| `RoleManagement.tsx` | `features/access/` | 6 | [ ] Not Started |
| `DraftAssets.tsx` | `features/inventory/` | 8 | [ ] Not Started |
| `InventorySheets.tsx` | `features/inventory/` | 8 | [ ] Not Started |
| `Locations.tsx` | `features/locations/` | 8 | [ ] Not Started |
| `NotificationCenter.tsx` | `features/notifications/` | 8 | [ ] Not Started |

---

---

# PHASE 2 — COMPONENT SYSTEM

---

## 2.1 — UI PRIMITIVE LAYER (src/components/ui/)

**Action:** Move all 49 shadcn files from `src/app/components/ui/` to `src/components/ui/` using `git mv` to preserve history.

```bash
git mv src/app/components/ui/* src/components/ui/
```

After move, update the `cn` import in each file. Current:
```typescript
import { cn } from '../lib/cn'  // or similar relative path
```

Updated:
```typescript
import { cn } from '@/lib/cn'
```

Also move `src/app/lib/cn.ts` to `src/lib/cn.ts`:
```bash
git mv src/app/lib/cn.ts src/lib/cn.ts
```

**Verification:** `npm run build` passes after all import paths updated.

---

## 2.2 — SHARED COMPOSITE COMPONENTS (src/components/shared/)

### a) PageHeader

**File:** `src/components/shared/PageHeader.tsx`

```typescript
import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 pb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="h-3 w-3" />}
              {crumb.onClick || crumb.href ? (
                <button
                  onClick={crumb.onClick}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
```

**Usage:**
```typescript
<PageHeader
  title="Asset Management"
  subtitle="Manage and track all organizational assets"
  breadcrumbs={[
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Assets' },
  ]}
  actions={
    <Button onClick={() => setDrawerOpen(true)}>
      <Plus className="h-4 w-4 mr-2" /> Add Asset
    </Button>
  }
/>
```

---

### b) PageShell

**File:** `src/components/shared/PageShell.tsx`

```typescript
import { ReactNode } from 'react'
import { PageHeader } from './PageHeader'
import { Loader2 } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; href?: string; onClick?: () => void }[]
  actions?: ReactNode
}

interface PageShellProps {
  header: PageHeaderProps
  children: ReactNode
  isLoading?: boolean
  isEmpty?: boolean
  emptyState?: ReactNode
}

export function PageShell({
  header,
  children,
  isLoading,
  isEmpty,
  emptyState,
}: PageShellProps) {
  return (
    <div className="flex flex-col h-full p-6">
      <PageHeader {...header} />
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isEmpty && emptyState ? (
          emptyState
        ) : (
          children
        )}
      </div>
    </div>
  )
}
```

**Usage:**
```typescript
<PageShell
  header={{ title: 'Assets', actions: <AddButton /> }}
  isLoading={isLoading}
  isEmpty={assets.length === 0}
  emptyState={<EmptyState title="No assets found" />}
>
  <AssetList data={assets} />
</PageShell>
```

---

### c) StatCard

**File:** `src/components/shared/StatCard.tsx`

```typescript
import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon?: ReactNode
  isLoading?: boolean
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    )
  }

  const changeColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground',
  }

  const ChangeIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  }[changeType]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <span className="text-muted-foreground">{icon}</span>}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <span className={cn('flex items-center text-xs font-medium', changeColors[changeType])}>
              <ChangeIcon className="h-3 w-3 mr-0.5" />
              {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Usage:**
```typescript
<StatCard
  title="Total Assets"
  value={12847}
  change="+12.5%"
  changeType="up"
  icon={<Package className="h-4 w-4" />}
/>
```

---

### d) FilterToolbar

**File:** `src/components/shared/FilterToolbar.tsx`

```typescript
import { ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface FilterChip {
  key: string
  label: string
  value: string
  onRemove: () => void
}

interface FilterToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters?: FilterChip[]
  onClearAll?: () => void
  actions?: ReactNode
  resultCount?: number
}

export function FilterToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  onClearAll,
  actions,
  resultCount,
}: FilterToolbarProps) {
  const hasActiveFilters = filters && filters.length > 0

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
        {actions && <div className="flex items-center gap-2 ml-auto">{actions}</div>}
      </div>
      {(hasActiveFilters || resultCount !== undefined) && (
        <div className="flex items-center gap-2 flex-wrap">
          {resultCount !== undefined && (
            <span className="text-sm text-muted-foreground">
              {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>
          )}
          {filters?.map((filter) => (
            <Badge key={filter.key} variant="secondary" className="gap-1">
              {filter.label}: {filter.value}
              <button onClick={filter.onRemove} className="ml-1 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {hasActiveFilters && onClearAll && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
```

**Usage:**
```typescript
<FilterToolbar
  search={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Search assets..."
  filters={activeFilters}
  onClearAll={clearAllFilters}
  resultCount={filteredAssets.length}
  actions={
    <>
      <ColumnVisibilityToggle />
      <ExportButton />
    </>
  }
/>
```

---

### e) DrawerFormFooter

**File:** `src/components/shared/DrawerFormFooter.tsx`

```typescript
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface DrawerFormFooterProps {
  onCancel: () => void
  onSubmit: () => void
  isSubmitting: boolean
  submitLabel?: string
  cancelLabel?: string
  isDestructive?: boolean
}

export function DrawerFormFooter({
  onCancel,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isDestructive = false,
}: DrawerFormFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
      <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
        {cancelLabel}
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        variant={isDestructive ? 'destructive' : 'default'}
      >
        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  )
}
```

**Usage:**
```typescript
<DrawerFormFooter
  onCancel={() => setOpen(false)}
  onSubmit={handleSubmit(onFormSubmit)}
  isSubmitting={mutation.isPending}
  submitLabel="Create Asset"
/>
```

---

### f) EmptyState

**File:** `src/components/shared/EmptyState.tsx`

```typescript
import { ReactNode } from 'react'
import { FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        {icon || <FolderOpen className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}
```

**Usage:**
```typescript
<EmptyState
  title="No assets found"
  description="Try adjusting your search or filter criteria"
  action={{ label: 'Clear Filters', onClick: clearFilters }}
/>
```

---

### g) ConfirmDialog

**File:** `src/components/shared/ConfirmDialog.tsx`

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  isDestructive?: boolean
  isLoading?: boolean
  confirmLabel?: string
  cancelLabel?: string
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isDestructive = false,
  isLoading = false,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(isDestructive && 'bg-destructive text-destructive-foreground hover:bg-destructive/90')}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

**Usage:**
```typescript
<ConfirmDialog
  open={showDeleteDialog}
  onOpenChange={setShowDeleteDialog}
  title="Delete Asset"
  description="This action cannot be undone. The asset will be permanently removed."
  onConfirm={handleDelete}
  isDestructive
  isLoading={deleteMutation.isPending}
  confirmLabel="Delete"
/>
```

---

### h) StatusBadge

**File:** `src/components/shared/StatusBadge.tsx`

```typescript
import { cn } from '@/lib/cn'

type AssetStatus =
  | 'active'
  | 'inactive'
  | 'maintenance'
  | 'disposed'
  | 'transferred'
  | 'in-transit'
  | 'pending'
  | 'draft'

type BadgeSize = 'sm' | 'md' | 'lg'

interface StatusBadgeProps {
  status: AssetStatus | string
  size?: BadgeSize
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  inactive: 'bg-muted text-muted-foreground border-border',
  maintenance: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  disposed: 'bg-red-50 text-red-700 border-red-200',
  transferred: 'bg-blue-50 text-blue-700 border-blue-200',
  'in-transit': 'bg-orange-50 text-orange-700 border-orange-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  draft: 'bg-muted text-muted-foreground border-border',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
  lg: 'text-sm px-2.5 py-1',
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-')
  const colors = statusStyles[normalizedStatus] || statusStyles.inactive

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium capitalize',
        colors,
        sizeStyles[size]
      )}
    >
      {status.replace(/-/g, ' ')}
    </span>
  )
}
```

**Usage:**
```typescript
<StatusBadge status="active" size="md" />
<StatusBadge status="maintenance" size="sm" />
```

---

### i) SectionTitle

**File:** `src/components/shared/SectionTitle.tsx`

```typescript
import { cn } from '@/lib/cn'
import { Separator } from '@/components/ui/separator'

interface SectionTitleProps {
  title: string
  description?: string
  divider?: boolean
}

export function SectionTitle({ title, description, divider = true }: SectionTitleProps) {
  return (
    <div className={cn('pb-4', divider && 'border-b border-border mb-4')}>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      )}
    </div>
  )
}
```

**Usage:**
```typescript
<SectionTitle
  title="Asset Details"
  description="Basic information about this asset"
/>
```

---

## 2.3 — FORM ARCHITECTURE

### a) Base FormField wrapper

**File:** `src/components/forms/FormField.tsx`

```typescript
import { ReactNode } from 'react'
import {
  Controller,
  FieldValues,
  Path,
  Control,
  FieldError,
} from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/cn'

interface FormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  description?: string
  required?: boolean
  children: (field: {
    value: unknown
    onChange: (...event: unknown[]) => void
    onBlur: () => void
    ref: React.Ref<unknown>
    error?: FieldError
  }) => ReactNode
}

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  children,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          {label && (
            <Label htmlFor={name} className={cn(fieldState.error && 'text-destructive')}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          {children({ ...field, error: fieldState.error })}
          {description && !fieldState.error && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {fieldState.error && (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}
```

---

### b) Form Primitives

**File:** `src/components/forms/FormInput.tsx`

```typescript
import { FieldValues, Path, Control } from 'react-hook-form'
import { FormField } from './FormField'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'

interface FormInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
  description?: string
  disabled?: boolean
}

export function FormInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  required,
  description,
  disabled,
}: FormInputProps<TFieldValues>) {
  return (
    <FormField control={control} name={name} label={label} required={required} description={description}>
      {({ value, onChange, onBlur, ref, error }) => (
        <Input
          ref={ref as React.Ref<HTMLInputElement>}
          type={type}
          value={(value as string) ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(error && 'border-destructive')}
        />
      )}
    </FormField>
  )
}
```

**File:** `src/components/forms/FormSelect.tsx`

```typescript
import { FieldValues, Path, Control } from 'react-hook-form'
import { FormField } from './FormField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectOption {
  label: string
  value: string
}

interface FormSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  placeholder?: string
  options: SelectOption[]
  required?: boolean
  description?: string
  disabled?: boolean
}

export function FormSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  required,
  description,
  disabled,
}: FormSelectProps<TFieldValues>) {
  return (
    <FormField control={control} name={name} label={label} required={required} description={description}>
      {({ value, onChange, error }) => (
        <Select value={value as string} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  )
}
```

**File:** `src/components/forms/FormTextarea.tsx`

```typescript
import { FieldValues, Path, Control } from 'react-hook-form'
import { FormField } from './FormField'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/cn'

interface FormTextareaProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  placeholder?: string
  required?: boolean
  description?: string
  rows?: number
  disabled?: boolean
}

export function FormTextarea<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  description,
  rows = 3,
  disabled,
}: FormTextareaProps<TFieldValues>) {
  return (
    <FormField control={control} name={name} label={label} required={required} description={description}>
      {({ value, onChange, onBlur, ref, error }) => (
        <Textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          value={(value as string) ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={cn(error && 'border-destructive')}
        />
      )}
    </FormField>
  )
}
```

**File:** `src/components/forms/FormDatePicker.tsx`

```typescript
import { FieldValues, Path, Control } from 'react-hook-form'
import { FormField } from './FormField'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'

interface FormDatePickerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  required?: boolean
  description?: string
  disabled?: boolean
  min?: string
  max?: string
}

export function FormDatePicker<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  disabled,
  min,
  max,
}: FormDatePickerProps<TFieldValues>) {
  return (
    <FormField control={control} name={name} label={label} required={required} description={description}>
      {({ value, onChange, onBlur, ref, error }) => (
        <Input
          ref={ref as React.Ref<HTMLInputElement>}
          type="date"
          value={(value as string) ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          min={min}
          max={max}
          className={cn(error && 'border-destructive')}
        />
      )}
    </FormField>
  )
}
```

**File:** `src/components/forms/FormCheckbox.tsx`

```typescript
import { FieldValues, Path, Control } from 'react-hook-form'
import { FormField } from './FormField'
import { Checkbox } from '@/components/ui/checkbox'

interface FormCheckboxProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  description?: string
  disabled?: boolean
}

export function FormCheckbox<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
}: FormCheckboxProps<TFieldValues>) {
  return (
    <FormField control={control} name={name} description={description}>
      {({ value, onChange }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={value as boolean}
            onCheckedChange={onChange}
            disabled={disabled}
          />
          {label && <span className="text-sm text-foreground">{label}</span>}
        </div>
      )}
    </FormField>
  )
}
```

**File:** `src/components/forms/FormRadioGroup.tsx`

```typescript
import { FieldValues, Path, Control } from 'react-hook-form'
import { FormField } from './FormField'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface RadioOption {
  label: string
  value: string
  description?: string
}

interface FormRadioGroupProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  options: RadioOption[]
  required?: boolean
  description?: string
  disabled?: boolean
}

export function FormRadioGroup<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  required,
  description,
  disabled,
}: FormRadioGroupProps<TFieldValues>) {
  return (
    <FormField control={control} name={name} label={label} required={required} description={description}>
      {({ value, onChange }) => (
        <RadioGroup
          value={value as string}
          onValueChange={onChange}
          disabled={disabled}
          className="space-y-2"
        >
          {options.map((opt) => (
            <div key={opt.value} className="flex items-start gap-2">
              <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
              <div>
                <Label htmlFor={`${name}-${opt.value}`} className="text-sm font-normal">
                  {opt.label}
                </Label>
                {opt.description && (
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                )}
              </div>
            </div>
          ))}
        </RadioGroup>
      )}
    </FormField>
  )
}
```

---

### c) PasswordStrengthIndicator

**File:** `src/components/shared/PasswordStrengthIndicator.tsx`

This replaces **4 duplicate implementations** scattered across AuthScreen and features/auth.

```typescript
import { useMemo } from 'react'
import { cn } from '@/lib/cn'

interface PasswordStrengthIndicatorProps {
  password: string
}

type StrengthLevel = 'empty' | 'weak' | 'fair' | 'good' | 'strong'

interface StrengthResult {
  level: StrengthLevel
  score: number
  label: string
  checks: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecial: boolean
  }
}

function calculateStrength(password: string): StrengthResult {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }

  const score = Object.values(checks).filter(Boolean).length

  if (password.length === 0) return { level: 'empty', score: 0, label: '', checks }
  if (score <= 2) return { level: 'weak', score, label: 'Weak', checks }
  if (score === 3) return { level: 'fair', score, label: 'Fair', checks }
  if (score === 4) return { level: 'good', score, label: 'Good', checks }
  return { level: 'strong', score, label: 'Strong', checks }
}

const strengthColors: Record<StrengthLevel, string> = {
  empty: 'bg-muted',
  weak: 'bg-red-500',
  fair: 'bg-yellow-500',
  good: 'bg-blue-500',
  strong: 'bg-green-500',
}

const strengthTextColors: Record<StrengthLevel, string> = {
  empty: 'text-muted-foreground',
  weak: 'text-red-600',
  fair: 'text-yellow-600',
  good: 'text-blue-600',
  strong: 'text-green-600',
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculateStrength(password), [password])

  if (strength.level === 'empty') return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((bar) => (
            <div
              key={bar}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                bar <= strength.score ? strengthColors[strength.level] : 'bg-muted'
              )}
            />
          ))}
        </div>
        <span className={cn('text-xs font-medium', strengthTextColors[strength.level])}>
          {strength.label}
        </span>
      </div>
      <ul className="space-y-1">
        {[
          { key: 'minLength', label: 'At least 8 characters' },
          { key: 'hasUppercase', label: 'One uppercase letter' },
          { key: 'hasLowercase', label: 'One lowercase letter' },
          { key: 'hasNumber', label: 'One number' },
          { key: 'hasSpecial', label: 'One special character' },
        ].map(({ key, label }) => (
          <li
            key={key}
            className={cn(
              'text-xs flex items-center gap-1.5',
              strength.checks[key as keyof typeof strength.checks]
                ? 'text-green-600'
                : 'text-muted-foreground'
            )}
          >
            <span>{strength.checks[key as keyof typeof strength.checks] ? '✓' : '○'}</span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

### d) Complete AssetAddForm Example

**File:** `src/features/assets/components/drawers/AddAssetDrawer.tsx`

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { FormInput } from '@/components/forms/FormInput'
import { FormSelect } from '@/components/forms/FormSelect'
import { FormTextarea } from '@/components/forms/FormTextarea'
import { FormDatePicker } from '@/components/forms/FormDatePicker'
import { DrawerFormFooter } from '@/components/shared/DrawerFormFooter'
import { assetFormSchema, type AssetFormValues } from '../../schemas/assetSchemas'
import { useAssetMutations } from '../../hooks/useAssetMutations'

interface AddAssetDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const conditionOptions = [
  { label: 'New', value: 'new' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Poor', value: 'poor' },
]

const categoryOptions = [
  { label: 'IT Equipment', value: 'it-equipment' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Vehicles', value: 'vehicles' },
  { label: 'Machinery', value: 'machinery' },
]

export function AddAssetDrawer({ open, onOpenChange }: AddAssetDrawerProps) {
  const { createAsset } = useAssetMutations()

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      condition: '',
      acquisitionDate: '',
      acquisitionCost: '',
      serialNumber: '',
      location: '',
    },
  })

  async function onSubmit(data: AssetFormValues) {
    try {
      await createAsset.mutateAsync(data)
      toast.success('Asset created successfully')
      form.reset()
      onOpenChange(false)
    } catch {
      toast.error('Failed to create asset. Please try again.')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Asset</SheetTitle>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormInput control={form.control} name="name" label="Asset Name" required placeholder="Enter asset name" />
          <FormTextarea control={form.control} name="description" label="Description" placeholder="Describe the asset..." />
          <FormSelect control={form.control} name="category" label="Category" required options={categoryOptions} placeholder="Select category" />
          <FormSelect control={form.control} name="condition" label="Condition" required options={conditionOptions} placeholder="Select condition" />
          <FormInput control={form.control} name="serialNumber" label="Serial Number" placeholder="e.g. SN-2024-001" />
          <FormInput control={form.control} name="location" label="Location" placeholder="Building / Floor / Room" />
          <FormDatePicker control={form.control} name="acquisitionDate" label="Acquisition Date" required />
          <FormInput control={form.control} name="acquisitionCost" label="Acquisition Cost" type="number" placeholder="0.00" />
          <DrawerFormFooter
            onCancel={() => onOpenChange(false)}
            onSubmit={form.handleSubmit(onSubmit)}
            isSubmitting={createAsset.isPending}
            submitLabel="Create Asset"
          />
        </form>
      </SheetContent>
    </Sheet>
  )
}
```

---

### e) Zod Schema Convention

**File location:** `src/features/[feature]/schemas/[feature]Schemas.ts`

**Example:** `src/features/assets/schemas/assetSchemas.ts`

```typescript
import { z } from 'zod'

export const assetFormSchema = z.object({
  name: z.string().min(1, 'Asset name is required').max(200),
  description: z.string().max(1000).optional().default(''),
  category: z.string().min(1, 'Category is required'),
  condition: z.string().min(1, 'Condition is required'),
  serialNumber: z.string().optional().default(''),
  location: z.string().optional().default(''),
  acquisitionDate: z.string().min(1, 'Acquisition date is required'),
  acquisitionCost: z.string().optional().default(''),
})

export type AssetFormValues = z.infer<typeof assetFormSchema>

export const assetTransferSchema = z.object({
  assetId: z.string().min(1),
  fromLocation: z.string().min(1, 'Source location is required'),
  toLocation: z.string().min(1, 'Destination location is required'),
  reason: z.string().min(1, 'Transfer reason is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  notes: z.string().optional().default(''),
})

export type AssetTransferValues = z.infer<typeof assetTransferSchema>
```

---

## 2.4 — TABLE ARCHITECTURE

> **SINGLE SOURCE OF TRUTH RULE:**
> `ColumnConfig<T>` is defined ONCE at `src/types/index.ts` lines 104-111.
> It is NEVER redefined in component files or feature folders.

Existing definition:
```typescript
export interface ColumnConfig<T = unknown> {
  key: string;
  label: string;
  visible?: boolean;
  sortable?: boolean;
  width?: string;
  render?: (row: T) => React.ReactNode;
}
```

Feature-specific column definitions reference this type:
```typescript
// src/features/assets/constants/assetColumns.ts
import { ColumnConfig } from '@/types'
import { Asset } from '../types'
import { StatusBadge } from '@/components/shared/StatusBadge'

export const assetColumns: ColumnConfig<Asset>[] = [
  { key: 'name', label: 'Asset Name', sortable: true },
  { key: 'serialNumber', label: 'Serial Number', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'condition', label: 'Condition', sortable: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'acquisitionDate', label: 'Acquired', sortable: true },
]
```

---

### a) DataTable<TData>

**File:** `src/components/shared/DataTable.tsx`

```typescript
import { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/cn'
import type { ColumnConfig } from '@/types'

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnConfig<TData>[]
  isLoading?: boolean
  isEmpty?: boolean
  emptyState?: ReactNode
  onRowClick?: (row: TData) => void
  selectedRows?: Set<string>
  onSelectionChange?: (selected: Set<string>) => void
  rowKey?: keyof TData | ((row: TData) => string)
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
  caption?: string
}

export function DataTable<TData>({
  data,
  columns,
  isLoading,
  isEmpty,
  emptyState,
  onRowClick,
  selectedRows,
  onSelectionChange,
  rowKey = 'id' as keyof TData,
  sortKey,
  sortDirection,
  onSort,
  caption,
}: DataTableProps<TData>) {
  const visibleColumns = columns.filter((col) => col.visible !== false)
  const hasSelection = !!onSelectionChange

  function getRowId(row: TData): string {
    if (typeof rowKey === 'function') return rowKey(row)
    return String(row[rowKey])
  }

  function handleSelectAll(checked: boolean) {
    if (!onSelectionChange) return
    if (checked) {
      onSelectionChange(new Set(data.map(getRowId)))
    } else {
      onSelectionChange(new Set())
    }
  }

  function handleSelectRow(id: string, checked: boolean) {
    if (!onSelectionChange || !selectedRows) return
    const next = new Set(selectedRows)
    if (checked) next.add(id)
    else next.delete(id)
    onSelectionChange(next)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (isEmpty || data.length === 0) {
    return emptyState || <EmptyState title="No data found" />
  }

  const allSelected = data.length > 0 && selectedRows?.size === data.length

  return (
    <div className="rounded-md border border-border">
      <Table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <TableHeader>
          <TableRow>
            {hasSelection && (
              <TableHead className="w-12">
                <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
            )}
            {visibleColumns.map((col) => (
              <TableHead
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(col.sortable && 'cursor-pointer select-none')}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key ? (
                    sortDirection === 'asc' ? (
                      <ArrowUp className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5" />
                    )
                  ) : col.sortable ? (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                  ) : null}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const id = getRowId(row)
            const isSelected = selectedRows?.has(id)
            return (
              <TableRow
                key={id}
                className={cn(
                  onRowClick && 'cursor-pointer',
                  isSelected && 'bg-muted/50'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {hasSelection && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectRow(id, !!checked)}
                    />
                  </TableCell>
                )}
                {visibleColumns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
```

---

### b) useTableState hook

**File:** `src/hooks/useTableState.ts`

```typescript
import { useState, useCallback, useMemo } from 'react'

interface TableState<T> {
  page: number
  pageSize: number
  sortKey: string
  sortDirection: 'asc' | 'desc'
  selectedRows: Set<string>
  paginatedData: T[]
  totalPages: number
}

interface TableActions {
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  toggleSort: (key: string) => void
  setSelectedRows: (rows: Set<string>) => void
  clearSelection: () => void
  selectAll: (ids: string[]) => void
}

interface UseTableStateOptions {
  defaultPageSize?: number
  defaultSortKey?: string
  defaultSortDirection?: 'asc' | 'desc'
}

export function useTableState<T>(
  data: T[],
  options: UseTableStateOptions = {}
): TableState<T> & TableActions {
  const {
    defaultPageSize = 10,
    defaultSortKey = '',
    defaultSortDirection = 'asc',
  } = options

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [sortKey, setSortKey] = useState(defaultSortKey)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  const toggleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
    setPage(1)
  }, [sortKey])

  const sortedData = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey]
      const bVal = (b as Record<string, unknown>)[sortKey]
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return sortDirection === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, page, pageSize])

  const clearSelection = useCallback(() => setSelectedRows(new Set()), [])
  const selectAll = useCallback((ids: string[]) => setSelectedRows(new Set(ids)), [])

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  return {
    page,
    pageSize,
    sortKey,
    sortDirection,
    selectedRows,
    paginatedData,
    totalPages,
    setPage,
    setPageSize: handleSetPageSize,
    toggleSort,
    setSelectedRows,
    clearSelection,
    selectAll,
  }
}
```

---

### c) TableToolbar

**File:** `src/components/shared/TableToolbar.tsx`

```typescript
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ColumnConfig } from '@/types'

interface TableToolbarProps<T> {
  search: string
  onSearch: (value: string) => void
  searchPlaceholder?: string
  columns?: ColumnConfig<T>[]
  onColumnVisibilityChange?: (key: string, visible: boolean) => void
  actions?: React.ReactNode
}

export function TableToolbar<T>({
  search,
  onSearch,
  searchPlaceholder = 'Search...',
  columns,
  onColumnVisibilityChange,
  actions,
}: TableToolbarProps<T>) {
  return (
    <div className="flex items-center gap-3 pb-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9 pr-8"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
      {columns && onColumnVisibilityChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.key}
                checked={col.visible !== false}
                onCheckedChange={(checked) =>
                  onColumnVisibilityChange(col.key, checked)
                }
              >
                {col.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {actions}
    </div>
  )
}
```

---

### d) Before/After Migration Example

**BEFORE** — UserManagement.tsx inline table pattern (excerpt):

```typescript
// ~200 lines of inline table in UserManagement.tsx
const [users, setUsers] = useState(mockUsers)
const [page, setPage] = useState(1)
const [pageSize, setPageSize] = useState(10)
const [sortKey, setSortKey] = useState('name')
const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
const [selectedUsers, setSelectedUsers] = useState<string[]>([])
const [searchTerm, setSearchTerm] = useState('')

const filteredUsers = users.filter(u =>
  u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  u.email.toLowerCase().includes(searchTerm.toLowerCase())
)
const sorted = [...filteredUsers].sort(/* inline sort logic */)
const paginated = paginateData(sorted, page, pageSize)

return (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead><Checkbox /></TableHead>
        <TableHead onClick={() => handleSort('name')}>Name</TableHead>
        <TableHead onClick={() => handleSort('email')}>Email</TableHead>
        {/* ...8 more columns */}
      </TableRow>
    </TableHeader>
    <TableBody>
      {paginated.map(user => (
        <TableRow key={user.id}>
          <TableCell><Checkbox /></TableCell>
          <TableCell>{user.name}</TableCell>
          {/* ...manually rendered cells */}
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
```

**AFTER** — Same screen using `DataTable<User>` + `useTableState`:

```typescript
// src/features/users/components/UserList.tsx — ~60 lines
import { useMemo } from 'react'
import { DataTable } from '@/components/shared/DataTable'
import { TableToolbar } from '@/components/shared/TableToolbar'
import { useTableState } from '@/hooks/useTableState'
import { useDebounce } from '@/hooks/useDebounce'
import { userColumns } from '../constants/userColumns'
import { useUsers } from '../hooks/useUsers'

export function UserList() {
  const { data: users = [], isLoading } = useUsers()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const filtered = useMemo(
    () => users.filter(u =>
      u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    ),
    [users, debouncedSearch]
  )

  const table = useTableState(filtered, { defaultSortKey: 'name' })

  return (
    <>
      <TableToolbar search={search} onSearch={setSearch} searchPlaceholder="Search users..." />
      <DataTable
        data={table.paginatedData}
        columns={userColumns}
        isLoading={isLoading}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSort={table.toggleSort}
        selectedRows={table.selectedRows}
        onSelectionChange={table.setSelectedRows}
        onRowClick={(user) => navigate(`/users/${user.id}`)}
      />
    </>
  )
}
```

---

## 2.5 — GOD COMPONENT DECOMPOSITION

### COMPONENT: Assets.tsx (3,400 lines)
**PROBLEM:** Monolithic file containing list, filters, detail view, 6 drawers, bulk actions, and 52 useState calls — untestable and unmaintainable.
**EXTRACT:**
- `AssetList.tsx`: Table rendering + row actions → `src/features/assets/components/AssetList.tsx`
- `AssetFilters.tsx`: Filter toolbar + advanced filter panel → `src/features/assets/components/AssetFilters.tsx`
- `AssetStats.tsx`: KPI stat cards → `src/features/assets/components/AssetStats.tsx`
- `AddAssetDrawer.tsx`: Add form drawer → `src/features/assets/components/drawers/AddAssetDrawer.tsx`
- `EditAssetDrawer.tsx`: Edit form drawer → `src/features/assets/components/drawers/EditAssetDrawer.tsx`
- `TransferDrawer.tsx`: Transfer workflow → `src/features/assets/components/drawers/TransferDrawer.tsx`
- `LifecycleDrawer.tsx`: Status change → `src/features/assets/components/drawers/LifecycleDrawer.tsx`
- `InspectionDrawer.tsx`: Inspection initiation → `src/features/assets/components/drawers/InspectionDrawer.tsx`
- `DisposalDrawer.tsx`: Disposal initiation → `src/features/assets/components/drawers/DisposalDrawer.tsx`
- `useAssets.ts`: Data fetching → `src/features/assets/hooks/useAssets.ts`
- `useAssetFilters.ts`: Filter state → `src/features/assets/hooks/useAssetFilters.ts`
- `useAssetSelection.ts`: Selection state → `src/features/assets/hooks/useAssetSelection.ts`
- `useAssetMutations.ts`: CRUD mutations → `src/features/assets/hooks/useAssetMutations.ts`
- `assetsService.ts`: API calls → `src/features/assets/services/assetsService.ts`
- `assetSchemas.ts`: Validation → `src/features/assets/schemas/assetSchemas.ts`
- `assetColumns.ts`: Column config → `src/features/assets/constants/assetColumns.ts`

**ORCHESTRATOR RESULT:** `AssetsPage.tsx` — target max 80 lines
**PRIORITY:** P1
**SPRINT:** Sprint 5A (list) + Sprint 5B (drawers + detail)

---

### COMPONENT: ReportingAnalytics.tsx (4,256 lines)
**PROBLEM:** Largest file in codebase — contains 10+ chart types, filter panels, data tables, drill-down views, and export logic in one file.
**EXTRACT:**
- `ReportsDashboard.tsx`: Top-level KPI grid → `src/features/reports/components/ReportsDashboard.tsx`
- `AssetDistributionChart.tsx`: Pie/donut chart → `src/features/reports/components/charts/AssetDistributionChart.tsx`
- `TrendLineChart.tsx`: Time series → `src/features/reports/components/charts/TrendLineChart.tsx`
- `CategoryBreakdown.tsx`: Bar chart → `src/features/reports/components/charts/CategoryBreakdown.tsx`
- `LocationHeatmap.tsx`: Geographic distribution → `src/features/reports/components/charts/LocationHeatmap.tsx`
- `ReportsFilter.tsx`: Filter panel → `src/features/reports/components/ReportsFilter.tsx`
- `ReportsTable.tsx`: Tabular data view → `src/features/reports/components/ReportsTable.tsx`
- `ExportPanel.tsx`: Export to CSV/PDF → `src/features/reports/components/ExportPanel.tsx`
- `useReportsData.ts`: Data fetching + aggregation → `src/features/reports/hooks/useReportsData.ts`
- `useReportsFilters.ts`: Filter state → `src/features/reports/hooks/useReportsFilters.ts`
- `reportsService.ts`: API calls → `src/features/reports/services/reportsService.ts`

**ORCHESTRATOR RESULT:** `ReportsPage.tsx` — target max 100 lines
**PRIORITY:** P2
**SPRINT:** Sprint 8

---

### COMPONENT: AssetDetailView.tsx (2,216 lines)
**PROBLEM:** Full asset detail orchestration including tabs, history, lifecycle timeline, related assets, and inline editing — all in one file.
**EXTRACT:**
- `AssetDetail.tsx`: Main detail layout → `src/features/assets/components/AssetDetail.tsx`
- `AssetDetailHeader.tsx`: Title + status + actions → `src/features/assets/components/AssetDetailHeader.tsx`
- `AssetInfoTab.tsx`: Basic info tab → `src/features/assets/components/tabs/AssetInfoTab.tsx`
- `AssetHistoryTab.tsx`: Activity history → `src/features/assets/components/tabs/AssetHistoryTab.tsx`
- `AssetDocumentsTab.tsx`: Documents/attachments → `src/features/assets/components/tabs/AssetDocumentsTab.tsx`
- `AssetLifecycleTimeline.tsx`: Visual timeline → `src/features/assets/components/AssetLifecycleTimeline.tsx`
- `useAssetDetail.ts`: Single asset data → `src/features/assets/hooks/useAssetDetail.ts`

**ORCHESTRATOR RESULT:** `AssetDetailPage.tsx` — target max 60 lines
**PRIORITY:** P1
**SPRINT:** Sprint 5B

---

### COMPONENT: UserManagement.tsx (1,978 lines)
**PROBLEM:** CRUD operations + table + modals + role assignment + bulk actions in one file.
**EXTRACT:**
- `UserList.tsx`: Table + search → `src/features/users/components/UserList.tsx`
- `UserFormDrawer.tsx`: Add/edit user → `src/features/users/components/UserFormDrawer.tsx`
- `UserRoleAssignment.tsx`: Role picker → `src/features/users/components/UserRoleAssignment.tsx`
- `useUsers.ts`: Data fetching → `src/features/users/hooks/useUsers.ts`
- `useUserMutations.ts`: CRUD → `src/features/users/hooks/useUserMutations.ts`
- `usersService.ts`: API → `src/features/users/services/usersService.ts`
- `userSchemas.ts`: Validation → `src/features/users/schemas/userSchemas.ts`
- `userColumns.ts`: Column config → `src/features/users/constants/userColumns.ts`

**ORCHESTRATOR RESULT:** `UsersPage.tsx` — target max 80 lines
**PRIORITY:** P1
**SPRINT:** Sprint 6

---

### COMPONENT: WorkflowManagement.tsx (1,671 lines)
**PROBLEM:** Multi-tab workflow configuration (approval chains, escalation rules, SLA settings) with inline forms in one file.
**EXTRACT:**
- `WorkflowList.tsx`: Workflow table → `src/features/settings/components/workflow/WorkflowList.tsx`
- `ApprovalChainEditor.tsx`: Chain builder → `src/features/settings/components/workflow/ApprovalChainEditor.tsx`
- `EscalationRules.tsx`: Rule config → `src/features/settings/components/workflow/EscalationRules.tsx`
- `SLASettings.tsx`: SLA configuration → `src/features/settings/components/workflow/SLASettings.tsx`
- `useWorkflows.ts`: Data + mutations → `src/features/settings/hooks/useWorkflows.ts`
- `workflowService.ts`: API → `src/features/settings/services/workflowService.ts`

**ORCHESTRATOR RESULT:** `WorkflowPage.tsx` — target max 80 lines
**PRIORITY:** P3
**SPRINT:** Sprint 8

---

### COMPONENT: Layout.tsx (1,066 lines)
**PROBLEM:** App shell containing sidebar, topbar, search mock, mock asset data, navigation state, breadcrumbs, and 49 hardcoded hex colors.
**EXTRACT:**
- `AppShell.tsx`: Layout skeleton → `src/components/layout/AppShell.tsx`
- `Sidebar.tsx`: Navigation sidebar → `src/components/layout/Sidebar.tsx`
- `TopBar.tsx`: Top header bar → `src/components/layout/TopBar.tsx`
- `NavItem.tsx`: Individual nav link → `src/components/layout/NavItem.tsx`
- `useNavigation.ts`: Nav state → `src/hooks/useNavigation.ts`

**ORCHESTRATOR RESULT:** `AppShell.tsx` — target max 100 lines
**PRIORITY:** P2
**SPRINT:** Sprint 2

---

### COMPONENT: AuthScreen.tsx (985 lines)
**PROBLEM:** 5 inline render functions (login, forgot email, OTP, reset password, success), simulated auth, 42 hardcoded hex colors, 4 duplicate password strength implementations.
**EXTRACT:**
- `LoginForm.tsx`: Login step → `src/features/auth/components/LoginForm.tsx`
- `ForgotEmailForm.tsx`: Email step → `src/features/auth/components/ForgotEmailForm.tsx`
- `OtpVerification.tsx`: OTP entry → `src/features/auth/components/OtpVerification.tsx`
- `ResetPasswordForm.tsx`: New password → `src/features/auth/components/ResetPasswordForm.tsx`
- `AuthLayout.tsx`: Shared auth page layout → `src/features/auth/components/AuthLayout.tsx`
- `useAuth.ts`: Auth flow logic → `src/features/auth/hooks/useAuth.ts`
- `authService.ts`: API calls → `src/features/auth/services/authService.ts`
- `authSchemas.ts`: Zod validation → `src/features/auth/schemas/authSchemas.ts`

**ORCHESTRATOR RESULT:** `LoginPage.tsx` — target max 60 lines
**PRIORITY:** P1
**SPRINT:** Sprint 4

---

---

# PHASE 3 — ROUTING & NAVIGATION

> **DEPENDENCY NOTE:**
> Phase 3 requires the auth store skeleton from Phase 4.0 to be implemented first.
> **EXECUTE ORDER:** Phase 4.0 → Phase 3 → Phase 4.1 onward
> Reason: `ProtectedRoute` reads from `useAuthStore`. If `authStore` does not exist when `ProtectedRoute` is written, it will have broken imports.

---

## 3.1 — REACT ROUTER V6 SETUP

**File:** `src/routes/routeConfig.tsx`

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom'
import React, { Suspense } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { AuthRoute } from './AuthRoute'
import { RoleGuard } from './RoleGuard'
import { AppShell } from '@/components/layout/AppShell'
import { Loader2 } from 'lucide-react'

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

function LazyPage(importFn: () => Promise<{ default: React.ComponentType }>) {
  const Component = React.lazy(importFn)
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

const DashboardPage = () => LazyPage(() => import('@/pages/DashboardPage'))
const AssetsPage = () => LazyPage(() => import('@/pages/AssetsPage'))
const AssetDetailPage = () => LazyPage(() => import('@/pages/AssetDetailPage'))
const UsersPage = () => LazyPage(() => import('@/pages/UsersPage'))
const RolesPage = () => LazyPage(() => import('@/pages/RolesPage'))
const ReportsPage = () => LazyPage(() => import('@/pages/ReportsPage'))
const LocationsPage = () => LazyPage(() => import('@/pages/LocationsPage'))
const InventoryPage = () => LazyPage(() => import('@/pages/InventoryPage'))
const SettingsPage = () => LazyPage(() => import('@/pages/SettingsPage'))
const AuditPage = () => LazyPage(() => import('@/pages/AuditPage'))
const WorkflowPage = () => LazyPage(() => import('@/pages/WorkflowPage'))
const LoginPage = () => LazyPage(() => import('@/pages/LoginPage'))
const NotFoundPage = () => LazyPage(() => import('@/pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthRoute>{LoginPage()}</AuthRoute>,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: DashboardPage() },
      { path: 'assets', element: AssetsPage() },
      { path: 'assets/:id', element: AssetDetailPage() },
      { path: 'locations', element: LocationsPage() },
      {
        path: 'users',
        element: <RoleGuard requiredRole="admin">{UsersPage()}</RoleGuard>,
      },
      {
        path: 'roles',
        element: <RoleGuard requiredRole="admin">{RolesPage()}</RoleGuard>,
      },
      { path: 'reports', element: ReportsPage() },
      { path: 'workflow', element: WorkflowPage() },
      { path: 'inventory', element: InventoryPage() },
      { path: 'settings', element: SettingsPage() },
      { path: 'audit', element: AuditPage() },
    ],
  },
  { path: '*', element: NotFoundPage() },
])
```

---

## 3.2 — PROTECTED ROUTE PATTERN

### a) ProtectedRoute.tsx

**File:** `src/routes/ProtectedRoute.tsx`

```typescript
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
```

### b) AuthRoute.tsx

**File:** `src/routes/AuthRoute.tsx`

```typescript
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface AuthRouteProps {
  children: ReactNode
}

export function AuthRoute({ children }: AuthRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/dashboard'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}
```

### c) RoleGuard.tsx

**File:** `src/routes/RoleGuard.tsx`

```typescript
import { ReactNode } from 'react'
import { useAuthStore } from '@/store/authStore'
import { ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

interface RoleGuardProps {
  children: ReactNode
  requiredRole: 'admin' | 'manager' | 'viewer'
}

const roleHierarchy: Record<string, number> = {
  viewer: 1,
  manager: 2,
  admin: 3,
}

export function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const userLevel = roleHierarchy[user?.role ?? 'viewer'] ?? 0
  const requiredLevel = roleHierarchy[requiredRole] ?? 999

  if (userLevel < requiredLevel) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <ShieldX className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
        <p className="text-sm text-muted-foreground mb-6">
          You need {requiredRole} permissions to access this page.
        </p>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
```

---

## 3.3 — LEGACY APP RETIREMENT PLAN

| LegacyApp Responsibility | Moves To | In Sprint |
|--------------------------|----------|-----------|
| Auth gate (boolean `isAuthenticated`) | `useAuthStore` + `ProtectedRoute` | Sprint 1 |
| Hash navigation (`window.location.hash`) | React Router `routeConfig.tsx` | Sprint 1 |
| Page state (`useState<PageType>`) | React Router routes (path-based) | Sprint 1 |
| Breadcrumb state | `PageHeader` component (per-page) | Sprint 2 |
| `hashchange` listener | React Router (automatic URL sync) | Sprint 1 |
| Page component imports | Route-level `React.lazy` imports | Sprint 1 |
| Notification badge/bell | `AppShell` → `TopBar` component | Sprint 2 |
| Search functionality | `AppShell` → `TopBar` component | Sprint 2 |

**Deletion condition:** `LegacyApp.tsx` is deleted when React Router is wired and all routes render correctly. Target: end of Sprint 8 (after all screens migrated).

During the transition (Sprints 1-7), LegacyApp still handles screens that haven't been migrated yet. The router includes a catch-all that renders LegacyApp for unmigrated routes.

---

---

# PHASE 4 — STATE MANAGEMENT & DATA LAYER

---

## 4.0 — AUTH STORE SKELETON

> **IMPLEMENT THIS BEFORE PHASE 3 ROUTING**

This is the minimal auth store needed for `ProtectedRoute` to work. Full implementation comes in section 4.3.

**File:** `src/store/authStore.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'viewer'
}

interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  token: string | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    () => ({
      isAuthenticated: false,
      user: null,
      token: null,
    }),
    { name: 'ams-auth' }
  )
)
```

> **EXPAND IN SECTION 4.3 — do not add more logic here yet.**
> This skeleton provides just enough for `ProtectedRoute` and `RoleGuard` to compile and function.

---

## 4.1 — TANSTACK QUERY SETUP

### a) QueryClient Configuration

**File:** `src/lib/queryClient.ts`

```typescript
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { toast } from 'sonner'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,         // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.showErrorToast !== false) {
        toast.error(`Something went wrong: ${error.message}`)
      }
      console.error('[QueryCache Error]', error)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(`Operation failed: ${error.message}`)
      console.error('[MutationCache Error]', error)
    },
  }),
})
```

### b) Query Key Factory

**File:** `src/lib/queryKeys.ts`

```typescript
export const queryKeys = {
  assets: {
    all: ['assets'] as const,
    lists: () => [...queryKeys.assets.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.assets.lists(), filters] as const,
    details: () => [...queryKeys.assets.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.assets.details(), id] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },
  locations: {
    all: ['locations'] as const,
    tree: () => [...queryKeys.locations.all, 'tree'] as const,
    detail: (id: string) => [...queryKeys.locations.all, 'detail', id] as const,
  },
  roles: {
    all: ['roles'] as const,
    list: () => [...queryKeys.roles.all, 'list'] as const,
    permissions: (roleId: string) =>
      [...queryKeys.roles.all, 'permissions', roleId] as const,
  },
  reports: {
    all: ['reports'] as const,
    dashboard: (filters: Record<string, unknown>) =>
      [...queryKeys.reports.all, 'dashboard', filters] as const,
    detail: (reportId: string) =>
      [...queryKeys.reports.all, 'detail', reportId] as const,
  },
  audit: {
    all: ['audit'] as const,
    logs: (filters: Record<string, unknown>) =>
      [...queryKeys.audit.all, 'logs', filters] as const,
  },
} as const
```

### c) Complete useAssets Hook

**File:** `src/features/assets/hooks/useAssets.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { assetsService } from '../services/assetsService'
import type { Asset, AssetFilters } from '../types'
import type { AssetFormValues } from '../schemas/assetSchemas'
import { toast } from 'sonner'

export function useAssets(filters: AssetFilters = {}) {
  return useQuery({
    queryKey: queryKeys.assets.list(filters),
    queryFn: () => assetsService.getAssets(filters),
    select: (response) => response.data,
  })
}

export function useAssetDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.assets.detail(id),
    queryFn: () => assetsService.getAssetById(id),
    select: (response) => response.data,
    enabled: !!id,
  })
}

export function useCreateAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AssetFormValues) => assetsService.createAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all })
      toast.success('Asset created successfully')
    },
  })
}

export function useUpdateAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetFormValues> }) =>
      assetsService.updateAsset(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.assets.detail(id) })
      const previous = queryClient.getQueryData(queryKeys.assets.detail(id))
      queryClient.setQueryData(queryKeys.assets.detail(id), (old: { data: Asset } | undefined) => {
        if (!old) return old
        return { ...old, data: { ...old.data, ...data } }
      })
      return { previous }
    },
    onError: (_err, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.assets.detail(id), context.previous)
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.lists() })
    },
  })
}

export function useDeleteAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => assetsService.deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets.all })
      toast.success('Asset deleted successfully')
    },
  })
}
```

---

## 4.2 — ZUSTAND CLIENT STATE

### a) useUIStore

**File:** `src/store/uiStore.ts`

```typescript
import { create } from 'zustand'

type DrawerType =
  | 'addAsset'
  | 'editAsset'
  | 'transfer'
  | 'inspection'
  | 'disposal'
  | 'lifecycle'
  | 'addUser'
  | 'editUser'
  | null

type ModalType =
  | 'confirmDelete'
  | 'digitalSignature'
  | 'changePassword'
  | null

interface UIState {
  sidebarCollapsed: boolean
  activeDrawer: DrawerType
  drawerData: Record<string, unknown> | null
  activeModal: ModalType
  modalData: Record<string, unknown> | null

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  openDrawer: (drawer: DrawerType, data?: Record<string, unknown>) => void
  closeDrawer: () => void
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  activeDrawer: null,
  drawerData: null,
  activeModal: null,
  modalData: null,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  openDrawer: (drawer, data = null) => set({ activeDrawer: drawer, drawerData: data }),
  closeDrawer: () => set({ activeDrawer: null, drawerData: null }),
  openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}))
```

### b) State Management Decision Matrix

| State Type | Solution | Example |
|------------|----------|---------|
| Server data (lists, details) | TanStack Query | Asset list, user list, reports |
| Shared UI state | Zustand (`uiStore`) | Sidebar collapsed, active drawer |
| Auth state | Zustand (`authStore`) with persist | Token, user, isAuthenticated |
| Local component state | `useState` | Form input values, local toggle |
| Form state | react-hook-form | Asset add/edit form, login form |
| URL state | React Router | Current page, asset ID param |

---

## 4.3 — AUTH FULL IMPLEMENTATION

**File:** `src/store/authStore.ts` (expanded)

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'viewer'
  avatar?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  token: string | null

  login: (token: string, user: AuthUser) => void
  logout: () => void
  setUser: (user: AuthUser) => void
  getToken: () => string | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: (token, user) => set({ isAuthenticated: true, token, user }),

      logout: () => set({ isAuthenticated: false, token: null, user: null }),

      setUser: (user) => set({ user }),

      getToken: () => get().token,
    }),
    {
      name: 'ams-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
)
```

**File:** `src/features/auth/services/authService.ts`

```typescript
import { apiClient } from '@/services/apiClient'
import type { AuthUser } from '@/store/authStore'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: AuthUser
}

interface ApiResponse<T> {
  data: T
  message?: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    )
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
      '/auth/refresh'
    )
    return response.data
  },

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    const response = await apiClient.get<ApiResponse<AuthUser>>('/auth/me')
    return response.data
  },
}
```

> **Security note:** Token storage strategy uses `localStorage` via Zustand persist.
> For production, `httpOnly` cookies set by the server are preferred (immune to XSS).
> The `localStorage` approach is acceptable during development with mock data but
> should be migrated to cookie-based auth when the real backend is integrated.

---

## 4.4 — API CLIENT

**File:** `src/services/apiClient.ts`

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'

export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}> = []

function processQueue(error: unknown) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(undefined)
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => apiClient(originalRequest))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await apiClient.post('/auth/refresh')
        const newToken = response.data.data.token
        useAuthStore.getState().login(newToken, useAuthStore.getState().user!)
        processQueue(null)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    const message = (error.response?.data as { message?: string })?.message || error.message
    const status = error.response?.status || 500
    return Promise.reject(new ApiError(message, status))
  }
)
```

**File:** `src/features/assets/services/assetsService.ts`

```typescript
import { apiClient, type ApiResponse } from '@/services/apiClient'
import type { Asset, AssetFilters } from '../types'
import type { AssetFormValues } from '../schemas/assetSchemas'

export const assetsService = {
  async getAssets(filters: AssetFilters = {}): Promise<ApiResponse<Asset[]>> {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.status) params.set('status', filters.status)
    if (filters.category) params.set('category', filters.category)
    if (filters.location) params.set('location', filters.location)
    if (filters.page) params.set('page', String(filters.page))
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize))

    const response = await apiClient.get<ApiResponse<Asset[]>>(
      `/assets?${params.toString()}`
    )
    return response.data
  },

  async getAssetById(id: string): Promise<ApiResponse<Asset>> {
    const response = await apiClient.get<ApiResponse<Asset>>(`/assets/${id}`)
    return response.data
  },

  async createAsset(data: AssetFormValues): Promise<ApiResponse<Asset>> {
    const response = await apiClient.post<ApiResponse<Asset>>('/assets', data)
    return response.data
  },

  async updateAsset(id: string, data: Partial<AssetFormValues>): Promise<ApiResponse<Asset>> {
    const response = await apiClient.patch<ApiResponse<Asset>>(`/assets/${id}`, data)
    return response.data
  },

  async deleteAsset(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/assets/${id}`)
    return response.data
  },
}
```

---

## 4.5 — PROVIDERS COMPOSITION

**File:** `src/providers/AppProviders.tsx`

```typescript
import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/queryClient'
import { ThemeProvider } from './ThemeProvider'
import { LanguageProvider } from './LanguageProvider'
import { Toaster } from '@/components/ui/sonner'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          {children}
          <Toaster position="top-right" richColors />
        </LanguageProvider>
      </ThemeProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
```

---

---

# PHASE 5 — DESIGN SYSTEM ENFORCEMENT

---

## 5.1 — CANONICAL TOKEN FILE

**File:** `src/theme/tokens.ts`

```typescript
export const tokens = {
  colors: {
    primary: {
      brand: 'var(--primary-brand)',
      DEFAULT: 'var(--color-primary)',
      foreground: 'var(--color-primary-foreground)',
    },
    secondary: {
      links: 'var(--secondary-links)',
      DEFAULT: 'var(--color-secondary)',
      foreground: 'var(--color-secondary-foreground)',
    },
    neutral: {
      50: 'var(--chorus-gray-50)',
      100: 'var(--chorus-gray-100)',
      200: 'var(--chorus-gray-200)',
      300: 'var(--chorus-gray-300)',
      400: 'var(--chorus-gray-400)',
      500: 'var(--chorus-gray-500)',
      600: 'var(--chorus-gray-600)',
      700: 'var(--chorus-gray-700)',
      800: 'var(--chorus-gray-800)',
      900: 'var(--chorus-gray-900)',
    },
    semantic: {
      success: 'var(--green-600)',
      successBg: 'var(--green-50)',
      warning: 'var(--yellow-500)',
      warningBg: 'var(--yellow-50)',
      error: 'var(--red-600)',
      errorBg: 'var(--red-50)',
      info: 'var(--teal-600)',
      infoBg: 'var(--teal-50)',
    },
    status: {
      active: 'var(--green-600)',
      activeBg: 'var(--green-50)',
      inactive: 'var(--chorus-gray-600)',
      inactiveBg: 'var(--chorus-gray-100)',
      maintenance: 'var(--yellow-500)',
      maintenanceBg: 'var(--yellow-50)',
      disposed: 'var(--red-600)',
      disposedBg: 'var(--red-50)',
      transferred: 'var(--teal-600)',
      transferredBg: 'var(--teal-50)',
      pending: 'var(--yellow-700)',
      pendingBg: 'var(--yellow-50)',
      draft: 'var(--chorus-gray-500)',
      draftBg: 'var(--chorus-gray-100)',
    },
    background: 'var(--color-background)',
    foreground: 'var(--color-foreground)',
    card: 'var(--color-card)',
    cardForeground: 'var(--color-card-foreground)',
    muted: 'var(--color-muted)',
    mutedForeground: 'var(--color-muted-foreground)',
    border: 'var(--color-border)',
    destructive: 'var(--color-destructive)',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, Fira Code, monospace',
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  spacing: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  borderRadius: {
    none: '0',
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    DEFAULT: 'var(--radius)',
    lg: 'var(--radius)',
    xl: 'calc(var(--radius) + 4px)',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  zIndex: {
    dropdown: 50,
    sticky: 100,
    fixed: 200,
    overlay: 300,
    modal: 400,
    popover: 500,
    toast: 600,
    tooltip: 700,
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const
```

---

## 5.2 — TOP 10 HEX TO TOKEN MAPPING

| Hardcoded Hex | Token Reference | Tailwind Class | Files Affected |
|---------------|-----------------|----------------|----------------|
| `#121321` | `--chorus-black-300` / `--foreground` | `text-foreground` / `bg-[var(--chorus-black-300)]` | 28+ files |
| `#1A1B2E` | `--chorus-black-400` / `--card` (dark) | `bg-card` (dark mode) | 22+ files |
| `#353750` | `--chorus-black-100` / `--border` | `border-border` | 19+ files |
| `#C6C7D2` | `--chorus-gray-400` / `--sidebar-foreground` | `text-sidebar-foreground` | 16+ files |
| `#EF652B` | `--primary-brand` / `--orange-500` | `text-[var(--primary-brand)]` | 14+ files |
| `#2D798D` | `--secondary-links` / `--teal-600` | `text-[var(--secondary-links)]` | 12+ files |
| `#F1F1F3` | `--chorus-gray-100` / `--background` | `bg-background` | 11+ files |
| `#989AAE` | `--chorus-gray-600` / `--muted-foreground` | `text-muted-foreground` | 10+ files |
| `#DCDDE5` | `--chorus-gray-300` / `--border` (light) | `border-border` | 9+ files |
| `#B8E3E9` | `--teal-200` / `--ring` | `ring-ring` | 8+ files |

---

## 5.3 — TYPOGRAPHY COMPONENT

**File:** `src/components/shared/Typography.tsx`

```typescript
import { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'code'

interface TypographyProps {
  variant: Variant
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

const variantStyles: Record<Variant, string> = {
  heading1: 'text-3xl font-bold text-foreground leading-tight',
  heading2: 'text-2xl font-semibold text-foreground leading-tight',
  heading3: 'text-xl font-semibold text-foreground leading-tight',
  heading4: 'text-lg font-medium text-foreground leading-normal',
  body: 'text-base text-foreground leading-normal',
  bodySmall: 'text-sm text-foreground leading-normal',
  caption: 'text-xs text-muted-foreground leading-normal',
  label: 'text-sm font-medium text-foreground leading-none',
  code: 'text-sm font-mono bg-muted px-1.5 py-0.5 rounded text-foreground',
}

const defaultElements: Record<Variant, keyof JSX.IntrinsicElements> = {
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  heading4: 'h4',
  body: 'p',
  bodySmall: 'p',
  caption: 'span',
  label: 'label',
  code: 'code',
}

export function Typography({ variant, children, className, as }: TypographyProps) {
  const Element = as || defaultElements[variant]
  return (
    <Element className={cn(variantStyles[variant], className)}>
      {children}
    </Element>
  )
}
```

---

## 5.4 — TAILWIND v4 TOKEN WIRING

> **THIS IS TAILWIND v4 — CSS-FIRST. Key differences from v3:**
> - NO `tailwind.config.ts` for design tokens (it is ignored in v4)
> - ALL tokens are defined in CSS using `@theme {}` blocks
> - The `@tailwindcss/vite` plugin reads the CSS directly
> - Token changes happen in `src/styles/theme.css` ONLY

The project already has this correct at `src/styles/theme.css` lines 126-165 using `@theme inline {}` syntax.

**Pattern for extending with new tokens:**

```css
/* src/styles/theme.css — EXTEND this file, do not create tailwind.config.ts */
@import "tailwindcss";

@theme inline {
  /* Existing tokens (already present) */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... existing tokens ... */

  /* NEW: AMS status colors — add these */
  --color-status-active: var(--green-600);
  --color-status-active-bg: var(--green-50);
  --color-status-inactive: var(--chorus-gray-600);
  --color-status-inactive-bg: var(--chorus-gray-100);
  --color-status-maintenance: var(--yellow-500);
  --color-status-maintenance-bg: var(--yellow-50);
  --color-status-disposed: var(--red-600);
  --color-status-disposed-bg: var(--red-50);
  --color-status-transferred: var(--teal-600);
  --color-status-transferred-bg: var(--teal-50);

  /* NEW: Brand accent */
  --color-brand: var(--primary-brand);
  --color-brand-foreground: #ffffff;

  /* NEW: Layout dimensions */
  --spacing-sidebar: 240px;
  --spacing-sidebar-collapsed: 64px;
  --spacing-topbar: 64px;
}
```

**How `src/theme/tokens.ts` mirrors CSS (single source of truth in CSS):**

```typescript
// src/theme/tokens.ts
// These values MUST stay in sync with @theme in src/styles/theme.css
// The CSS file is the source of truth. This file enables TypeScript usage
// in style={{}} props and programmatic contexts (charts, canvas, etc.)
export const tokens = {
  colors: {
    primary: 'var(--color-primary)',
    brand: 'var(--color-brand)',
    statusActive: 'var(--color-status-active)',
    // ...
  }
} as const
```

**CORRECT v4 usage:**
```tsx
className="bg-primary text-primary-foreground"       // ✓
className="bg-sidebar"                                // ✓ (--color-sidebar defined)
className="bg-status-active text-status-active-bg"   // ✓ (after extending @theme)
```

**WRONG (v3 patterns — do not use):**
```tsx
// tailwind.config.ts theme.extend.colors   ✗ (ignored in v4)
// className="bg-[#121321]"                 ✗ (hardcoded hex)
```

**If a `tailwind.config.ts` exists in the project root: DELETE IT.**
It has zero effect in Tailwind v4 and causes confusion.

---

---

# PHASE 6 — PERFORMANCE OPTIMIZATION

---

## 6.1 — CODE SPLITTING

**File:** `vite.config.ts` (enhanced)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          charts: ['recharts'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip',
          ],
          motion: ['motion'],
        },
      },
    },
  },
})
```

---

## 6.2 — LAZY LOADING PATTERN

Standard pattern for every route page (already shown in `routeConfig.tsx`):

```typescript
const AssetsPage = React.lazy(() => import('@/pages/AssetsPage'))
```

Suspense boundary placement in the router — wraps each lazy component at the route level:

```typescript
function LazyPage(importFn: () => Promise<{ default: React.ComponentType }>) {
  const Component = React.lazy(importFn)
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}
```

Heavy sub-components within a page can also be lazy-loaded:

```typescript
const RechartsChart = React.lazy(() => import('./charts/TrendLineChart'))

function ReportsPage() {
  return (
    <PageShell header={{ title: 'Reports' }}>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <RechartsChart data={chartData} />
      </Suspense>
    </PageShell>
  )
}
```

---

## 6.3 — RENDERING OPTIMIZATION RULES

| Scenario | Tool | When |
|----------|------|------|
| Pure component, expensive render | `React.memo` | Only after profiling confirms re-render waste |
| Callback passed to memoized child | `useCallback` | Only when child is wrapped in `React.memo` |
| Expensive computation in render | `useMemo` | When computation takes >1ms (measured) |
| Large list (100+ rows) | `@tanstack/react-virtual` | Always for virtualized tables with 100+ rows |
| Event handler in list item | `useCallback` + stable ref | When list re-renders cause jank |

**Assets filter debounce example:**

BEFORE — each keystroke re-filters in a 3,400-line component:
```typescript
const [searchTerm, setSearchTerm] = useState('')
// Every keystroke triggers filter + re-render of 3,400 lines
const filteredAssets = assets.filter(a =>
  a.name.toLowerCase().includes(searchTerm.toLowerCase())
)
```

AFTER — debounced search with memoized filter:
```typescript
import { useDebounce } from '@/hooks/useDebounce'

const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 300)

const filteredAssets = useMemo(
  () => assets.filter(a =>
    a.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  ),
  [assets, debouncedSearch]
)
```

**`src/hooks/useDebounce.ts`:**
```typescript
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

---

## 6.4 — ICON LIBRARY MIGRATION

> **VERIFY ICON NAMES BEFORE BULK MIGRATION:**
> Lucide renames icons across versions. Before any find-replace, run:
> ```bash
> node -e "const l = require('lucide-react'); console.log(Object.keys(l).filter(k => k[0] === k[0].toUpperCase()).sort().join('\n'))" > lucide-icons.txt
> ```
> Cross-reference at: https://lucide.dev/icons/

`lucide-react` is already installed (`^1.16.0`). The goal is to remove `@mui/icons-material` entirely.

**Top 20 MUI Icons → Lucide Equivalents:**

| MUI Icon Import | Lucide Equivalent | Notes |
|-----------------|-------------------|-------|
| `SearchOutlined` | `Search` | Direct match |
| `AddOutlined` / `Add` | `Plus` | Name change |
| `EditOutlined` | `Pencil` | Name change |
| `DeleteOutlined` | `Trash2` | Name change |
| `CloseOutlined` | `X` | Name change |
| `VisibilityOutlined` | `Eye` | Name change |
| `VisibilityOffOutlined` | `EyeOff` | Name change |
| `FilterListOutlined` | `SlidersHorizontal` or `Filter` | Context-dependent |
| `DownloadOutlined` | `Download` | Direct match |
| `UploadOutlined` | `Upload` | Direct match |
| `MoreVertOutlined` | `MoreVertical` | Direct match |
| `ChevronRightOutlined` | `ChevronRight` | Direct match |
| `ChevronLeftOutlined` | `ChevronLeft` | Direct match |
| `ExpandMoreOutlined` | `ChevronDown` | Name change |
| `NotificationsOutlined` | `Bell` | Name change |
| `SettingsOutlined` | `Settings` | Direct match |
| `PersonOutlined` | `User` | Name change |
| `DashboardOutlined` | `LayoutDashboard` | Name change |
| `InventoryOutlined` | `Package` | Name change |
| `CheckCircleOutlined` | `CheckCircle` | Direct match |

**Bulk migration command** (run from project root):

```bash
# Step 1: Find all MUI icon imports
rg "from '@mui/icons-material" --files-with-matches src/

# Step 2: For each file, replace import statements
# Example for a single icon:
rg -l "SearchOutlined" src/ | xargs sed -i 's/import.*SearchOutlined.*from.*@mui\/icons-material.*//' 
# Then add lucide import at top

# Step 3: Replace component usage
# <SearchOutlined /> → <Search />
```

**Target:** After Sprint 9, zero `@mui/icons-material` imports remain. Remove from `package.json`:
```bash
npm uninstall @mui/icons-material @mui/material @emotion/react @emotion/styled
```

---

---

# PHASE 7 — CODE QUALITY & TYPE SAFETY

---

## 7.1 — FINAL TSCONFIG

**File:** `tsconfig.app.json` (final state)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": [
    "src/app/imports/**/*",
    "src/imports/**/*"
  ]
}
```

> **Note on `noUncheckedIndexedAccess`:** This flag adds `| undefined` to all index access operations (`arr[0]`, `obj[key]`). It prevents real bugs but causes noise in array `.map()` callbacks where the index is guaranteed valid. Suppress with non-null assertion `!` only when the access is provably safe.

> **Note on path aliases:** Simplified to just `@/*` since Vite only resolves one alias anyway. The granular paths were IDE-only sugar that added maintenance burden.

---

## 7.2 — ELIMINATING ANY

| File | Location | Current | Fixed |
|------|----------|---------|-------|
| `RoleManagement.tsx` | `permissions` variable | `Record<string, any>` | `Record<string, Permission[]>` with `Permission` interface |
| `RoleManagement.tsx` | `handlePermissionChange` param | `(perm: any)` | `(perm: Permission)` |
| `RoleManagement.tsx` | `roleData` state | `useState<any[]>` | `useState<Role[]>` |
| `ReportingAnalytics.tsx` | `sortedData` | `data.sort((a: any, b: any)` | `data.sort((a: ReportRow, b: ReportRow)` |
| `ReportingAnalytics.tsx` | chart config | `config: any` | `config: ChartConfig` interface |
| `ReportingAnalytics.tsx` | tooltip payload | `payload: any[]` | `payload: TooltipPayload[]` |
| `Assets.tsx` | filter callback | `(item: any)` | `(item: Asset)` |
| `Assets.tsx` | drawer data | `drawerData: any` | `drawerData: Partial<Asset> \| null` |
| `UserManagement.tsx` | user form | `formData: any` | `formData: UserFormValues` |
| `UserManagement.tsx` | table sort | `(a: any, b: any)` | `(a: User, b: User)` |
| `WorkflowManagement.tsx` | workflow config | `config: any` | `config: WorkflowConfig` |
| `AssetDetailView.tsx` | tab data | `tabData: any` | `tabData: AssetTabData` |
| `locations/types.ts` | metadata | `Record<string, any>` | `Record<string, string \| number \| boolean>` |
| `Dashboard.tsx` | chart event | `(event: any)` | `(event: React.MouseEvent)` |

---

## 7.3 — ERROR HANDLING HIERARCHY

**File:** `src/lib/errors.ts`

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed. Please check your connection.') {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'NetworkError'
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication failed. Please log in again.') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthError'
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'The submitted data is invalid.',
    public fields?: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', 422)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'The requested resource was not found.') {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class PermissionError extends AppError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, 'PERMISSION_ERROR', 403)
    this.name = 'PermissionError'
  }
}
```

**Error → Toast mapping (used in API interceptor and mutation error handlers):**

```typescript
import { toast } from 'sonner'
import { AppError, AuthError, NetworkError, ValidationError, NotFoundError, PermissionError } from '@/lib/errors'

export function handleError(error: unknown): void {
  if (error instanceof AuthError) {
    toast.error('Session expired', { description: 'Please log in again.' })
  } else if (error instanceof NetworkError) {
    toast.error('Connection failed', { description: 'Check your internet connection.' })
  } else if (error instanceof ValidationError) {
    toast.error('Validation error', { description: error.message })
  } else if (error instanceof NotFoundError) {
    toast.error('Not found', { description: error.message })
  } else if (error instanceof PermissionError) {
    toast.error('Access denied', { description: error.message })
  } else if (error instanceof AppError) {
    toast.error('Error', { description: error.message })
  } else {
    toast.error('Unexpected error', { description: 'Please try again later.' })
  }
}
```

---

## 7.4 — ESLINT FLAT CONFIG (ESLint v9)

> The project already has `eslint.config.js` in v9 flat config format.
> Do NOT create a `.eslintrc` file. ENHANCE the existing `eslint.config.js`.

**File:** `eslint.config.js` (enhanced)

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['../../*', '../../../*'],
            message: 'Use @/ path aliases instead of deep relative imports.',
          },
          {
            group: ['@mui/icons-material', '@mui/icons-material/*'],
            message: 'Use lucide-react instead of MUI icons.',
          },
        ],
      }],
      'react-hooks/exhaustive-deps': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
])
```

**File:** `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**File:** `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**In `package.json` — add `lint-staged` config:**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

---

---

# PHASE 8 — TESTING INFRASTRUCTURE

---

## 8.1 — VITEST SETUP

**File:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
})
```

**File:** `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())
```

**File:** `src/test/utils.tsx`

```typescript
import { ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

interface WrapperProps {
  children: ReactNode
}

function createWrapper(routerEntries: string[] = ['/']) {
  const queryClient = createTestQueryClient()

  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={routerEntries}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    )
  }
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { routerEntries?: string[] }
) {
  const { routerEntries, ...renderOptions } = options || {}
  return render(ui, {
    wrapper: createWrapper(routerEntries),
    ...renderOptions,
  })
}

export { render, screen, waitFor, within, fireEvent } from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
export { renderWithProviders as renderApp }
```

---

## 8.2 — MSW v2 SETUP

> **THIS PLAN USES MSW v2 SYNTAX**
>
> MSW v2 breaking changes from v1:
> - WRONG (v1): `import { rest } from 'msw'` + `rest.get(url, (req, res, ctx) => res(ctx.json(...)))`
> - CORRECT (v2): `import { http, HttpResponse } from 'msw'` + `http.get(url, () => HttpResponse.json(...))`

**File:** `src/test/mocks/handlers/assets.ts`

```typescript
import { http, HttpResponse } from 'msw'

const mockAssets = [
  {
    id: '1',
    name: 'Dell Latitude 5540',
    serialNumber: 'SN-2024-001',
    category: 'it-equipment',
    status: 'active',
    condition: 'good',
    location: 'HQ / Floor 3 / Room 301',
    acquisitionDate: '2024-01-15',
    acquisitionCost: '1250.00',
  },
  {
    id: '2',
    name: 'Herman Miller Aeron',
    serialNumber: 'SN-2024-002',
    category: 'furniture',
    status: 'active',
    condition: 'new',
    location: 'HQ / Floor 2 / Room 205',
    acquisitionDate: '2024-03-20',
    acquisitionCost: '1450.00',
  },
]

export const assetHandlers = [
  http.get('/api/assets', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const filtered = mockAssets.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase())
    )
    return HttpResponse.json({
      data: filtered,
      meta: { page: 1, pageSize: 10, total: filtered.length, totalPages: 1 },
    })
  }),

  http.get('/api/assets/:id', ({ params }) => {
    const asset = mockAssets.find((a) => a.id === params.id)
    if (!asset) {
      return HttpResponse.json(
        { message: 'Asset not found' },
        { status: 404 }
      )
    }
    return HttpResponse.json({ data: asset })
  }),

  http.post('/api/assets', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newAsset = { id: String(Date.now()), ...body }
    return HttpResponse.json({ data: newAsset }, { status: 201 })
  }),

  http.patch('/api/assets/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const asset = mockAssets.find((a) => a.id === params.id)
    if (!asset) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    const updated = { ...asset, ...body }
    return HttpResponse.json({ data: updated })
  }),

  http.delete('/api/assets/:id', ({ params }) => {
    const exists = mockAssets.some((a) => a.id === params.id)
    if (!exists) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return HttpResponse.json({ data: null })
  }),
]
```

**File:** `src/test/mocks/browser.ts`

```typescript
import { setupWorker } from 'msw/browser'
import { assetHandlers } from './handlers/assets'

export const worker = setupWorker(...assetHandlers)
```

**File:** `src/test/mocks/server.ts`

```typescript
import { setupServer } from 'msw/node'
import { assetHandlers } from './handlers/assets'

export const server = setupServer(...assetHandlers)
```

---

## 8.3 — TEST STRATEGY

**Convention:** Co-located test files — `Component.test.tsx` lives next to `Component.tsx`.

### a) Hook test

**File:** `src/hooks/useTableState.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useTableState } from './useTableState'

const mockData = [
  { id: '1', name: 'Alpha', status: 'active' },
  { id: '2', name: 'Beta', status: 'inactive' },
  { id: '3', name: 'Gamma', status: 'active' },
]

describe('useTableState', () => {
  it('paginates data correctly', () => {
    const { result } = renderHook(() =>
      useTableState(mockData, { defaultPageSize: 2 })
    )
    expect(result.current.paginatedData).toHaveLength(2)
    expect(result.current.totalPages).toBe(2)
  })

  it('changes page', () => {
    const { result } = renderHook(() =>
      useTableState(mockData, { defaultPageSize: 2 })
    )
    act(() => result.current.setPage(2))
    expect(result.current.paginatedData).toHaveLength(1)
    expect(result.current.paginatedData[0].name).toBe('Gamma')
  })

  it('toggles sort direction', () => {
    const { result } = renderHook(() =>
      useTableState(mockData, { defaultSortKey: 'name' })
    )
    expect(result.current.sortDirection).toBe('asc')
    act(() => result.current.toggleSort('name'))
    expect(result.current.sortDirection).toBe('desc')
  })

  it('changes sort key and resets direction', () => {
    const { result } = renderHook(() =>
      useTableState(mockData, { defaultSortKey: 'name' })
    )
    act(() => result.current.toggleSort('name'))
    expect(result.current.sortDirection).toBe('desc')
    act(() => result.current.toggleSort('status'))
    expect(result.current.sortKey).toBe('status')
    expect(result.current.sortDirection).toBe('asc')
  })

  it('manages row selection', () => {
    const { result } = renderHook(() => useTableState(mockData))
    act(() => result.current.setSelectedRows(new Set(['1', '2'])))
    expect(result.current.selectedRows.size).toBe(2)
    act(() => result.current.clearSelection())
    expect(result.current.selectedRows.size).toBe(0)
  })
})
```

### b) Component test

**File:** `src/components/shared/DataTable.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from './DataTable'
import type { ColumnConfig } from '@/types'

interface TestRow {
  id: string
  name: string
  email: string
}

const columns: ColumnConfig<TestRow>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
]

const data: TestRow[] = [
  { id: '1', name: 'Alice', email: 'alice@test.com' },
  { id: '2', name: 'Bob', email: 'bob@test.com' },
]

describe('DataTable', () => {
  it('renders data rows', () => {
    render(<DataTable data={data} columns={columns} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
  })

  it('shows empty state when data is empty', () => {
    render(<DataTable data={[]} columns={columns} />)
    expect(screen.getByText('No data found')).toBeInTheDocument()
  })

  it('shows loading skeleton', () => {
    render(<DataTable data={[]} columns={columns} isLoading />)
    expect(screen.queryByText('No data found')).not.toBeInTheDocument()
  })

  it('calls onRowClick when row is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<DataTable data={data} columns={columns} onRowClick={onClick} />)
    await user.click(screen.getByText('Alice'))
    expect(onClick).toHaveBeenCalledWith(data[0])
  })

  it('handles sort click', async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()
    render(<DataTable data={data} columns={columns} onSort={onSort} />)
    await user.click(screen.getByText('Name'))
    expect(onSort).toHaveBeenCalledWith('name')
  })
})
```

### c) Form test

**File:** `src/features/assets/components/drawers/AddAssetDrawer.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { AddAssetDrawer } from './AddAssetDrawer'

describe('AddAssetDrawer', () => {
  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddAssetDrawer open onOpenChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /create asset/i }))

    await waitFor(() => {
      expect(screen.getByText(/asset name is required/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    renderWithProviders(<AddAssetDrawer open onOpenChange={onOpenChange} />)

    await user.type(screen.getByLabelText(/asset name/i), 'Test Asset')
    await user.click(screen.getByRole('button', { name: /create asset/i }))

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
```

### d) Service test

**File:** `src/features/assets/services/assetsService.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { assetsService } from './assetsService'

describe('assetsService', () => {
  it('fetches assets list', async () => {
    const response = await assetsService.getAssets()
    expect(response.data).toBeInstanceOf(Array)
    expect(response.data.length).toBeGreaterThan(0)
    expect(response.data[0]).toHaveProperty('id')
    expect(response.data[0]).toHaveProperty('name')
  })

  it('fetches single asset by id', async () => {
    const response = await assetsService.getAssetById('1')
    expect(response.data.id).toBe('1')
    expect(response.data.name).toBe('Dell Latitude 5540')
  })

  it('returns 404 for non-existent asset', async () => {
    await expect(assetsService.getAssetById('999')).rejects.toMatchObject({
      status: 404,
    })
  })

  it('creates a new asset', async () => {
    const newAsset = {
      name: 'New Test Asset',
      category: 'furniture',
      condition: 'new',
      acquisitionDate: '2024-06-01',
    }
    const response = await assetsService.createAsset(newAsset as never)
    expect(response.data).toHaveProperty('id')
    expect(response.data.name).toBe('New Test Asset')
  })

  it('filters assets by search term', async () => {
    const response = await assetsService.getAssets({ search: 'Dell' })
    expect(response.data.every((a) => a.name.includes('Dell'))).toBe(true)
  })
})
```

### Coverage Targets

| Layer | Minimum Coverage |
|-------|-----------------|
| Hooks | 80% |
| Shared components | 70% |
| Services | 90% |
| Utils/lib | 95% |
| Feature components | 60% |

---

---

# PHASE 9 — EXECUTION ROADMAP

---

## 9.1 — SPRINT PLAN (10 sprints, 1 week each)

> **ASSETS REQUIRES 2 SPRINTS** — it is 3,400 lines with 52 useState.
> Attempting to decompose it in one sprint produces rushed, incomplete work.
> Sprints 5A and 5B are non-negotiable.

---

### SPRINT 1 — Foundation & Router

**Goal:** Establish project infrastructure, install dependencies, wire React Router, and create folder scaffold.

**Execution order (MANDATORY):**
1. Phase 0 Tier A deletions (commit snapshot first: `git add -A && git commit -m "snapshot: pre-refactor"`)
2. Install all dependencies (Phase 0.2 — runtime + dev)
3. Phase 4.0 auth store skeleton (MUST be before Step 4)
4. Phase 3 React Router + ProtectedRoute + AuthRoute + RoleGuard
5. Phase 1 folder scaffold (empty files + barrel `index.ts` files)
6. Wire `src/App.tsx` to use `RouterProvider` with `routeConfig`
7. Verify: `npm run build` passes, `/login` and `/dashboard` routes render

**Deliverables:**
- All Tier A files deleted
- `package.json` updated with new dependencies
- `src/store/authStore.ts` (skeleton)
- `src/routes/routeConfig.tsx`, `ProtectedRoute.tsx`, `AuthRoute.tsx`, `RoleGuard.tsx`
- Complete folder scaffold with barrel files
- `src/App.tsx` using `RouterProvider`

**Definition of Done:** App builds, `/login` renders auth screen, `/dashboard` renders dashboard, LegacyApp still live as fallback for unmigrated routes.

**Blocks:** Sprint 2 cannot start until scaffold exists.

**Risk:** Tier A deletion might break build if an obscure import exists — verify build after each batch of deletions.

---

### SPRINT 2 — Design System + Shared Components

**Goal:** Build the reusable component library and migrate Layout.tsx.

**Deliverables:**
- `src/theme/tokens.ts` (complete)
- Phase 5.4 `@theme` extension in `src/styles/theme.css`
- All 9 shared composite components (PageHeader, PageShell, StatCard, FilterToolbar, DrawerFormFooter, EmptyState, ConfirmDialog, StatusBadge, SectionTitle)
- `Typography.tsx`
- `src/components/layout/AppShell.tsx`, `Sidebar.tsx`, `TopBar.tsx`
- Top 10 hex values migrated in Layout.tsx and AuthScreen.tsx

**Definition of Done:** No new hardcoded hex in any new file. `AppShell` renders correctly in the authenticated layout route.

**Blocks:** Sprint 3 depends on shared components.

**Risk:** Layout migration touches the app shell — test all routes still render inside it.

---

### SPRINT 3 — Table + Form System

**Goal:** Build DataTable and form primitives, prove them on two existing screens.

**Deliverables:**
- `DataTable<T>`, `useTableState`, `TableToolbar`
- All 6 form primitives (FormInput, FormSelect, FormTextarea, FormDatePicker, FormCheckbox, FormRadioGroup)
- `FormField` base wrapper
- `PasswordStrengthIndicator`
- UserManagement table migrated to `DataTable<User>`
- AuthScreen forms migrated to form primitives (proof of concept)

**Definition of Done:** UserManagement uses `DataTable`, AuthScreen uses form primitives. Both render correctly.

**Blocks:** Sprint 4 needs form primitives, Sprint 5A needs DataTable.

**Risk:** UserManagement is 1,978 lines — only migrate the table portion in this sprint, full decomposition in Sprint 6.

---

### SPRINT 4 — Auth Feature Decomposition

**Goal:** Extract AuthScreen.tsx into feature module with proper auth flow.

**Deliverables:**
- `src/features/auth/` complete (components, hooks, services, schemas)
- LoginForm, ForgotEmailForm, OtpVerification, ResetPasswordForm, AuthLayout
- Phase 4.3 full auth implementation (expanded `authStore`, `authService`)
- `src/pages/LoginPage.tsx` wired to router
- `src/app/components/AuthScreen.tsx` deleted

**Definition of Done:** Login flow works via `features/auth`, AuthScreen.tsx deleted, `npm run build` passes.

**Blocks:** Sprint 7 needs `authService` for API interceptor.

**Risk:** Auth simulates OTP with setTimeout — keep the simulation in authService until real backend exists.

---

### SPRINT 5A — Assets Core (list view)

**Goal:** Extract the asset list view from the 3,400-line monolith.

**Deliverables:**
- `src/features/assets/components/AssetList.tsx`
- `src/features/assets/components/AssetFilters.tsx`
- `src/features/assets/components/AssetStats.tsx`
- `src/features/assets/hooks/useAssets.ts`
- `src/features/assets/hooks/useAssetFilters.ts`
- `src/features/assets/hooks/useAssetSelection.ts`
- `src/features/assets/constants/assetColumns.ts`
- `src/features/assets/types/index.ts`
- `src/pages/AssetsPage.tsx` wired to router

**Definition of Done:** Asset list renders via new route with filtering, sorting, and pagination. Old `Assets.tsx` still live (not deleted yet).

**Blocks:** Sprint 5B.

**Risk:** Scope creep — do NOT touch drawers or detail view in this sprint.

---

### SPRINT 5B — Assets Drawers + Detail

**Goal:** Complete asset feature module with all drawers and detail view.

**Deliverables:**
- All 6 drawer components (Add, Edit, Transfer, Lifecycle, Inspection, Disposal)
- `AssetDetail.tsx` + detail sub-components
- `src/features/assets/schemas/assetSchemas.ts`
- `src/features/assets/services/assetsService.ts`
- `src/features/assets/hooks/useAssetMutations.ts`
- `src/pages/AssetDetailPage.tsx` wired to router
- `src/app/components/Assets.tsx` **deleted**
- `src/app/components/assets/AssetDetailView.tsx` **deleted**

**Definition of Done:** Complete asset flow (list → detail → drawers) via `features/assets`. Old files deleted.

**Blocks:** Sprint 7 needs `assetsService.ts`.

**Risk:** 6 drawers is a lot — prioritize Add and Edit, others can be simplified stubs if time-constrained.

---

### SPRINT 6 — UserManagement + RoleManagement Decomposition

**Goal:** Extract user and role management into feature modules.

**Deliverables:**
- `src/features/users/` complete (UserList, UserFormDrawer, hooks, service, schemas)
- `src/features/access/` complete (RoleList, RolePermissionEditor, hooks, service)
- `src/pages/UsersPage.tsx`, `src/pages/RolesPage.tsx` wired
- `src/app/components/UserManagement.tsx` **deleted**
- `src/app/components/RoleManagement.tsx` **deleted**
- `src/app/components/UsersAccessManagement.tsx` **deleted**

**Definition of Done:** Both screens via `features/users` and `features/access`. Old files deleted.

**Blocks:** None critical.

**Risk:** RoleManagement has `any` types in permissions — fix during extraction.

---

### SPRINT 7 — API Layer + TanStack Query Wiring

**Goal:** Wire all feature services to TanStack Query, establish apiClient as the single data layer.

**Deliverables:**
- `src/services/apiClient.ts` complete with interceptors
- `src/lib/queryClient.ts` configured
- `src/lib/queryKeys.ts` complete
- All migrated feature services connected to apiClient
- MSW handlers for development/testing
- TanStack Query replacing all mock data in migrated features

**Definition of Done:** Network tab shows API calls (intercepted by MSW in dev). All `useState` mock data patterns removed from migrated features.

**Blocks:** Sprint 8 extends this to remaining screens.

**Risk:** Mock data shapes might not match API response shapes — define `ApiResponse<T>` wrapper early.

---

### SPRINT 8 — ReportingAnalytics + Remaining Screens

**Goal:** Migrate all remaining screens and delete LegacyApp.

**Deliverables:**
- `src/features/reports/` complete (4,256 line decomposition)
- `src/features/dashboard/` complete
- `src/features/settings/` complete (RFID, Workflow, SystemConfig, Integrations)
- `src/features/inventory/` complete (DraftAssets, FindExtra, InventorySheets)
- `src/features/locations/` complete
- `src/features/audit/` complete
- `src/features/notifications/`, `src/features/requests/`, `src/features/help/`, `src/features/profile/`
- ALL `src/app/components/*.tsx` screen files **deleted**
- `src/app/LegacyApp.tsx` **deleted**
- `src/app/router.tsx` **deleted**

**Definition of Done:** Zero files remain in `src/app/components/` except `ui/` (if not yet moved). LegacyApp deleted. All routes work via React Router.

**Blocks:** None — this is the final migration sprint.

**Risk:** ReportingAnalytics at 4,256 lines is the largest decomposition — allow 3-4 days for it alone.

---

### SPRINT 9 — Performance + Icon Migration

**Goal:** Optimize bundle, remove MUI, implement code splitting.

**Deliverables:**
- `vite.config.ts` with `manualChunks` configuration
- `React.memo` audit (apply only where profiling shows benefit)
- Complete MUI → lucide-react icon migration
- `@mui/icons-material`, `@mui/material`, `@emotion/react`, `@emotion/styled` removed from `package.json`
- Bundle analysis report (target: <500KB initial JS)
- `useDebounce` applied to all search filters

**Definition of Done:** Bundle < 500KB initial load. Zero `@mui` imports remain. Lighthouse performance score > 80.

**Blocks:** None.

**Risk:** Some MUI icons might not have direct lucide equivalents — check icon list before migration.

---

### SPRINT 10 — Testing + Hardening

**Goal:** Establish test infrastructure and reach coverage targets.

**Deliverables:**
- Vitest configuration complete (`vitest.config.ts`, `setup.ts`, `utils.tsx`)
- MSW v2 handlers for all feature services
- Tests for all shared components (DataTable, form primitives, PageShell, etc.)
- Tests for all shared hooks (useTableState, useDebounce, etc.)
- Enhanced ESLint config deployed
- Husky pre-commit hooks active
- Prettier configured and run across codebase
- All `any` types eliminated (Phase 7.2)

**Definition of Done:** `npm test` passes. Coverage thresholds met. `npm run lint` reports 0 errors.

**Blocks:** None — this is the final hardening sprint.

**Risk:** Enabling `noUnusedLocals` will surface many warnings — batch-fix with IDE refactoring tools.

---

## 9.2 — DEPENDENCY ORDER MAP

```
Phase 0 Tier A Deletions ──► Phase 1 Folder Scaffold
    reason: no confusion from old mirror files

Phase 4.0 Auth Skeleton ──► Phase 3 React Router
    reason: ProtectedRoute imports useAuthStore

Phase 1 Folder Scaffold ──► All feature work (Sprints 3-8)
    reason: target folders must exist before files are created

Sprint 2 Shared Components ──► Sprint 3 Table + Forms
    reason: DataTable uses EmptyState, StatusBadge

Sprint 3 DataTable ──► Sprint 5A Assets List
    reason: AssetList uses DataTable<Asset>

Sprint 3 Form Primitives ──► Sprint 4 Auth Decomposition
    reason: LoginForm uses FormInput, FormSelect

Sprint 4 Auth Complete ──► Sprint 7 API Layer
    reason: authService.ts drives the interceptor token refresh

Sprint 5A Assets List ──► Sprint 5B Assets Drawers
    reason: drawers assume list view infrastructure exists

Sprint 5B Assets Complete ──► Sprint 7 API Layer
    reason: assetsService.ts is the first real service to wire

Sprint 6 Users Complete ──► Sprint 7 API Layer
    reason: usersService.ts needs apiClient

Sprint 8 All Screens Migrated ──► LegacyApp Deletion
    reason: LegacyApp cannot be deleted until all routes are handled by React Router
```

---

## 9.3 — RISK REGISTER

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Assets decomposition scope creep | HIGH | HIGH | Hard boundary between Sprint 5A (list only) and 5B (drawers + detail) |
| Tailwind v4 token sync drift (CSS vs TS) | MEDIUM | MEDIUM | ESLint rule banning hardcoded hex + PR review rejection |
| TanStack Query + mock data coexistence | MEDIUM | LOW | MSW intercepts all requests — works identically with mock or real API |
| Missing API contract during migration | HIGH | HIGH | Define TypeScript types before writing services — types are the contract |
| LegacyApp deletion too early | LOW | CRITICAL | Strangler Fig 4-condition checklist enforced before any deletion |
| MUI icon name mismatches during migration | MEDIUM | LOW | Verify each icon against installed lucide version before find-replace |
| noUncheckedIndexedAccess false positives | HIGH | LOW | Batch-suppress with `!` in safe contexts (array.map callbacks) |
| Feature cross-imports creeping in | MEDIUM | MEDIUM | ESLint rule + PR review — features never import from other features |
| Sprint 8 overloaded (7+ screens) | HIGH | MEDIUM | Prioritize ReportingAnalytics + Dashboard first, remaining screens can be simpler extractions |
| Test coverage slowing velocity | LOW | MEDIUM | Tests only in Sprint 10 — don't slow down migration sprints |

---

## 9.4 — 10 ANTI-PATTERNS TO AVOID

### 1. The Premature Deletion
**Why it's happening here:** Scaffold folders look "done" and tempt deletion before the live code is migrated.
**How to avoid it:** Follow the Strangler Fig 4-condition checklist. Never delete `src/app/components/X.tsx` until its replacement is verified.

### 2. The God Component Extraction Half-Measure
**Why it's happening here:** Assets.tsx at 3,400 lines tempts partial extraction — pulling out one drawer while leaving 2,800 lines behind.
**How to avoid it:** Commit to full decomposition per sprint plan. Sprint 5A does list + filters. Sprint 5B does drawers + detail. No partial states.

### 3. The Duplicate-Then-Forget Mirror
**Why it's happening here:** `src/features/` was already created as a copy of `src/app/components/` with zero cutover — 35-40% duplication.
**How to avoid it:** Never copy-paste a screen file. Always write fresh implementations using the new patterns (DataTable, form primitives, hooks). Reference the old file for business logic only.

### 4. The Hardcoded Hex Regression
**Why it's happening here:** 1,046 hardcoded hex values exist. New developers copy existing patterns.
**How to avoid it:** ESLint rule + PR review rejection rule. Use only Tailwind semantic classes or CSS variables.

### 5. The useState Explosion
**Why it's happening here:** Assets.tsx has 52 `useState` calls because all state lives in one component.
**How to avoid it:** Extract state into focused hooks (useAssetFilters, useAssetSelection, useTableState). Max 5-7 `useState` in any component.

### 6. The Inline Render Function
**Why it's happening here:** AuthScreen.tsx has 5 `renderX()` functions that should be components.
**How to avoid it:** Every render function becomes its own component file. Components compose — they don't contain internal rendering sub-routines.

### 7. The Feature Cross-Import
**Why it's happening here:** Without boundaries, a user feature might import an asset type directly.
**How to avoid it:** Shared types go in `src/types/`. Features only import from their own barrel or shared layers. ESLint can enforce this with import path restrictions.

### 8. The Config File That Does Nothing
**Why it's happening here:** `tailwind.config.ts` has zero effect in Tailwind v4 but might be created out of habit.
**How to avoid it:** All design tokens go in `src/styles/theme.css` `@theme {}` block. Delete any `tailwind.config.ts` on sight.

### 9. The Barrel File Wildcard
**Why it's happening here:** It's tempting to write `export * from './components'` for convenience.
**How to avoid it:** Explicit named exports only. Wildcards hide the public API and make tree-shaking harder.

### 10. The v1 API Pattern (MSW, ESLint)
**Why it's happening here:** Many tutorials and AI suggestions still use MSW v1 (`rest.get`) and ESLint v8 (`.eslintrc`).
**How to avoid it:** This plan uses MSW v2 (`http.get` + `HttpResponse.json`) and ESLint v9 (flat config `eslint.config.js`). Always verify the syntax matches the installed version.

---

---

# PHASE 10 — QUICK REFERENCE CARD

---

## 10.1 — CANONICAL IMPORT CHEATSHEET

| Resource | Correct Import |
|----------|---------------|
| shadcn Button | `import { Button } from '@/components/ui/button'` |
| DataTable | `import { DataTable } from '@/components/shared/DataTable'` |
| useAssets hook | `import { useAssets } from '@/features/assets'` |
| Theme tokens (TS) | `import { tokens } from '@/theme/tokens'` |
| cn() utility | `import { cn } from '@/lib/cn'` |
| StatusBadge | `import { StatusBadge } from '@/components/shared/StatusBadge'` |
| AssetFormSchema type | `import type { AssetFormValues } from '@/features/assets'` |
| ApiResponse type | `import type { ApiResponse } from '@/services/apiClient'` |
| Route constants | `import { ROUTES } from '@/constants/routes'` |
| useAuthStore | `import { useAuthStore } from '@/store/authStore'` |
| useTableState | `import { useTableState } from '@/hooks/useTableState'` |
| ColumnConfig type | `import type { ColumnConfig } from '@/types'` |
| Query keys | `import { queryKeys } from '@/lib/queryKeys'` |
| Form primitives | `import { FormInput, FormSelect } from '@/components/forms/FormInput'` |

---

## 10.2 — FILE CREATION CHECKLIST

Run this checklist before creating ANY new file:

- [ ] Does a component/hook already exist for this responsibility?
- [ ] Am I using `@/` alias (not relative `../../`)?
- [ ] Is this file in the correct feature folder or shared layer?
- [ ] Does this file have a single clear responsibility?
- [ ] Will this file stay under the line budget for its type?
- [ ] Am I reusing `FormInput`/`DataTable`/`PageShell` or rebuilding from scratch?
- [ ] Are all colors from tokens (no hardcoded hex)?
- [ ] Have I exported this from the feature's `index.ts` barrel?
- [ ] Is the component name descriptive and unique in the codebase?
- [ ] If this is a hook, does it manage exactly one concern?

---

## 10.3 — PR REVIEW REJECTION RULES

These 5 rules result in **automatic merge block** — no exceptions:

1. **Hardcoded hex color** anywhere in component code (use Tailwind classes or CSS variables)
2. **`@mui/icons-material` import** (use `lucide-react` — all icons have been mapped)
3. **Relative import deeper than one level** (`../../` or deeper — use `@/` alias)
4. **`any` type** without an explicit `// JUSTIFIED: [reason]` comment explaining why it cannot be typed
5. **New component over 400 lines** without a decomposition plan linked in the PR description

---

---

# PRE-EXECUTION SAFETY CHECKLIST

Complete ALL items before executing Phase 0.

- [ ] Clean git commit created — rollback point exists (`git add -A && git commit -m "snapshot: pre-refactor"`)
- [ ] Confirmed `src/lib/cn.ts` is in TIER B (not Tier A deletions) — it has live consumers
- [ ] `npm run build` passes before any deletions
- [ ] Strangler Fig Contract read and understood (section 1.5)
- [ ] Phase 4.0 auth skeleton will be implemented BEFORE Phase 3 router
- [ ] Lucide icon names verified against installed version (`lucide-react@^1.16.0`) before migration
- [ ] ESLint config enhancement targets existing `eslint.config.js` (v9 flat format)
- [ ] Tailwind token additions go into `src/styles/theme.css` `@theme inline {}` block — NOT `tailwind.config.ts`
- [ ] MSW handlers written in v2 syntax (`http` + `HttpResponse`, not `rest` + `ctx.json`)
- [ ] Sprint 5 is tracked as two separate sprints (5A and 5B) in sprint tracker
- [ ] `noUncheckedIndexedAccess` noise strategy understood (non-null assert `!` in safe array contexts)
- [ ] All team members aware that `src/app/components/` files are NEVER deleted until 4-condition checklist passes

---

*End of document.*
