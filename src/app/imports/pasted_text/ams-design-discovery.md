You are a senior product designer working inside an existing enterprise 
Asset Management System (AMS) design file. 

Before implementing ANYTHING, you must first perform a complete discovery 
pass of the existing design. Your job is to integrate missing flows and 
components INTO existing screens — not create new standalone screens 
unless absolutely no suitable existing screen exists.

The goal: zero duplication. Every addition must feel like it was always 
part of the original design.

═══════════════════════════════════════════════════════════════
PHASE 1 — DISCOVERY (Do this BEFORE any implementation)
═══════════════════════════════════════════════════════════════

Scan every existing frame, page, and component in this file and 
produce an inventory across these dimensions:

## 1.1 — SCREEN INVENTORY
List every existing screen/page by name and answer:
- What module does it belong to? 
  (Registration / Tracking / Transfer / Lifecycle / Disposal / 
   Inspection / Reporting / RBAC / Settings / Dashboard)
- What is the primary user action on this screen?
- What role(s) can access it?
- Does it have: empty state? loading state? error state?

Format:
| Screen Name | Module | Primary Action | Roles | States Present |
|-------------|--------|----------------|-------|----------------|

---

## 1.2 — COMPONENT & PATTERN INVENTORY
Identify every reusable component, atom, or pattern already in the 
design system. Catalogue:
- Modals (list all variants)
- Banners / Alert bars (inline, page-level, dismissible)
- Badges / Status tags (list all color-token mappings)
- Form elements (inputs, textareas, date pickers, file upload zones, 
  dropdowns, toggles, checkboxes)
- Buttons (primary, secondary, destructive, disabled, loading states)
- Cards (asset cards, info cards, action cards)
- Tables (column types, row actions, pagination)
- Navigation (sidebar items, header elements, breadcrumbs)
- Progress indicators (bars, spinners, step trackers)
- Tooltips (hover, info, warning variants)
- Notification/alert components

For each: note its exact name in the file so it can be reused precisely.

---

## 1.3 — DESIGN TOKEN INVENTORY
Extract and list:
- Color tokens: name → value (e.g., color-status-danger, 
  color-brand-primary)
- Typography styles: name → size/weight (e.g., body-md, heading-lg)
- Spacing tokens: name → value (e.g., space-4, space-8)
- Border radius, shadow, and elevation tokens if present

These are the ONLY values you may use. Flag if a token seems absent 
for a needed use case — do not invent; ask for guidance.

---

## 1.4 — EXISTING FLOW MAPPING
Trace the user flows that already exist:
- Asset Registration end-to-end flow
- Transfer initiation → approval → completion flow
- Inspection task → inspection → sign-off flow
- Disposal / Survey case flow
- User management flow
- Status change flow (if present)

For each flow: list the screens it passes through in order. 
Identify where the flow currently ends or breaks off.

---

## 1.5 — GAP MAPPING (Cross-reference with PRD Requirements)
After the inventory, cross-reference against these required items 
and mark the status of each:

Mark as one of:
✅ EXISTS — already in design, no action needed
⚙️ EXTEND — screen exists but needs a specific addition/section
➕ INSERT — new component/section to add into an existing screen
🆕 NEW SCREEN — genuinely no suitable screen exists; must create

Items to evaluate:

