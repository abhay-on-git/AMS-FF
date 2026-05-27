 

 

 

 

 

 

 

Provision of Asset Management System 

 

 

 

 

 

 

 

 

 

 

 

 

 

Project scope: 

 The aim of the project is to manage an extensive and diverse portfolio of physical assets across its areas of operation. These include capital and attractive items such as vehicles, IT equipment, medical devices, machinery, furniture, and buildings. Currently, asset management practices are fragmented and vary across field offices. This results in inefficiencies, inconsistencies in reporting, and challenges in ensuring compliance with IPSAS standards and audit requirements. To address these challenges, we are seeking to procure a commercially available, off-the-shelf asset management system that can be configured or customized to meet the institution’s operational, administrative, and compliance needs. The objective is not to develop a new system from scratch, but to adopt an existing, proven solution that aligns with best practices and can be tailored to Our workflows. The selected system must support the full lifecycle of asset management — from acquisition and registration to tracking, inspection, transfer, and disposal — while enabling centralized control and field-level functionality. It should integrate with SAP ECC 6.0 ERP, which is the institution’s enterprise resource planning system and current source for procurement-related asset data. The solution must also support field operations through online and offline data entry, including compatibility with portable data assistants (PDAs) or equivalent handheld devices.  

 

Purpose:  

The purpose of this Terms of Reference (TOR) is to define the requirements and expectations for acquiring a robust, centralized Asset Management System (AMS) that will enable us to standardize, digitize, and streamline its asset management processes across all five field offices. We are seeking a commercially available, proven asset management system that can be customized to reflect the institution’s specific operational workflows, roles, and reporting requirements. The selected solution must not require full system development but should be readily deployable, configurable, and capable of integrating with existing systems, particularly SAP ECC 6.0 ERP, which serves as the institution’s procurement and logistics backbone. The system will serve as a single authoritative platform for managing the entire lifecycle of physical assets — from registration and assignment to physical inspection, transfer, and eventual disposal. It must provide real-time visibility, enhance compliance with IPSAS asset management standards, and support audit readiness by ensuring data completeness, accuracy, and traceability. The system should also enable secure access based on user roles, provide analytical and operational reporting, and support both centralized oversight by headquarters and operational execution by field offices, including offline capabilities for physical inspections using handheld devices.  

 

Objectives: 

 The Asset Management System (AMS) aims to modernize and standardize our asset management operations across all five field offices by achieving the following key objectives: 

Ensure Real-Time Asset Visibility  

Provide centralized, real-time visibility into the status, location, and ownership of all physical assets, enabling informed decision-making and operational transparency.  

 

Standardize Asset Lifecycle Processes  

Harmonize asset management workflows across all field offices — focusing on registration, inspection, tracking, transfer, and disposal — without incorporating full financial accounting or maintenance management functions. 

  

Leverage Integration with SAP ECC 6.0 ERP  

Enable seamless integration with SAP ECC 6.0 ERP, our existing ERP system, to retrieve procurement-related data (e.g., purchase order numbers, goods receipt numbers, item descriptions) during the asset registration process.  

 

Enable Field-Level Operations and Inspections  

Support physical inspections and updates using PDAs or similar devices with both online and offline data capture capabilities, allowing field staff to work efficiently in areas with limited connectivity.  

 

Enhance Administrative Oversight and Access Control 

 Provide administrative users with full control over asset records — including editing, archiving, and deletion — while maintaining secure, role-based access for other user types (e.g., inspectors, auditors, field officers).  

 

Support Regulatory and Audit Compliance 

 Ensure that asset data management aligns with IPSAS standards and internal audit requirements, with audit trails, asset history logs, and traceability features in place. 

 

Include Basic Financial Reference Data  

While not managing financial accounting, the system must retain essential financial metadata for each asset — such as purchase value, PO number, GRN, acquisition date, and net book value — to support reporting and reconciliation.  

 

 

Enable Reporting and Analytics  

Provide robust reporting functionality with predefined and customizable report templates to support monitoring, audit readiness, and data-driven decision-making.  

 

 

Stakeholders: 

The following stakeholders will interact with or rely on the Asset Management System (AMS) to support asset registration, inspection, tracking, reporting, and overall lifecycle management across our operations:  

 

