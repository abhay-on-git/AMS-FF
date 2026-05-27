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