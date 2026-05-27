# AMS Frontend — Architecture & Scalability Audit

**Project:** AMS (Asset Management System) — Figma Make generated frontend  
**Stack:** React 18, TypeScript, Vite 5, Tailwind CSS 4, Radix/shadcn UI, MUI Icons  
**Audit date:** 2026-05-27  
**Auditor role:** Principal Frontend Architect / Enterprise Refactoring Review  
**Purpose:** Document the **real current state** of the codebase before further refactoring. Use this file as context for AI-assisted migration work.

---

## Document summary

| Item | Verdict |
|------|---------|
| **Overall maturity** | **2.4 / 5** — Polished UI prototype with partial enterprise scaffolding |
| **Enterprise readiness** | **3.0 / 10** — Not production-scalable for multi-team AMS yet |
| **UI / visual completeness** | **High** — Demo/PoC ready |
| **Architecture integration** | **Low** — New folders exist but runtime still uses legacy monolith |
| **Recommended approach** | Incremental cutover — **do not rewrite**; wire existing abstractions, delete duplicate mirror tree |

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Runtime architecture (what actually runs)](#2-runtime-architecture-what-actually-runs)
3. [Folder structure inventory](#3-folder-structure-inventory)
4. [Architecture audit](#4-architecture-audit)
5. [Reusability audit](#5-reusability-audit)
6. [Component system audit](#6-component-system-audit)
7. [Form architecture audit](#7-form-architecture-audit)
8. [Table architecture audit](#8-table-architecture-audit)
9. [Design system audit](#9-design-system-audit)
10. [TypeScript quality audit](#10-typescript-quality-audit)
11. [Performance audit](#11-performance-audit)
12. [Feature boundary audit](#12-feature-boundary-audit)
13. [Technical debt report](#13-technical-debt-report)
14. [Refactor priority matrix](#14-refactor-priority-matrix)
15. [Enterprise readiness scores](#15-enterprise-readiness-scores)
16. [Final verdict & prioritized next steps](#16-final-verdict--prioritized-next-steps)
17. [Key file reference](#17-key-file-reference)

---

## 1. Executive summary

### Overall frontend maturity

The AMS frontend is a **visually complete Figma Make export** that has begun migration toward enterprise feature-based architecture. The **UI works and builds successfully**, but the **new architecture is mostly scaffolding** — not wired into the live runtime path.

### Scalability verdict

- **Demo / PoC:** Acceptable
- **Single-team maintenance:** Difficult (god components, 3k+ line files)
- **Multi-team enterprise AMS:** **Not ready**

### Enterprise readiness verdict

**Not enterprise-ready.** Missing: real routing, API/data layer, auth session management, lazy loading, test harness, enforced design tokens, and completed feature cutover.

### Biggest strengths

1. **Complete shadcn/Radix UI kit** — ~49 primitives under `src/app/components/ui/`
2. **`TablePagination` + `paginateData<T>()`** — Genuinely reused across ~15 screens (~18 paginated tables)
3. **Design token documentation** — `src/theme/`, `src/styles/theme.css`, status color helpers
4. **Natural domain seams** — `assets/`, `locations/`, `requests/` subfolders under components
5. **TypeScript strict mode** — Enabled in `tsconfig.app.json`
6. **Migration intent visible** — `features/`, `pages/`, `constants/`, `providers/`, path aliases exist

### Biggest risks

1. **Runtime still monolithic** — All live code flows through `LegacyApp.tsx` → `src/app/components/*`
2. **~35–40% LOC duplication** — `src/features/` mirrors `src/app/components/` (byte-identical copies)
3. **God components** — 7 files exceed 1,000 lines; `Assets.tsx` has **52 `useState` calls**
4. **Dead abstractions** — `FormInput`, `DataTable`, global hooks, `authService`, `routeConfig` are **not consumed**
5. **Broken scaffold imports** — Feature copies reference `./shared/`, `./ui/` paths that don't exist in feature tree
6. **Design tokens not applied** — ~1,046 hardcoded hex values across 100 `.tsx` files

### Live vs scaffold (diagram)

```
main.tsx
  └── src/app/App.tsx              ← bootstrap (9 lines) ✓
        └── src/app/router.tsx
              └── src/app/LegacyApp.tsx   ← ALL routing + auth + page state ✓ LIVE
                    └── src/app/components/*   ← ALL business UI ✓ LIVE

src/features/*     ← duplicate copies, 0 runtime imports ✗
src/pages/*        ← 1-line re-exports to app/components ✗
src/routes/*       ← routeConfig exists, React Router NOT installed ✗
src/components/*   ← parallel UI kit, 0 @/components imports ✗
src/services/*     ← apiClient scaffold, 0 imports ✗
```

---

## 2. Runtime architecture (what actually runs)

### Entry point

| File | Role |
|------|------|
| `src/main.tsx` | Vite entry — mounts `src/app/App.tsx`, imports `src/styles/index.css` |
| `src/app/App.tsx` | Thin shell — wraps `RootProviders` + `AppRouter` |
| `src/app/providers.tsx` | Delegates to `src/providers/AppProviders.tsx` |
| `src/app/router.tsx` | **Only renders `<LegacyApp />`** |
| `src/app/LegacyApp.tsx` | **Production routing** — auth gate, hash navigation, page switching |

### Routing (live)

- **No React Router** — `react-router-dom` is **not in package.json**
- **Hash-based SPA** — `window.location.hash` + `hashchange` listener
- **Page state** — `useState<PageType>` with switch statement for page components
- **Auth** — Local boolean `isAuthenticated` — not session/token based
- **Deep linking** — Partial via hash (e.g. `#assets?assetId=...`)

### Data (live)

- **Mock data** — Inline arrays and `setTimeout` simulations
- **No API client usage** — `src/services/apiClient.ts` imports `axios` but **axios is not in package.json**
- **No TanStack Query** — Not installed

### Providers (live)

- `ThemeProvider` — from `src/app/contexts/ThemeContext.tsx` (re-exported via `src/providers/`)
- `LanguageProvider` — from `src/app/contexts/LanguageContext.tsx`
- i18n translations embedded in `LanguageContext.tsx`

---

## 3. Folder structure inventory

### Top-level `src/` directories

| Directory | Files (approx) | Status |
|-----------|----------------|--------|
| `app/` | ~148 | **LIVE monolith** — components, contexts, LegacyApp |
| `features/` | 73 (.tsx + .ts) | **Scaffold** — ~90% duplicate copies, unwired |
| `components/` | 66 | **Scaffold** — parallel shadcn + tables, unwired |
| `pages/` | 15 | **Wrappers** — re-export `app/components/*` |
| `layouts/` | 3 | **Duplicate** — `DashboardLayout.tsx` = copy of `Layout.tsx`, unused |
| `providers/` | 4 | **Partial** — re-exports app contexts |
| `routes/` | 4 | **Stub** — pass-through ProtectedRoute/AuthRoute |
| `services/` | 4 | **Stub** — apiClient never imported |
| `constants/` | 5 | **Defined** — routes, roles, permissions (not wired to router) |
| `hooks/` | 1 | **Duplicate** — copy of `app/hooks/index.ts`, unused |
| `lib/` | 2+ | **Partial** — `cn.ts`, `dateFormatter.ts` |
| `theme/` | 2+ | **Documented** — tokens not imported by live screens |
| `types/` | 1 | **Scaffold** — shared types defined, underused |
| `styles/` | 6 CSS files | **Live** — Tailwind + theme CSS vars |
| `store/`, `schemas/`, `config/` | Empty/minimal barrels | **Placeholder** |

### `src/app/components/` breakdown (live)

| Subfolder | .tsx files | Notes |
|-----------|------------|-------|
| Root screens | 31 | Dashboard, Assets, AuthScreen, Layout, etc. |
| `ui/` | 49 | shadcn/Radix primitives — **keep** |
| `assets/` | 19 | Best domain boundary — drawers, types, sub-views |
| `shared/` | 9 | TablePagination, modals, skeletons — **reusable** |
| `locations/` | 7 | Location hierarchy, forms |
| `requests/` | 4 | Transfers, Survey, Inspections, Disposal |
| `forms/` | 1 | Form primitives — **unused by screens** |
| `figma/` | 1 | ImageWithFallback |

### Largest files (by line count)

| Lines | Path | Notes |
|-------|------|-------|
| 4,151 | `ReportingAnalytics.tsx` | God component — duplicated in features/ |
| 3,304 | `Assets.tsx` | God component — 52 useState |
| 2,145 | `assets/AssetDetailView.tsx` | God component |
| 1,915 | `UserManagement.tsx` | God component |
| 1,589 | `WorkflowManagement.tsx` | God component |
| 1,429 | `RFIDSettings.tsx` | 3 paginated tables inside |
| 1,184 | `DraftAssets.tsx` | Large list screen |
| 1,170 | `RoleManagement.tsx` | Access control |
| 1,063 | `Dashboard.tsx` | Charts + KPIs |
| 1,053 | `assets/AssetTransfers.tsx` | Asset sub-module |
| 1,032 | `AssetLifecycle.tsx` | Lifecycle views |
| 1,025 | `Layout.tsx` | App shell + search mock + nav |
| 985 | `AuthScreen.tsx` | 5 inline auth step renderers |
| 923 | `ActionLog.tsx` | Audit log table |

**Enterprise guideline:** Components should stay under ~200–400 lines. **7 files exceed 1,000 lines.**

---

## 4. Architecture audit

### Architecture quality score: **2.5 / 10**

### Problems

| Problem | Severity | Details |
|---------|----------|---------|
| Incomplete strangler migration | CRITICAL | New folders created without cutting over imports |
| Mirror duplication | CRITICAL | 39/47 feature `.tsx` files duplicate app/components |
| Routing in component state | HIGH | LegacyApp owns navigation, breadcrumbs, metadata |
| Layout owns business data | HIGH | Layout.tsx embeds mockAssets, search modules |
| Dual UI libraries | MEDIUM | Radix/shadcn + MUI icons + MUI CircularProgress |
| Contexts in wrong layer | MEDIUM | Still in `app/contexts/`, providers only re-export |

### Scalability risks

- No lazy-loaded routes — all pages eagerly imported in LegacyApp
- No enforced feature boundaries — teams cannot own domains independently
- Duplicate tree doubles drift risk on every change
- Breadcrumb/page metadata duplicated between LegacyApp and Layout

### Maintainability risks

- Changes require editing 3k+ line files
- Unclear source of truth (app vs features vs components)
- Scaffold looks "done" but increases cognitive load

---

## 5. Reusability audit

### Reusable maturity score: **3.5 / 10**

### Estimated duplication

| Category | ~% of codebase | Notes |
|----------|----------------|-------|
| app ↔ features mirror | 35–40% | Byte-identical copies |
| Inline pattern repetition | 10–15% | Tables, filters, forms per screen |
| Dead scaffold | ~15% | Unused forms, DataTable, hooks |
| **Total effective duplication** | **~45–55%** | Including dead code |

### What is genuinely reusable today

| Asset | Path | Status |
|-------|------|--------|
| TablePagination | `app/components/shared/TablePagination.tsx` | **Active — 15+ consumers** |
| paginateData<T>() | Same file | **Active** |
| shadcn UI kit | `app/components/ui/*` | **Active** |
| DeleteConfirmDialog | `app/components/shared/` | Active |
| DigitalSignatureModal | `app/components/shared/` | Active |
| SkeletonLoaders | `app/components/shared/` | Active |
| Status color helpers | `src/theme/colors.ts` | Defined, underused |
| Form primitives | `components/ui/forms/index.tsx` | **Built, 0 consumers** |
| DataTable<T> | `components/tables/DataTable.tsx` | **Built, 0 consumers** |

### Repeated patterns (extraction opportunities)

1. Page shell: title + filter toolbar + table + pagination (15+ screens)
2. Drawer forms: asset lifecycle drawers share footer/actions/validation shape
3. KPI stat cards: Dashboard, ReportingAnalytics
4. Filter chips + search bar: Assets, UserManagement, ActionLog
5. Auth step forms: 5 inline render functions in AuthScreen
6. Password strength: 4 separate implementations

### Duplication details

| Pattern | Copies | Active consumers |
|---------|--------|------------------|
| PasswordStrength logic | 4 | AuthScreen, ChangePasswordDialog (+ 2 unused in features/auth) |
| FormInput / forms index | 2 | **0** |
| TablePagination | 3 | 1 (app/shared) |
| Full screen components | 2× | app/ only |
| Theme/hooks/cn | 2× each | app/ primarily |

### Import path usage

| Import style | Files using it |
|--------------|----------------|
| Relative to `app/components` | ~19+ |
| `@/app/components` | 3 (auth feature stubs) |
| `@/components` | **0** |
| `@/features` | **0** |

All 14 `pages/*.tsx` files re-export from `../app/components/*`.

---

## 6. Component system audit

### Component quality score: **4 / 10** (UI kit pulls average up; domain screens pull down)

### God components (CRITICAL)

| File | Lines | useState (where counted) | Issue |
|------|-------|--------------------------|-------|
| ReportingAnalytics.tsx | 4,151 | High | Charts + filters + tables + drill-down in one file |
| Assets.tsx | 3,304 | **52** | List + filters + detail + drawers + bulk actions |
| AssetDetailView.tsx | 2,145 | High | Full asset detail orchestration |
| UserManagement.tsx | 1,915 | High | CRUD + modals + table |
| AuthScreen.tsx | 985 | ~20 | 5 auth steps inline |
| Layout.tsx | 1,025 | ~15 | Shell + search + mock data + nav |

### AuthScreen structure

- **985 lines** total
- **7 inline functions** inside component: Spinner, renderLogin, renderForgotEmail, renderOtpVerification, renderResetPassword, renderSuccess, getCurrentStep
- **Simulated auth** — setTimeout, hardcoded OTP `"1234"`
- **~42 hardcoded hex colors**
- Parallel feature forms exist in `features/auth/components/` but **AuthScreen does not import them**

### Anti-patterns

- Inline render functions instead of composed child components
- Module-level color constants duplicating theme (`SIDEBAR_BG = "#121321"` in Layout)
- Mock data embedded in layout shell
- Feature scaffold copies with broken relative imports
- Minimal use of `React.memo` / `useCallback` in domain screens (~16 files in app/components)

### Accessibility

- Radix/shadcn primitives provide baseline a11y
- Domain screens use raw `<input>` in auth flows
- aria-* usage concentrated in UI kit, not domain screens
- **Score: ~5 / 10**

---

## 7. Form architecture audit

### Form maturity score: **1.5 / 10**

### Current patterns

| Pattern | Prevalence |
|---------|------------|
| Raw `<input>` + useState | **Dominant** (AuthScreen, many flows) |
| shadcn Input + local state | Common (filters, search) |
| shadcn Form + FormField | Rare (some asset drawers) |
| react-hook-form + zod | **Scaffold only — 0 screen adoption** |

### Built but unused

- `src/components/ui/forms/index.tsx` — FormInput, FormSelect, FormTextarea, FormCheckbox, FormDatePicker, FormActions
- Duplicate: `src/app/components/forms/index.tsx` (same content)
- `features/auth/schemas/loginSchema.ts` — never imported
- `@hookform/resolvers` and `zod` in package.json — ready but unwired

### Form duplication hotspots

- AuthScreen (985 lines) vs ChangePasswordDialog — duplicate password strength
- 6+ asset drawers each reimplement field layout and submit/cancel footers
- User/Role management inline modals with repeated field structures

---

## 8. Table architecture audit

### Table maturity score: **2.5 / 10**

### Active pattern (consistent but not abstracted)

```
Screen Component
  ├── useState(filters, sort, page, pageSize, selection)
  ├── inline column definition array
  ├── paginateData(data, page, pageSize)
  ├── hand-built <Table><TableHeader>...
  └── <TablePagination />
```

### Adoption

| Component | Consumers |
|-----------|-----------|
| TablePagination (app/shared) | ~15 screens, ~18 table instances |
| paginateData<T>() | Same |
| DataTable<T> (components/tables) | **0** |
| TableToolbar | **0** |
| useTableState | **0** |
| ColumnConfig<T> (src/types) | Defined, not used by screens |

### Screens using TablePagination

RoleManagement, Assets, UserManagement, Categories, ActionLog, WorkflowManagement, RFIDSettings (×3 tables), InventorySheets, FindExtra, DraftAssets, AssetSurveys, AssetTransfers, AssetInspections, AssetDisposals, AssetLifecycle

### Issue

Feature mirror copies import `./shared/TablePagination` but **no `shared/` folder exists under features** — broken if feature tree were wired without fixes.

---

## 9. Design system audit

### Design system maturity score: **2.5 / 10**

### Token infrastructure (strong on paper)

| Asset | Path | Status |
|-------|------|--------|
| CSS variables | `src/styles/theme.css` | Live in CSS pipeline |
| TS token object | `src/theme/index.ts` | Complete — colors, spacing, typography, shadows |
| Status helpers | `src/theme/colors.ts` | getStatusColorClasses, etc. |
| shadcn semantic classes | UI primitives | Partial (`bg-primary`, `text-muted-foreground`) |

### Runtime adoption (weak)

| Signal | Count |
|--------|-------|
| Hardcoded hex in .tsx | ~1,046 across 100 files |
| Inline style={{ | 131 across 19 files (69% in Layout) |
| @/theme imports in live screens | **0** |

### Top offenders

| File | Hex count |
|------|-----------|
| Layout.tsx | 49 |
| ReportingAnalytics.tsx | 46 |
| AuthScreen.tsx | 42 |
| WorkflowManagement.tsx | 40 |

### Dual source of truth

Layout uses `SIDEBAR_BG = "#121321"` while same value exists in theme.css as `--chorus-*` variables. Dashboard chart colors use raw hex (`#4F83E3`, `#EF652B`) instead of tokens.

---

## 10. TypeScript quality audit

### TypeScript score: **6 / 10**

### Positive

- `strict: true`
- Domain types: `assets/types.ts`, `locations/types.ts`, etc.
- Shared types in `src/types/index.ts`: PageType, AssetStatus, ColumnConfig, PaginationState, ApiResponse
- Most component props typed

### Negative

| Issue | Count | Examples |
|-------|-------|----------|
| `any` / `as any` | ~14 real hits | RoleManagement permissions, ReportingAnalytics sorted data |
| Record<string, any> | 3 | locations/types.ts |
| noUnusedLocals/Parameters | **false** | Allows dead imports |
| Shared types unused | High | ColumnConfig, FilterState not used in screens |
| No API types | — | All data is mock |

### Path aliases

Configured in `tsconfig.app.json`: `@/*`, `@/features/*`, `@/components/*`, etc.  
Vite only aliases `@` → `src`.  
**Minimal actual usage** — most code uses relative imports.

---

## 11. Performance audit

### Performance score: **3 / 10**

| Risk | Severity | Evidence |
|------|----------|----------|
| No code splitting | HIGH | All pages imported in LegacyApp |
| No lazy loading | HIGH | Zero React.lazy in app |
| Giant re-render surfaces | HIGH | 4k-line components, Assets 52 useState |
| Missing memoization | MEDIUM | ~16 files use memo/callback in app/components |
| Dual icon libraries | MEDIUM | MUI icons + lucide |
| Heavy chart libs | MEDIUM | recharts in Dashboard, ReportingAnalytics |
| Large initial bundle | MEDIUM | 14k+ modules in production build |

Acceptable for demo. **Not acceptable for production** without route-based splitting.

---

## 12. Feature boundary audit

### Feature boundary score: **2 / 10**

### Scaffolded features (unwired)

auth, assets, users, access, locations, reports, notifications, settings, profile, audit, inventory, compliance, requests, help

### Actual runtime boundaries

| Domain | Boundary quality | Notes |
|--------|------------------|-------|
| assets/ subfolder | **Best** | 19 files — drawers, types — but Assets.tsx still 3,304 lines |
| locations/ subfolder | Good | 7 files |
| requests/ subfolder | Good | 4 files |
| auth | None | Monolithic AuthScreen |
| users vs access | Confused | UsersAccessManagement live; scaffold splits users/ + access/ |
| settings | None | RFIDSettings, WorkflowManagement as root siblings |
| reports | None | Single 4,151-line file |

### Coupling

- Features cannot import from each other via public API — nothing uses features at all
- Layout imports ChangePasswordDialog, NotificationBell directly from app/components
- No session/auth context — boolean flag in LegacyApp

---

## 13. Technical debt report

| Debt item | Rank | Impact |
|-----------|------|--------|
| Duplicate app ↔ features mirror tree | **CRITICAL** | Double maintenance, broken imports, contributor confusion |
| God components (7 files > 1,000 lines) | **CRITICAL** | Unmaintainable, untestable, perf risk |
| Unwired architecture scaffold | **CRITICAL** | False migration progress |
| axios in apiClient but not in package.json | **HIGH** | Build fails when services imported |
| No React Router despite routeConfig | **HIGH** | No proper deep links/guards |
| Mock auth (boolean flag) | **HIGH** | Not production-safe |
| ~1,046 hardcoded hex values | **HIGH** | Theme drift, dark mode issues |
| Dead form/table abstractions | **MEDIUM** | Source of truth confusion |
| `any` in RBAC/reporting | **MEDIUM** | Runtime bug risk |
| Dual UI stacks (Radix + MUI) | **MEDIUM** | Bundle bloat |
| Unused global hooks | **MEDIUM** | Dead code |
| No test infrastructure | **MEDIUM** | Zero refactor safety net |
| AI markdown in app/imports/ | **LOW** | Clutter (excluded from TS) |
| App-2.tsx orphan | **LOW** | Dead file |

---

## 14. Refactor priority matrix

### KEEP AS IS

| Item | Reason |
|------|--------|
| `src/app/components/ui/*` | Solid shadcn/Radix primitives |
| `TablePagination` + `paginateData` | Proven cross-screen pattern |
| `src/styles/theme.css` | CSS variable foundation |
| `src/theme/colors.ts` | Status helpers — wire, don't rewrite |
| `DeleteConfirmDialog`, `DigitalSignatureModal`, `SkeletonLoaders` | Generic, working |
| Asset subfolder structure | Natural domain boundary |
| `LanguageContext`, `ThemeContext` | Working — relocate later |
| `strict: true` in tsconfig | Keep; tighten unused checks later |
| Path alias configuration | Keep; enforce usage |

### REFACTOR LIGHTLY

| Item | Action |
|------|--------|
| LegacyApp.tsx | Extract metadata to constants; then replace with router |
| Layout.tsx | Extract nav config, remove mock search data, apply tokens |
| ChangePasswordDialog | Share password strength with auth feature |
| AuthScreen | Split into step components (stubs exist in features/auth) |
| src/providers/ | Move contexts from app/contexts/ |
| Duplicate cn, hooks, theme | Single canonical copy under src/lib, src/hooks, src/theme |

### EXTRACT REUSABLES

| Item | Target location |
|------|-----------------|
| Page shell (header + toolbar + table + pagination) | layouts/ or components/shared/ |
| DataTable<T> | components/tables/ (already scaffolded) |
| Form primitives | components/ui/forms/ (already built) |
| PasswordStrengthIndicator | features/auth/components/ (single canonical) |
| TableToolbar, TableEmptyState | components/tables/ |
| StatCard, PageHeader | components/shared/ (exists in shared-ui) |
| DrawerFormFooter | components/shared/ |

### REBUILD / RESTRUCTURE

| Item | Reason |
|------|--------|
| src/features/ duplicate tree | Delete OR cut over — cannot keep both |
| Assets.tsx (3,304 lines) | Split list, filters, detail, hooks, services |
| ReportingAnalytics.tsx (4,151 lines) | Split charts, filters, drill-down |
| UserManagement.tsx (1,915 lines) | Split table, forms, role assignment |
| Routing | React Router + ProtectedRoute — retire hash LegacyApp |
| Data layer | TanStack Query + feature services |
| Auth | Session context + token management |
| pages/ layer | Thin orchestrators importing from features/ |

---

## 15. Enterprise readiness scores

| Dimension | Score (1–10) | Notes |
|-----------|--------------|-------|
| Architecture | 2.5 | Monolith + unwired scaffold |
| Scalability | 2.0 | No splitting, no domain isolation |
| Reusability | 3.5 | Pagination works; most abstractions dead |
| Maintainability | 2.5 | God files dominate |
| Type Safety | 6.0 | Strict mode; some `any` in hot paths |
| Design Consistency | 2.5 | Tokens exist, not enforced |
| Performance | 3.0 | No lazy loading |
| Team Scalability | 2.0 | Single folder owns everything |
| **Overall** | **3.0** | Structured prototype, not enterprise |

### Maturity level

```
[Raw Figma export] → [Structured Prototype ← YOU ARE HERE] → [Mid-scale SaaS] → [Enterprise]
```

---

## 16. Final verdict & prioritized next steps

### Is this production scalable?

**No** for multi-team enterprise AMS. **Yes** for UI demo/PoC.

### Is this maintainable long-term?

**Not in current form.** God components and duplicate tree will compound debt every sprint.

### Prioritized execution order

#### Phase 0 — Stop the bleeding (1–2 days)

1. **Delete or freeze** duplicate `src/features/` mirror tree OR commit to cutover — pick one source of truth
2. Remove dead duplicates (second TablePagination, duplicate forms index)
3. Install `axios` OR remove `apiClient` until needed
4. Document that `src/app/components/` is canonical until cutover complete

#### Phase 1 — Highest ROI (1–2 weeks)

1. Wire **AuthScreen → features/auth/components** (LoginForm, OtpInput, etc. already exist)
2. Build and adopt **DataTable<T>** — wire existing scaffold
3. Wire **form primitives** into auth + 2–3 asset drawers as proof
4. Split **Assets.tsx** — largest domain, clearest boundary
5. Extract shared **PasswordStrengthIndicator**

#### Phase 2 — Architecture cutover (2–3 weeks)

1. Add **react-router-dom**; wire `src/routes/routeConfig.ts`; retire LegacyApp hash routing
2. Move contexts to `src/providers/` (not re-export)
3. Real feature modules with `index.ts` public APIs
4. Add **@tanstack/react-query** + feature services
5. Lazy-load route pages

#### Phase 3 — Production hardening (ongoing)

1. Token enforcement on Layout, Dashboard, AuthScreen
2. Enable `noUnusedLocals` / `noUnusedParameters`
3. Vitest + React Testing Library
4. Remove `any` from RoleManagement, ReportingAnalytics
5. Consolidate MUI icons → lucide where possible

### What NOT to do

- Do not rewrite the entire app
- Do not keep both app/ and features/ copies in sync
- Do not add more scaffold folders without wiring existing ones
- Do not refactor ReportingAnalytics before Assets and Auth (lower risk domains first)

---

## 17. Key file reference

### Live runtime (edit these for immediate behavior)

| File | Purpose |
|------|---------|
| `src/main.tsx` | Entry point |
| `src/app/App.tsx` | Bootstrap shell |
| `src/app/LegacyApp.tsx` | Auth + routing + page switching |
| `src/app/components/Layout.tsx` | App shell, sidebar, header |
| `src/app/components/AuthScreen.tsx` | Login / forgot password / OTP / reset |
| `src/app/components/Assets.tsx` | Main asset management screen |
| `src/app/components/shared/TablePagination.tsx` | Shared pagination |

### Scaffold (do not assume these are wired)

| File | Purpose |
|------|---------|
| `src/pages/*.tsx` | Re-exports to app/components |
| `src/features/*/index.ts` | Feature public APIs (unused) |
| `src/routes/routeConfig.ts` | Route definitions (unused) |
| `src/services/apiClient.ts` | Axios client (unused; axios missing from package.json) |
| `src/components/tables/DataTable.tsx` | Generic table (unused) |
| `src/components/ui/forms/index.tsx` | Form primitives (unused) |

### Config

| File | Notes |
|------|-------|
| `package.json` | No react-router, tanstack query, axios, or test runner |
| `tsconfig.app.json` | strict: true; path aliases configured |
| `vite.config.ts` | `@` alias → src; Tailwind v4 plugin |
| `src/styles/theme.css` | Design tokens as CSS variables |

### Dependencies present

React 18, Vite 5, TypeScript 5.3, Tailwind 4, Radix UI, shadcn-style components, MUI icons/material, react-hook-form, zod, recharts, motion, sonner

### Dependencies missing (typical enterprise)

react-router-dom, @tanstack/react-query, axios, vitest, @testing-library/react

---

## Appendix: Migration state checklist

Use this checklist when continuing refactor work:

- [ ] Single source of truth — app/components OR features/, not both
- [ ] LegacyApp retired — React Router mounted
- [ ] All pages import from features/ public API
- [ ] AuthScreen uses features/auth/components
- [ ] DataTable adopted by ≥3 list screens
- [ ] Form primitives used in auth + drawers
- [ ] axios installed and apiClient imported by authService
- [ ] No file > 500 lines in features/
- [ ] @/ path aliases used consistently
- [ ] Hardcoded hex reduced in Layout, AuthScreen, Dashboard
- [ ] Lazy loading on route pages
- [ ] Basic test harness in place

---

*End of audit document. Last updated: 2026-05-27.*