System Users: These are operational staff members involved2 in the day-to-day handling of assets:  

Supply and Material Inspection Officers (SMIOs) – responsible for registering assets upon receipt. 

Field Property Inspectors (FPIs) – conduct physical inspections, tagging, and updates to asset condition or location. 

port asset documentation, location assignment, and ensure compliance with internal procedures. 

 

System Administrators:  

These users have elevated access privileges and are responsible for the overall configuration, control, and data integrity of the AMS: 

Asset Management Unit (CSSD) – full administrative access to review, edit, archive, or delete asset records; oversee system-wide reporting and compliance.  

Designated Field Administrators (DITID or delegated roles) – local administrators at the field office level with defined administrative rights for user management and support. 

 

Management and Oversight Bodies: 

 These users require data access and reporting to support strategic decision-making, audit compliance, and oversight: 

CSSD Headquarters Asset Team – monitors compliance across field offices and provides operational support.  

Finance and Audit Units – review asset records during internal or external audits, requiring accurate reporting, traceability, and data integrity. 

Senior Management – require dashboards and summary reports to support high-level asset oversight, planning, and decision-making.  

 

External Auditors (Read-Only): 

May be granted restricted, view-only access during defined periods for the purpose of:  

Verifying the existence, condition, and compliance status of selected assets 

Reviewing disposal and registration documentation 

 

Key Features: 

The Proposed Asset Management System must include, at a minimum, the following core features. These functionalities must be available out-of-the-box or achievable through configuration or customization of an existing platform. Solutions requiring full development from scratch will not be considered.  

 

Key Feature 1-Asset Registration 

The system must support a structured, automated, and auditable asset registration process that integrates with SAP ECC 6.0 ERP, reduces manual data entry, and ensures accurate classification between capital and attractive items. 

 

Functional Requirements:  

 

SAP ECC 6.0 ERP Integration:  

Upon Goods Receipt (GRN) posting in SAP, the system must automatically create a draft asset entry using available procurement data.  

Auto-populated fields must include:  

Purchase Order (PO) number  

GRN number  

Item description  

Supplier name  

Quantity, unit price, total cost  

Acquisition date and currency 

 

Asset ID Assignment Logic:  

For capital items (≥ USD 2,000): the system must retrieve and apply the official SAP asset ID.  

For attractive items (< USD 2,000): the system must automatically generate a unique internal asset ID. 

 

 

 

Automated Classification:  

The system must apply configurable rules to classify assets based on value and item type (capital vs attractive).  

User override should only be allowed for authorized roles with audit logging. 

 

Completion Workflow:  

The draft entry is assigned to the relevant Supply/Material Inspection Officer (SMIO) or Field Admin.  

User completes:  

Serial number (if applicable)  

Custodian  

Room/building/site location  

Asset condition  

Barcode or tag ID 

 

Bulk Registration Support:  

Pre-filled Excel templates available for download with draft entries from SAP. 

Users complete only missing data and re-upload.  

System validates completeness, duplicate serials, and classification logic upon import.  

 

Validation and Controls: 

Mandatory fields enforced before submission.  

Duplicate detection for serial numbers and PO items.  

Audit trail automatically captures all user actions related to asset creation and modification.  

 

Key Feature 2 – Asset Tracking and Status Monitoring 

The system must provide real-time visibility and historical traceability of all assets across the five field offices. It must allow users to view, filter, and search for assets by multiple parameters while capturing all changes to asset status, location, and custodianship through an auditable history.  

 

 

 

 

 

Key Feature 3 – Asset Transfer Management 

The system must support secure, structured, and auditable transfer of assets across custodians, departments, locations, and field offices. All asset transfers must be recorded with traceable logs, supported by documentation, and follow role-based workflows based on the type of transfer. 

 

Functional Requirements:  

 

Types of Transfers Supported:  

Intra-departmental: Within the same location or unit 

Intra-field: Between departments or buildings within the same field office  

Inter-field: Between different field offices  

 

Transfer Workflow:  

Transfer initiated by an authorized user (e.g., SMIO, Admin Officer)  

Asset(s) selected and assigned to a new:  

Custodian  

Physical location (site, building, room)  

Field office (if applicable) o Transfer reason must be recorded o System assigns a unique transfer ID and updates asset record  

 

