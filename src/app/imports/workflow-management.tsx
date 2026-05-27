
Create a new enterprise module named:

WORKFLOW MANAGEMENT

Purpose:
Allow System Admin to configure, manage, and deploy approval workflows for system cases such as:

- Asset Transfer
- Disposal
- Survey
- Inspection
- Custom Case Types

IMPORTANT:
This is an enterprise configuration module.
Design must be structured, data-dense, and MUI-compatible.
Follow Chorus branding and AMS theme (#121321 primary).

Do NOT simplify logic.
This module must support complex approval chains.

--------------------------------------------------
MODULE LOCATION
--------------------------------------------------

Add under:
System Admin → Workflow Management

--------------------------------------------------
MAIN WORKFLOW LIST SCREEN
--------------------------------------------------

Create a Workflow Management dashboard.

Table columns:

- Workflow Name
- Case Type (Transfer / Disposal / Inspection / Survey / Custom)
- Status (Active / Draft / Archived)
- Version
- Last Modified
- Modified By
- Assigned To (Field-specific / Global)
- Steps Count
- Actions (Edit / Clone / Archive / View)

Top-right buttons:

- + Create Workflow (Primary - #121321)
- Import Template (Outlined)
- Export Workflow (Outlined)

Include:
- Search by workflow name
- Filter by case type
- Filter by status

--------------------------------------------------
CREATE / EDIT WORKFLOW SCREEN
--------------------------------------------------

Open in full-page editor view.

--------------------------------------------------
SECTION 1 – WORKFLOW BASIC INFO
--------------------------------------------------

Fields:

- Workflow Name
- Description
- Case Type (Dropdown)
- Applicable Field Office (All / Specific Field)
- Enable Auto-Trigger (Yes/No)
- Trigger Condition (if auto-triggered)
- Version Number (auto-managed)
- Status (Draft / Active)

--------------------------------------------------
SECTION 2 – VISUAL WORKFLOW BUILDER (CORE FEATURE)
--------------------------------------------------

Create a visual step-based workflow builder.

Use vertical stepper or flow-diagram style.

Each step must include:

- Step Name
- Step Type:
   - Approval
   - Review
   - Auto-Approval
   - Conditional Branch
   - Parallel Approval
- Assigned Role (Admin / SMIO / Field Inspector / HQ / Custom Role)
- SLA Duration (days)
- Escalation Rule
- Required Comments (Yes/No)
- Attachment Required (Yes/No)
- Status Outcome

Allow:

- Add Step
- Delete Step
- Reorder Steps (drag & drop)
- Add Conditional Branch

--------------------------------------------------
CONDITIONAL LOGIC SUPPORT
--------------------------------------------------

Allow rules such as:

IF Asset Value > 5000 → Require HQ Approval
IF Field = North Office → Add Regional Manager Approval
IF Status = Missing → Escalate to Admin

Add:
- Condition Builder UI
- Field selector
- Operator (>, <, =, contains)
- Value input

--------------------------------------------------
PARALLEL APPROVAL SUPPORT
--------------------------------------------------

Allow multiple roles to approve simultaneously.

Display visually as parallel branches.

Add configuration:
- Require ALL approvals
- Require ANY approval

--------------------------------------------------
SECTION 3 – NOTIFICATION SETTINGS
--------------------------------------------------

Per step configure:

- Notify on assignment
- Notify on approval
- Notify on rejection
- Notify on SLA breach

Channels:
- In-app
- Email

--------------------------------------------------
SECTION 4 – ESCALATION RULES
--------------------------------------------------

If SLA breached:

- Escalate to Role
- Escalate to Specific User
- Auto-approve after X days
- Notify Supervisor

--------------------------------------------------
SECTION 5 – WORKFLOW PREVIEW MODE
--------------------------------------------------

Add Preview button.

Show simulation panel:

User selects:
- Asset Type
- Value
- Field
- Case Type

System shows:
- Generated approval chain

--------------------------------------------------
SECTION 6 – VERSION CONTROL
--------------------------------------------------

When workflow is edited:

- Create new version
- Maintain version history table
- Show change log
- Allow revert to previous version

--------------------------------------------------
SECTION 7 – WORKFLOW USAGE TRACKING
--------------------------------------------------

Add tab:

"Workflow Usage"

Show:
- Number of active cases using this workflow
- Completion rate
- Average approval time
- SLA breaches count

--------------------------------------------------
CASE INTEGRATION
--------------------------------------------------

Ensure UI indicates:

- Which workflows are linked to:
   - Transfer
   - Disposal
   - Survey
   - Inspection

In those modules, show:

“Workflow: Disposal Approval v2”

--------------------------------------------------
ROLE PERMISSIONS
--------------------------------------------------

Only System Admin can:
- Create
- Edit
- Archive
- Activate

Auditor:
- View only
- Export configuration

--------------------------------------------------
STATES TO INCLUDE
--------------------------------------------------

- Empty State (No workflows created)
- Draft State
- Active State
- Archived State
- Validation Errors
- Confirmation Dialog before Activation

--------------------------------------------------
DESIGN RULES
--------------------------------------------------

- Primary color: #121321
- Accent border: #EF652B (minimal usage)
- MUI Stepper or Card-based layout
- Use Drawer for step editing
- Use Dialog for confirmations
- Enterprise compact spacing
- Avoid excessive color

--------------------------------------------------
FINAL OBJECTIVE
--------------------------------------------------

The Workflow Management module must:

• Allow admin-defined approval flows
• Support conditional branching
• Support parallel approvals
• Support SLA & escalation
• Support version control
• Integrate with existing modules
• Be enterprise scalable
• Be audit-ready

This module transforms AMS into a configurable enterprise workflow platform.