[ ] SAP Sync button + states on Asset Registration screen
[ ] Digital signature section (upload path) on Transfer detail page
[ ] Digital signature section (upload path) on Disposal report page
[ ] Digital sign-off modal (in-system signing)
[ ] 3-signatory status tracker (Initiating / Receiving / Approving)
[ ] Signature History collapsed panel (audit trail)
[ ] PDA mobile frame — Inspection Task List screen
[ ] PDA mobile frame — Active Inspection (scan + condition + photo)
[ ] PDA mobile frame — Batch Sign-Off screen
[ ] Offline mode banner (PDA screens)
[ ] Asset lock banner on Asset Detail page
[ ] Lock icon badge on Asset List rows
[ ] Disabled + tooltip state for locked action buttons
[ ] USD 2,000 classification indicator below value field
[ ] Override warning banner + reason field (Registration form)
[ ] Status change confirmation modal with justification textarea
[ ] Invalid transition disabled state + tooltip (e.g., Disposed lock)
[ ] External Auditor role option in User Create/Edit form
[ ] Date-bound access fields (start + expiry date pickers)
[ ] Access scope checkboxes for external auditors
[ ] "Access Expired" badge in User List
[ ] Persistent read-only banner (External Auditor's view)
[ ] Alert Rules section in Admin Settings
[ ] Configurable alert rule card (status + days + notify + toggle)
[ ] Alert banner on Dashboard (stuck assets notification)
[ ] Role badge in app header (next to user avatar)
[ ] Role-filtered sidebar navigation (hide inaccessible items)
[ ] SSO Authentication tab in Admin Settings
[ ] SSO configuration form + Test Connection + status indicator

Output this as a table:
| Requirement | Status | Target Screen | Action Required |
|-------------|--------|---------------|-----------------|

═══════════════════════════════════════════════════════════════
PHASE 2 — INTEGRATION RULES (Read before implementing anything)
═══════════════════════════════════════════════════════════════

Once Phase 1 is complete, apply these rules strictly:

RULE 1 — EXTEND BEFORE CREATING
If an existing screen can accommodate a missing element 
(new section, new panel, new modal trigger), add it there. 
Never create a duplicate screen.

RULE 2 — REUSE EXACT COMPONENTS
Use the component names identified in 1.2. Do not draw a new button 
if an existing button component exists. Do not create a new modal 
shell — use the existing modal component and populate it.

RULE 3 — MATCH EXISTING LAYOUT ANATOMY
Observe how existing detail pages are structured 
(e.g., header zone → metadata section → action zone → history panel). 
New sections must follow the same sectional anatomy and spacing rhythm.

RULE 4 — CONNECT ALL NEW FLOWS TO EXISTING FLOWS
Every new screen or state must be reachable from an existing screen 
via an existing interaction pattern (button click, tab, 
dropdown action, etc.). No orphan screens.

RULE 5 — STATES ARE MANDATORY
For every addition — whether a banner, modal, badge, or section — 
you must produce:
  - Default state
  - Loading / processing state (where applicable)
  - Success / confirmation state
  - Error / validation failed state
  - Empty state (where applicable)
Use existing state components from the design system.

RULE 6 — MOBILE = SEPARATE FRAME, SAME TOKENS
PDA/mobile screens are a new frame (390px) but must use 
the exact same design tokens as desktop. Do not introduce 
mobile-exclusive styles.

RULE 7 — AUDIT TRAIL IS ALWAYS LAST IN A FLOW
Every action that creates, modifies, or locks an asset must show 
where the audit log entry appears. Add a collapsed "Audit History" 
row or panel to the relevant existing section — do not create 
a separate audit screen.

═══════════════════════════════════════════════════════════════
PHASE 3 — IMPLEMENTATION (In order of priority)
═══════════════════════════════════════════════════════════════

Only after completing Phases 1 and 2, implement the following. 
For each item: state which existing screen you are extending, 
which existing components you are reusing, and what is being added.

---

### 🔴 PRIORITY 1 — CRITICAL

#### P1-A: SAP Sync — Asset Registration Screen
Extend: [existing Asset Registration screen identified in Phase 1]
Add to the page header/toolbar area:
- "Sync with SAP" button (use existing secondary or icon-button 
  component)
- Loading state: replace button label with spinner + "Syncing..."
- Success state: button returns to default + inline success message 
  "Sync complete — [N] draft assets added" (auto-dismiss after 5s)
- Error state: inline error banner below toolbar (use existing 
  error banner component) — "SAP sync failed. Please retry or 
  contact your administrator." with retry link
- Persistent label near button: "Last synced: [timestamp]" 
  (use existing caption/meta text style)
- In asset list below: newly synced assets appear with 
  "Draft — Pending Completion" status badge (map to existing 
  neutral/warning badge token)

---

#### P1-B: Digital Signature — Transfer & Disposal Pages
Extend: [existing Transfer Detail screen + Disposal/Survey screen 
         identified in Phase 1]

INSERT a new "Signature & Authorization" section 
BELOW the existing form fields and ABOVE the existing 
audit trail/history panel (following page anatomy from Rule 3).

Section contains:

SIGNATORY TRACKER (top of section):
- 3-row tracker showing:
  Row 1: Initiating Officer — [Name] — [Pending/Signed badge]
  Row 2: Receiving Custodian — [Name] — [Pending/Signed badge]
  Row 3: Approving Officer — [Name] — [Pending/Signed badge]
- Use existing status badge tokens for Pending (warning) 
  and Signed (success)

PATH A — Upload:
- File upload zone (drag & drop + browse) using existing 
  upload/file-input component
- Accepted formats label: "PDF, JPG, PNG accepted"
- After upload: show file row with filename, timestamp, 
  uploader name, and a remove option
- Section status badge updates: "Pending Signature" → 
  "Signed & Uploaded"

PATH B — Digital Sign:
- "Sign Digitally" secondary button triggers existing modal component
- Modal content:
  - Read-only fields: Full Name, Role/Designation, Date & Time
    (use existing read-only input or label-value pair component)
  - Signature area: bordered box (use existing card/container token) 
    with two sub-options:
    Option 1 — Type name (input field, renders in a cursive-style 
    using existing italic type token or closest available)
    Option 2 — Draw (canvas area — note: implement as placeholder 
    if canvas is not in existing component set, annotate for dev)
  - Legal disclaimer: small text (use existing caption style) — 
    "By signing, I confirm the accuracy of this record."
  - CTA: "Confirm & Sign" (primary button) | "Cancel" (secondary)
- After signing: modal closes, relevant signatory row updates to 
  "Signed" badge + shows name, role, timestamp inline

SIGNATURE HISTORY PANEL (bottom of section):
- Use existing collapsible/accordion component
- Label: "Signature History ([N] events)"
- Collapsed by default
- Expanded: list of log entries (who signed, when, which role, 
  which path — upload or digital)

---

#### P1-C: Asset Lock State
Extend: [existing Asset Detail screen + Asset List screen]

ON ASSET DETAIL:
- INSERT locked banner at very top of page content area 
  (above all sections, below page header) using existing 
  warning/error banner component
- Banner text: "🔒 Asset Locked — Active Survey Case 
  #[CASE-ID] is in progress. No modifications permitted 
  until the case is resolved."
- "View Survey Case →" inline link inside banner (use existing 
  link/anchor text style)

LOCKED ACTION BUTTONS:
- Identify existing "Delete", "Mark as Disposed", "Edit Status" 
  buttons on the detail page
- Apply disabled visual state using existing disabled button token
- Wrap each in existing tooltip component with text: 
  "Action unavailable — asset is under active survey"

ON ASSET LIST:
- Add lock icon (use existing icon set — padlock/lock icon) 
  as a badge overlay or inline indicator on locked asset rows
- Tooltip on hover: "Asset locked — active survey case in progress"

---

### 🟡 PRIORITY 2 — MEDIUM

#### P2-A: Classification Threshold Indicator — Registration Form
Extend: [existing Asset Registration form screen]
INSERT inline classification indicator directly below the 
"Unit Price / Total Value" input field:
- Live-updating badge: 
  ≥ USD 2,000 → "Capital Item" (use info/primary badge token) 
               + helper text: "SAP Asset ID will be retrieved 
                 automatically"
  < USD 2,000 → "Attractive Item" (use secondary badge token) 
               + helper text: "An internal Asset ID will be 
                 auto-generated"
- Override (authorized roles only):
  - Show "Override Classification" text link below the badge
  - On click: expand inline warning banner (use existing warning 
    banner) + "Reason for Override" textarea (mandatory)
  - Override badge: replace original badge with "Manually 
    Classified — [Capital/Attractive]" + warning icon

---

#### P2-B: Status Change — Justification Modal
Extend: [any screen where asset status dropdown or status 
         change button exists — identified in Phase 1]
- Status change action triggers existing modal component
- Modal: title "Confirm Status Change"
  - Status transition display: 
    "[From Status] → [To Status]" 
    (use existing status badge tokens for both)
  - Mandatory "Justification" textarea with character counter 
    (min 20 chars, use existing form validation pattern)
  - Optional: file attachment using existing upload component
  - "Confirm Change" (primary) | "Cancel" (secondary)
  - Inline validation: if textarea empty on submit, 
    show existing field-level error message component

DISPOSED LOCK:
- Find the status change control on asset detail page
- If current status is "Disposed": render control in disabled state
- Tooltip: "This asset has been disposed and cannot be 
  reassigned a new status."

---

#### P2-C: External Auditor — User Management
Extend: [existing User Create/Edit form in User Management screen]
- In the Role dropdown: add "External Auditor (Read-Only)" option
- When selected: conditionally reveal below the role field:
  - Access Start Date (use existing date picker component)
  - Access Expiry Date (use existing date picker component)
  - Scope of Access: checklist group (use existing checkbox 
    component) — Asset Register, Disposal Records, Transfer 
    History, Inspection Reports, Compliance Reports
  - Notes/Purpose field (use existing textarea component)

Extend: [existing User List table]
- For External Auditor rows: add "Expires: [date]" badge 
  (use existing neutral badge token)
- If expired: swap to "Access Expired" badge 
  (use existing error/danger badge token)

Extend: [app header/layout — when session role = External Auditor]
- INSERT persistent top banner (use existing info banner component):
  "You have read-only auditor access. Access expires on [DATE]."
- Hide (not disable) all edit, delete, and write-action buttons 
  across all modules for this role

---

#### P2-D: Configurable Alerts
Extend: [existing Admin Settings screen — add new "Alert Rules" tab 
         or section following the existing settings page anatomy]

Alert rule card (use existing card component):
- Dropdown: "Alert when asset remains in [STATUS] for more than"
- Inline numeric input + "days" label
- "Notify:" multi-select role chips 
  (use existing tag/chip component)
- Enable/Disable toggle (use existing toggle component)
- "Remove rule" icon button (destructive, use existing icon-button)
- "+ Add Another Rule" text button at bottom of rules list

Extend: [existing Dashboard screen]
- INSERT alert card/banner in the existing notifications or 
  summary area (follow existing dashboard card anatomy):
  "⚠️ [N] assets have been in '[STATUS]' status for more than 
  [X] days."
  "Review now →" link navigates to pre-filtered asset list

---

### 🟢 PRIORITY 3 — LOW

#### P3-A: Role Badge — App Header
Extend: [existing app header / navigation bar]
- Locate the existing user avatar + name component in the header
- INSERT role badge directly adjacent (use existing badge component, 
  map role to closest existing semantic color token):
  Administrator → primary token
  Standard User → neutral token  
  Field Inspector → info token
  Auditor → warning token
  External Auditor → error/danger token (read-only indicator)

Extend: [existing sidebar navigation]
- Apply role-based visibility: hide nav items not accessible 
  to current role (reference RBAC matrix from PRD Feature 6)
- Hidden items must be completely absent from DOM — 
  not greyed out or disabled (annotate this for developers)

---

#### P3-B: SSO Settings — Admin Settings
Extend: [existing Admin Settings screen — add "Authentication" tab]
Following the exact tab/section pattern already used in Settings:
- Toggle: "Enable Single Sign-On (SSO)" 
  (use existing toggle + label pattern)
- Conditionally shown on enable:
  - "Identity Provider" dropdown: Azure AD, Okta, SAML 2.0, Other
  - "SSO Metadata URL" text input
  - "Entity ID" text input
  - Connection status indicator: "Not Configured" (neutral) | 
    "Active" (success) | "Error" (danger)
    (use existing status badge or inline status component)
  - "Test Connection" button (secondary) with loading state
  - Test result: inline success or error message 
    (use existing inline feedback component)
- "Save Settings" primary button (following existing settings 
  save pattern)

═══════════════════════════════════════════════════════════════
PHASE 4 — POST-IMPLEMENTATION CHECKLIST
═══════════════════════════════════════════════════════════════

After all implementations are complete, confirm:

[ ] Every addition is on an existing screen (or documented why 
    a new screen was necessary)
[ ] No new design tokens were introduced
[ ] No existing screens were duplicated or replaced
[ ] Every new flow connects back to an existing screen via 
    an existing interaction pattern
[ ] Every added element has: default, loading/processing, 
    success, and error states
[ ] All 3 signatory states are represented (pending/signed/rejected)
[ ] PDA frames use the same tokens as desktop frames
[ ] Audit trail entry is shown for every action that modifies 
    asset data
[ ] Role-based visibility is annotated clearly for developers
[ ] Coverage table is updated to show 100% of PRD requirements 
    addressed