Transfer Form Generation and Signature Workflow:  

Upon initiating a transfer, the system must auto-generate a pre-filled transfer template (PDF) that includes:  

Asset details (ID, description, serial number)  

Current and new custodian/location  

Transfer date, reason, and initiating user  

Transfer ID  

Signature fields for:  

Initiating officer  

Receiving custodian 

 Approving officer (if applicable)  

The form may be:  

Signed digitally using supported formats (e.g., Adobe Acrobat, DocuSign, or internal UN tools)  

Printed for manual signature  

Once signed, it must be uploaded back into the system and stored as an attachment linked to the transfer record  

 

Validation and Controls:  

System must validate:  

That user has transfer rights  

That custodian and location are valid and active 

Prevent transfer if asset is:  

Marked as disposed, missing, or under survey  

Enforce approval workflow for inter-field or high-value transfers  

 

Audit and History Logging:  

Every transfer must be logged with: 

Date and time  

Previous and new custodian/location  

User initiating the transfer  

Reason provided  

Full transfer history must be visible in the asset’s audit trail 

 

Notifications and Acknowledgments:  

Optional system alerts to notify receiving custodian and supervisor  

Option to require digital acknowledgment or confirmation of asset receipt in the system  

 

Reporting:  

Generate transfer reports filtered by:  

Field office  

Date range  

Custodian  

Transfer reason  

Completion status (pending acknowledgment or fully closed) 

 

Key Feature 4 – Asset Lifecycle Management 

The system must support the full operational lifecycle of an asset — from acquisition and registration to assignment, inspection, transfer, retirement, and disposal — with audit-ready traceability and controlled transitions. Financial accounting and maintenance functions are not required but basic metadata should be retained.  

 

Functional Requirements:  

Lifecycle Stages:  

Registered 

In Use  

Transferred 

Under Verification  

Available  

Damaged  

Retired (pending disposal)  

Disposed (final)  

 

 

Status Transition Controls:  

Role-based permissions to update asset status  

Logical rules to prevent invalid transitions (e.g., from “Disposed” back to “In Use”)  

Mandatory justification/comment fields where applicable  

Audit logging for each status change  

 

Link to Disposal Process:  

Assets marked “Retired” must be flagged for survey/disposal processing  

Final disposal status can only be applied once internal approvals are completed  

Disposal records must retain method, date, and supporting documentation reference  

 

Historical Traceability:  

Full asset lifecycle history visible to authorized users 

Track changes in status, location, custodian, and administrative actions  

History must be exportable for audit purposes 

 

Administrative Controls:  

Admin users may override or correct lifecycle records (with full audit trail)  

Configurable alerts for assets stuck in “Retired” or “Damaged” status beyond a defined period 

 

 

Key Feature 5 – Survey and Disposal Workflow Management 

The system must facilitate structured, traceable workflows for the review and disposal of assets that are no longer serviceable. It must allow for disposal case creation, survey report generation, and enforcement of proper approval before any asset can be marked as disposed. 

 

Functional Requirements: 

 

Survey Case Initiation: 

Users can initiate a disposal/survey case for one or more assets 

System assigns a unique case reference  

Required metadata pulled automatically (ID, description, NBV, location, reason) 

 

Report Generation: 

Auto-generate a disposal report in PDF or editable format  

Pre-filled with asset details and disposal rationale  

Includes signature fields or digital approval placeholders 

 

Disposal Control Logic: 

Assets in a survey case are locked from deletion/disposal until the case is approved  

System must capture and link:  

Date of approval  

Disposal method  

Uploaded scanned or digital repo 

 

Audit Trail and Documentation: 

Full record of:  

Case initiator  

Actions taken and by whom  

Disposal confirmation  

Historical reports available for review 

 

 

Configurable Workflow: 

Ability to support different review processes (HQ, field, local) 

Optional alerting for pending survey cases or items awaiting disposal beyond a threshold 

 

 

 

Key Feature 6 – Role-Based Access Control 

The system must enforce a secure and flexible Role-Based Access Control model to ensure that users only access features and data relevant to their roles and responsibilities. This is critical for maintaining data integrity, confidentiality, and operational control across our decentralized structure. 

Functional Requirements: 

Predefined Role Types: 

Administrator  

