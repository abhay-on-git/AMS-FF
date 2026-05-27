You are a senior UX auditor and product designer. Your task is to conduct a 
thorough audit of the current design system against the provided PRD for an 
Asset Management System (AMS). 

Your goal: Identify every feature, flow, user role, and requirement mentioned 
in the PRD — and verify whether it is addressed, partially addressed, or 
missing in the current design.

---

## AUDIT SCOPE

Evaluate the design against each of the following dimensions:

---

### 1. USER ROLES & ACCESS (Key Feature 6 – RBAC)
Check whether the design includes distinct UI states or flows for:
- [ ] Administrator — full access to all modules
- [ ] Standard User (SMIO / Admin Officer) — register, transfer, dispose, report
- [ ] Auditor — read-only views across all modules
- [ ] Approver/Reviewer — approve transfers, survey cases, lifecycle changes
- [ ] External Auditor — restricted, time-bound, view-only access
- [ ] Custom/configurable roles (e.g., Disposal Focal Point, PDA User)
- [ ] Field-office-level access restriction (data scoped by location)

Flag: Are role-specific screens or permission states visually differentiated 
in the design? Are there screens for user management (create, deactivate, 
assign roles, view activity logs)?

---

### 2. ASSET REGISTRATION FLOW (Key Feature 1)
Check for screens/components covering:
- [ ] Auto-populated draft from SAP ECC 6.0 GRN trigger
  - PO number, GRN number, item description, supplier, quantity, unit price, 
    total cost, acquisition date, currency
- [ ] Asset ID logic — SAP ID for capital items (≥ USD 2,000), 
      auto-generated ID for attractive items (< USD 2,000)
- [ ] Automated classification (capital vs attractive) with override (authorized roles only)
- [ ] Completion workflow form — serial number, custodian, room/building/site, 
      condition, barcode/tag ID
- [ ] Bulk registration via Excel template (download prefilled → complete → upload)
- [ ] Validation feedback — mandatory fields, duplicate serial detection, 
      classification logic errors
- [ ] Audit trail confirmation on creation/modification

---

### 3. ASSET TRACKING & STATUS MONITORING (Key Feature 2)
Check for:
- [ ] Asset list/register view with filtering by: status, location, custodian, 
      category, field office, PO number
- [ ] Search functionality across multiple parameters
- [ ] Asset detail view showing full current state
- [ ] Historical change log per asset (status, location, custodian changes)
- [ ] Visual status indicators (In Use, Damaged, Retired, Disposed, etc.)

---

### 4. ASSET TRANSFER MANAGEMENT (Key Feature 3)
Check for screens/flows covering:
- [ ] Transfer initiation screen (select asset → assign new custodian/location/office)
- [ ] Three transfer types: Intra-departmental, Intra-field, Inter-field
- [ ] Transfer reason input field
- [ ] Unique Transfer ID assignment confirmation
- [ ] Auto-generated PDF transfer form with: asset details, current/new 
      custodian, date, reason, transfer ID, signature fields
- [ ] Digital signature support OR print-and-upload flow
- [ ] Upload attachment back to transfer record
- [ ] Validation — transfer rights check, active custodian/location, 
      blocked if asset is disposed/missing/under survey
- [ ] Approval workflow for inter-field or high-value transfers
- [ ] Transfer audit log: date/time, before/after, initiating user, reason
- [ ] Notifications to receiving custodian and supervisor
- [ ] Digital acknowledgment/confirmation of receipt
- [ ] Transfer reports — filterable by office, date, custodian, reason, status

---

### 5. ASSET LIFECYCLE MANAGEMENT (Key Feature 4)
Check for:
- [ ] All 8 lifecycle stages represented: Registered → In Use → Transferred → 
      Under Verification → Available → Damaged → Retired (pending disposal) → Disposed