Full access to all functionalities, including asset registration, editing, transfers, lifecycle management, user management, and reporting.  

  

Standard User (e.g., SMIO, Admin Officer)  

Can register and update asset information, perform transfers, submit disposal requests, and run  

reports for their assigned region.  

 

Auditor (Read-Only)  

View-only access to all asset data, history, and reports for audit and compliance purposes.  

 

Approver/Reviewer (Optional)  

May approve asset transfers, survey cases, or lifecycle changes based on workflow rules.  

 

Custom Roles  

System must allow configuration of additional roles with specific access rights (e.g., Disposal  

Focal Point, PDA User). 

 

 

Access Controls:  

Permissions must be configurable at:  

Feature/module level (e.g., access to disposal or reporting tools)  

Action level (e.g., view, edit, delete, approve)  

Field-level (optional – e.g., hide cost data for non-financial users)  

Access restricted by location or field office where applicable 

 

User Management Features:  

Admins must be able to:  

Create and deactivate user accounts   

Assign or update roles  

View user activity logs  

 

 

Security Compliance:  

Enforce session timeouts and password policies  

Optionally support integration with Single Sign-On if requires  

 

Audit Logging:  

All user actions (create/edit/delete) must be captured and available for review  

Logs must be exportable and filterable by user, action type, and date range 

 

Key Feature 7 – Reporting and Analytics  

The system must support both operational and strategic decision-making by providing robust reporting and analytics capabilities. Users must be able to generate predefined reports, customize queries, and export data in common formats to meet internal reporting, audit, compliance, and planning needs. 

 

 

Functional Requirements:  

Predefined Reports:  

The system must include ready-to-use reports such as:  

Asset register by field office, location, or custodian  

Lifecycle status summary (e.g., retired, in use, damaged) 

Disposal summary (e.g., by method, value, time period)  

Transfer history per asset or department  

Compliance gaps (e.g., missing serials, untagged items) 

 

 

Custom Report Builder:  

Authorized users must be able to:  

Filter data by multiple fields (e.g., category, status, location, PO number)  

Select which fields to include in the report  

Group, sort, and apply conditional filters 

Save commonly used queries or templates 

 

Export Options:  

Export formats must include:  

Excel (.xlsx), PDF, and CSV  

Reports must be downloadable or shareable within the system  

 

Dashboard and Visualization Tools:  

System must provide visual dashboards with charts/tables showing:  

Total asset value and count by field/location  

Breakdown by lifecycle stage  

Pending actions (e.g., assets not yet inspected or disposed)  

Survey case volume or disposal trends  

 

Scheduled Reporting (Optional):  

Option to schedule recurring reports to be emailed or generated on a set timeline (e.g., monthly compliance report)  

 

Security and Permissions:  

Reporting access must respect role-based permissions  

Sensitive fields (e.g., financial data) must only be visible to authorized roles 

 

Key feature 8 - Physical Inspection and PDA Integration   

 

The system must support physical asset verification across our locations, including through the use of handheld devices (PDAs). It must enable secure, efficient, and auditable inspections both online and offline — with support for inspection task assignment, condition updates, signature confirmation, and automatic report generation.  

Optional Support for QR Code and RFID Scanning  

While we are  currently uses a barcode-based tagging system, vendors are encouraged to indicate whether their inspection tools support QR code or RFID scanning. This functionality is optional, but systems that offer flexible tag-reading capabilities — including the ability to transition to newer tagging technologies in the future — will be viewed positively for modernization readiness. 

 

Functional Requirements:  

Inspection Module:  

Authorized users must be able to:  

Select or be assigned inspection tasks by location, custodian, or asset 

type  

Mark assets as “Verified,” “Missing,” “Damaged,” or “Requires Action”  

Enter inspection notes, update asset condition or location if applicable 

 

PDA and Offline Inspection Capability:  

System must integrate with PDAs or equivalent mobile devices and support:  

Barcode/QR code scanning for asset identification  

Offline operation with sync when reconnected   

Customizable inspection checklists  

Image capture (e.g., tag photos, damage evidence)  

Sync only assigned inspection batches to the device  

 

Inspection Confirmation & Signature:  

At the end of each inspection task, the system must:  

Require digital sign-off by the inspector (name, timestamp)  