- [ ] Valid/invalid status transition controls in the UI
- [ ] Justification/comment required on status change
- [ ] Lifecycle history timeline per asset (exportable)
- [ ] "Retired" assets flagged for disposal processing
- [ ] Final disposal locked until approvals completed
- [ ] Disposal record: method, date, documentation reference
- [ ] Admin override with full audit trail
- [ ] Configurable alerts for assets stuck in Retired/Damaged beyond threshold

---

### 6. SURVEY & DISPOSAL WORKFLOW (Key Feature 5)
Check for:
- [ ] Survey/disposal case initiation screen (single or batch assets)
- [ ] Unique case reference assignment
- [ ] Auto-populated metadata: asset ID, description, NBV, location, reason
- [ ] Auto-generated disposal report (PDF/editable) with signature fields
- [ ] Asset lock during active survey case (no delete/dispose until approved)
- [ ] Approval capture: date, method, uploaded scanned report
- [ ] Full audit trail: initiator, actions, approvals, confirmation
- [ ] Configurable approval levels (HQ, field, local)
- [ ] Alerts for pending survey cases beyond a set threshold

---

### 7. PHYSICAL INSPECTION & PDA INTEGRATION (Key Feature 8)
Check for:
- [ ] Inspection task assignment screen (by location, custodian, or asset type)
- [ ] Mobile/PDA inspection interface showing: asset list, scan trigger, 
      condition options (Verified / Missing / Damaged / Requires Action)
- [ ] Inspection notes and condition/location update capability
- [ ] Barcode scanning interface (plus optional QR/RFID mention)
- [ ] Offline mode indicator and sync status
- [ ] Customizable inspection checklist UI
- [ ] Image capture interface (tag photo, damage evidence)
- [ ] Inspector digital sign-off screen (name + timestamp)
- [ ] Optional second-level supervisor confirmation
- [ ] Auto-generated inspection report: asset IDs, status, notes, photos, 
      inspector, timestamp, summary statistics
- [ ] Report stored and linked to task and assets
- [ ] Admin view: inspection progress, completion rates, overdue exceptions

---

### 8. REPORTING & ANALYTICS (Key Feature 7)
Check for:
- [ ] Dashboard with: total asset value/count by field/location, 
      lifecycle stage breakdown, pending actions, disposal trends
- [ ] Predefined reports: asset register, lifecycle summary, disposal summary, 
      transfer history, compliance gaps
- [ ] Custom report builder: multi-field filters, field selection, 
      group/sort/conditional filters, save templates
- [ ] Export options: Excel (.xlsx), PDF, CSV
- [ ] Role-based report access (financial data hidden from unauthorized roles)
- [ ] Optional: Scheduled/recurring report configuration screen

---

### 9. SAP ECC 6.0 INTEGRATION TOUCHPOINTS
Check whether the design surfaces:
- [ ] Integration status indicators (sync state, last sync time)
- [ ] SAP-sourced fields clearly labeled/differentiated in forms
- [ ] Error/conflict handling UI when SAP data is unavailable or mismatched
- [ ] Import log or audit view for SAP-pulled data

---

### 10. NON-FUNCTIONAL / UX REQUIREMENTS
Check for:
- [ ] Responsive design for desktop and laptop
- [ ] Mobile/PDA-optimized views for field inspection
- [ ] Session timeout and re-authentication flow
- [ ] SSO integration screen (optional)
- [ ] Error states, empty states, and loading states across key screens
- [ ] Accessibility considerations (contrast, labels, keyboard navigation)

---

## OUTPUT FORMAT

For each item above, classify it as one of:
✅ Covered — screen/component clearly exists and addresses the requirement  
⚠️ Partial — screen exists but requirement is incomplete or unclear  
❌ Missing — no design representation found  
❓ Unclear — unclear if the current design addresses this; needs clarification

Then provide:
1. A summary table of coverage by feature area (% covered)
2. A prioritized list of gaps (❌ and ⚠️ items) sorted by user impact
3. Specific design recommendations for each gap