Optionally include second-level approval or supervisor confirmation  

Log all sign-offs in the asset and inspection history  

 

 

 

Automatic Inspection Report Generation:  

Upon task completion and sign-off, the system must:  

Auto-generate a standardized inspection report (PDF and/or Excel)  

Report must include:  

Asset IDs, status (verified/missing/damaged), notes, photos  

Inspector name and timestamp) 

Summary statistics (total inspected, % verified, exceptions)  

 

Reports must be:  

Stored in the system under the task and linked assets  

Exportable by authorized users  

Optionally emailed to responsible focal points  

 

Inspection Scheduling and Progress Tracking:  

Admins must be able to:  

Assign inspection tasks by location/custodian  

Monitor progress and completion rates  

View overdue inspections or exceptions by location  

 

Audit and Reporting:  

All inspection activities must be logged in asset history 

Full inspection logs must be retrievable per asset or per batch  

Reports support audit, compliance, and internal control needs 

 

 

 

Key Feature 9 – System Demonstration Requirement  

Vendors who meet the minimum technical requirements during the evaluation process will be invited to participate in a mandatory system demonstration session. 

The purpose of the demonstration is to validate the functional capabilities, usability, and operational suitability of the proposed Asset Management System in line with our requirements.  

The demonstration must cover (at minimum):  

Asset registration and tagging process  

Asset tracking and physical inspection  

Role-based access and user experience  

Basic reporting and analytics  

Offline functionality 

 

6. Non-Functional Requirements  

In addition to the core functional capabilities, the proposed Asset Management System must meet the following non-functional requirements to ensure performance, security, scalability, and long-term sustainability across all of our field offices and operations.  

Usability  

The system must have a user-friendly, intuitive interface suitable for both administrative and field-level users.  

Interfaces should be responsive and support use on standard desktop and laptop computers.  

 

Scalability  

The system must be capable of handling:  

A minimum of 250,000 assets across all field offices.  

At least 200 concurrent users without performance degradation.  

The architecture must support horizontal or vertical scaling as data volume and usage grow.  

 

Performance  

Average response time for page loads and searches should not exceed 2 seconds under standard load.  

Asset queries and report generation must perform efficiently, even with large datasets. 

 

Availability and Reliability  

The system must ensure at least 99.5% uptime during core business hours  

Scheduled maintenance must be communicated in advance and minimized during business hours.  

In case of system outages, recovery must be possible within an acceptable timeframe defined in the SLA.  

 

Security  

The system must support role-based access control and enforce user authentication protocols.  

The system must include:  

Audit trails for all user actions 

Access logs and change history for critical records   

Compliance with our internal information security policies is required.  

 

Data Retention and Backup  

The system must retain historical asset data and logs as per our retention policy (minimum 5 years or as specified).  

Regular system backups must be maintained, with the ability to restore data in case of failure.  

 

Integration Readiness  

The system must integrate with SAP ECC 6.0 ERP using API-based or secure file-based methods. 

Synchronization must support:  

Asset data import (Pos, GRNs, etc.)  

Real-time or scheduled updates from SAP 

  

PDA/handheld integration for inspections must be supported (online/offline sync capability).  

 

Maintainability and Vendor Support  

The vendor must provide a clear support and maintenance plan, including:  

o post-implementation support (remote or on-site)  

o Bug fixing timelines and escalation procedures  

o Regular system updates  

Documentation must be provided for:  

o System configuration and administration  

o User manuals and training guides  

 

Evaluation Methodology 

Proposals will be evaluated in two phases:  

 Technical Evaluation – 70% weighting  

Financial Evaluation – 30% weighting  

 

 

Payment Terms  

Vendors are requested to provide a detailed financial proposal covering both one-time and recurring costs, aligned  

with the following payment structure: 

  

System Development and Integration (One-Time Cost)  

The one-time cost associated with the customization, development, configuration, and integration of the Asset Management System shall be paid against clearly defined implementation milestones. Vendors must outline proposed milestones in their technical and financial proposals.  

 

 

 

Maintenance and Support (Recurring Annual Cost)  

The vendor shall quote an annual recurring cost for system maintenance and technical support. This should include:   

Bug fixes and patches  

Minor enhancements  

User support and helpdesk services  

 

 

 

 

 