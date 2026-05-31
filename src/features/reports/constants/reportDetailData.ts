import type {
  AffectedAsset,
  ComplianceGapDetail,
  DetailNote,
  DetailTimelineEntry,
  PendingAction,
} from '../types'

export const COMPLIANCE_GAP_DETAILS: ComplianceGapDetail[] = [
  {
    id: 'CG-001',
    type: 'Missing Serial Numbers',
    count: 23,
    description: 'Assets registered without serial number identification — non-compliant with asset tracking policy',
    regulation: 'ISO 55001 §8.2',
    dueDate: '2026-02-20',
    assignedTo: 'John Smith',
  },
  {
    id: 'CG-002',
    type: 'Untagged Assets',
    count: 12,
    description: 'Newly procured assets have not been assigned RFID tags for tracking',
    regulation: 'Internal Policy AMP-003',
    dueDate: '2026-03-05',
    assignedTo: 'Mike Chen',
  },
  {
    id: 'CG-003',
    type: 'Overdue Inspection',
    count: 45,
    description: 'Scheduled quarterly inspections have not been completed within the required window',
    regulation: 'ISO 55001 §9.1',
    dueDate: '2026-02-28',
    assignedTo: 'Sarah Johnson',
  },
  {
    id: 'CG-004',
    type: 'Missing Custodian',
    count: 8,
    description: 'Assets without an assigned custodian — accountability chain incomplete',
    regulation: 'Internal Policy AMP-001',
    dueDate: '2026-03-10',
    assignedTo: 'Lisa Wong',
  },
  {
    id: 'CG-005',
    type: 'Incomplete Documentation',
    count: 34,
    description: 'Asset records missing required supporting documents (purchase orders, warranties, manuals)',
    regulation: 'SOX Compliance §404',
    dueDate: '2026-03-20',
    assignedTo: 'David Park',
  },
]

export const PENDING_ACTION_ASSETS: Record<string, AffectedAsset[]> = {
  'PA-001': [
    { id: 'AST-1001', name: 'Dell Latitude 5540', tag: 'RFID-00412', location: 'HQ Floor 3', status: 'Inspection Overdue', category: 'Laptop', lastScanned: '2026-01-10' },
    { id: 'AST-1002', name: 'HP EliteBook 840', tag: 'RFID-00418', location: 'HQ Floor 3', status: 'Inspection Overdue', category: 'Laptop', lastScanned: '2026-01-12' },
    { id: 'AST-1003', name: 'Cisco Switch 2960', tag: 'RFID-00501', location: 'Server Room A', status: 'Inspection Overdue', category: 'Networking', lastScanned: '2026-01-15' },
    { id: 'AST-1004', name: 'APC UPS 1500VA', tag: 'RFID-00502', location: 'Server Room A', status: 'Inspection Overdue', category: 'Power', lastScanned: '2026-01-15' },
    { id: 'AST-1005', name: 'Dell OptiPlex 7090', tag: 'RFID-00425', location: 'HQ Floor 2', status: 'Inspection Pending', category: 'Desktop', lastScanned: '2026-02-01' },
  ],
  'PA-002': [
    { id: 'AST-2001', name: 'Canon ImageRunner C3530', tag: 'RFID-00601', location: 'Branch A', status: 'Awaiting Approval', category: 'Printer', lastScanned: '2026-02-10' },
    { id: 'AST-2002', name: 'Epson WF-7840', tag: 'RFID-00602', location: 'Branch A', status: 'Awaiting Approval', category: 'Printer', lastScanned: '2026-02-10' },
    { id: 'AST-2003', name: 'HP LaserJet Pro M404', tag: 'RFID-00610', location: 'HQ Floor 1', status: 'Disposal Requested', category: 'Printer', lastScanned: '2026-02-08' },
  ],
  'PA-003': [
    { id: 'AST-3001', name: 'MacBook Pro 16"', tag: '—', location: 'Warehouse', status: 'Untagged', category: 'Laptop', lastScanned: 'Never' },
    { id: 'AST-3002', name: 'Lenovo ThinkPad X1', tag: '—', location: 'Warehouse', status: 'Untagged', category: 'Laptop', lastScanned: 'Never' },
    { id: 'AST-3003', name: 'Samsung Monitor 27"', tag: '—', location: 'Warehouse', status: 'Untagged', category: 'Monitor', lastScanned: 'Never' },
    { id: 'AST-3004', name: 'Logitech Webcam C920', tag: '—', location: 'Warehouse', status: 'Untagged', category: 'Peripheral', lastScanned: 'Never' },
  ],
  'PA-004': [
    { id: 'AST-4001', name: 'Dell Monitor P2422H', tag: 'RFID-00710', location: 'In Transit', status: 'Pending Acknowledgment', category: 'Monitor', lastScanned: '2026-02-23' },
    { id: 'AST-4002', name: 'HP Docking Station G5', tag: 'RFID-00711', location: 'In Transit', status: 'Pending Acknowledgment', category: 'Peripheral', lastScanned: '2026-02-23' },
  ],
  'PA-005': [
    { id: 'AST-5001', name: 'Cisco IP Phone 8845', tag: 'RFID-00820', location: 'Branch B', status: 'Verification Pending', category: 'Phone', lastScanned: '2026-02-20' },
    { id: 'AST-5002', name: 'Polycom VVX 450', tag: 'RFID-00821', location: 'Branch B', status: 'Verification Pending', category: 'Phone', lastScanned: '2026-02-20' },
    { id: 'AST-5003', name: 'Jabra Speak 750', tag: 'RFID-00822', location: 'Branch B', status: 'Verification Pending', category: 'Peripheral', lastScanned: '2026-02-20' },
  ],
}

export const COMPLIANCE_GAP_ASSETS: Record<string, AffectedAsset[]> = {
  'CG-001': [
    { id: 'AST-1101', name: 'Dell Latitude 5540', tag: 'RFID-00412', location: 'HQ Floor 3', status: 'No Serial', category: 'Laptop', issue: 'Serial number field is blank' },
    { id: 'AST-1102', name: 'HP EliteBook 840', tag: 'RFID-00418', location: 'HQ Floor 3', status: 'No Serial', category: 'Laptop', issue: 'Serial number field is blank' },
    { id: 'AST-1103', name: 'Cisco Switch 2960', tag: 'RFID-00501', location: 'Server Room A', status: 'No Serial', category: 'Networking', issue: 'Serial not captured at procurement' },
    { id: 'AST-1104', name: 'APC UPS 1500VA', tag: 'RFID-00502', location: 'Server Room A', status: 'No Serial', category: 'Power', issue: 'Label unreadable — needs physical check' },
    { id: 'AST-1105', name: 'Dell OptiPlex 7090', tag: 'RFID-00425', location: 'HQ Floor 2', status: 'No Serial', category: 'Desktop', issue: 'Serial number field is blank' },
  ],
  'CG-002': [
    { id: 'AST-2101', name: 'MacBook Pro 16"', tag: '—', location: 'Warehouse', status: 'Untagged', category: 'Laptop', issue: 'No RFID tag assigned' },
    { id: 'AST-2102', name: 'Lenovo ThinkPad X1', tag: '—', location: 'Warehouse', status: 'Untagged', category: 'Laptop', issue: 'No RFID tag assigned' },
    { id: 'AST-2103', name: 'Samsung Monitor 27"', tag: '—', location: 'Warehouse', status: 'Untagged', category: 'Monitor', issue: 'No RFID tag assigned' },
    { id: 'AST-2104', name: 'Logitech Webcam C920', tag: '—', location: 'Warehouse', status: 'Untagged', category: 'Peripheral', issue: 'No RFID tag assigned' },
  ],
  'CG-003': [
    { id: 'AST-3101', name: 'HP ProLiant DL380', tag: 'RFID-00301', location: 'Data Center', status: 'Overdue', category: 'Server', issue: 'Last inspected 2025-10-15 — 140+ days ago' },
    { id: 'AST-3102', name: 'Dell PowerEdge R740', tag: 'RFID-00302', location: 'Data Center', status: 'Overdue', category: 'Server', issue: 'Last inspected 2025-11-01 — 120+ days ago' },
    { id: 'AST-3103', name: 'Cisco Catalyst 9300', tag: 'RFID-00510', location: 'Server Room B', status: 'Overdue', category: 'Networking', issue: 'Never inspected since deployment' },
    { id: 'AST-3104', name: 'Fortinet FortiGate 200F', tag: 'RFID-00520', location: 'Server Room A', status: 'Overdue', category: 'Security', issue: 'Last inspected 2025-09-20 — 160+ days ago' },
    { id: 'AST-3105', name: 'NetApp FAS2750', tag: 'RFID-00330', location: 'Data Center', status: 'Overdue', category: 'Storage', issue: 'Last inspected 2025-10-01 — 150+ days ago' },
  ],
  'CG-004': [
    { id: 'AST-4101', name: 'Canon ImageRunner C3530', tag: 'RFID-00601', location: 'Branch A', status: 'No Custodian', category: 'Printer', issue: 'Previous custodian departed — not reassigned' },
    { id: 'AST-4102', name: 'Epson WF-7840', tag: 'RFID-00602', location: 'Branch A', status: 'No Custodian', category: 'Printer', issue: 'Custodian field blank since registration' },
    { id: 'AST-4103', name: 'HP LaserJet Pro M404', tag: 'RFID-00610', location: 'HQ Floor 1', status: 'No Custodian', category: 'Printer', issue: 'Previous custodian transferred to Branch B' },
  ],
  'CG-005': [
    { id: 'AST-5101', name: 'Dell Latitude 7430', tag: 'RFID-00700', location: 'HQ Floor 4', status: 'Incomplete Docs', category: 'Laptop', issue: 'Missing purchase order document' },
    { id: 'AST-5102', name: 'Cisco Meraki MR46', tag: 'RFID-00540', location: 'Branch B', status: 'Incomplete Docs', category: 'Networking', issue: 'Missing warranty certificate' },
    { id: 'AST-5103', name: 'Poly Studio X50', tag: 'RFID-00830', location: 'HQ Conference Rm', status: 'Incomplete Docs', category: 'AV Equipment', issue: 'Missing installation manual & warranty' },
    { id: 'AST-5104', name: 'Zebra TC52', tag: 'RFID-00900', location: 'Warehouse', status: 'Incomplete Docs', category: 'Handheld', issue: 'Missing purchase order & delivery receipt' },
  ],
}

export const PENDING_ACTION_TIMELINES: Record<string, DetailTimelineEntry[]> = {
  'PA-001': [
    { date: '2026-02-27', user: 'System', event: 'Auto-escalated to high priority — 12 days overdue' },
    { date: '2026-02-20', user: 'John Smith', event: 'Requested deadline extension — awaiting manager approval' },
    { date: '2026-02-15', user: 'System', event: 'Inspection deadline reached — status changed to overdue' },
    { date: '2026-02-01', user: 'John Smith', event: 'Inspection task assigned' },
  ],
  'PA-002': [
    { date: '2026-02-25', user: 'Sarah Johnson', event: 'Submitted disposal request for 7 assets' },
    { date: '2026-02-24', user: 'Sarah Johnson', event: 'Completed asset condition assessment' },
    { date: '2026-02-20', user: 'System', event: 'Disposal workflow initiated' },
  ],
  'PA-003': [
    { date: '2026-02-26', user: 'Mike Chen', event: 'Received 4 new RFID tags from vendor' },
    { date: '2026-02-22', user: 'Mike Chen', event: 'Ordered replacement RFID tags — 8 remaining' },
    { date: '2026-02-18', user: 'System', event: 'Tagging task created for 12 untagged assets' },
  ],
  'PA-004': [
    { date: '2026-02-26', user: 'Lisa Wong', event: 'Follow-up email sent to Branch B receiving team' },
    { date: '2026-02-23', user: 'System', event: 'Transfer shipped — awaiting Branch B acknowledgment' },
    { date: '2026-02-20', user: 'Lisa Wong', event: 'Transfer request approved by manager' },
  ],
  'PA-005': [
    { date: '2026-02-25', user: 'David Park', event: 'Verification checklist partially completed (2/3)' },
    { date: '2026-02-22', user: 'David Park', event: 'On-site visit scheduled for Feb 28' },
    { date: '2026-02-19', user: 'System', event: 'Post-transfer verification task created' },
  ],
}

export const COMPLIANCE_GAP_TIMELINES: Record<string, DetailTimelineEntry[]> = {
  'CG-001': [
    { date: '2026-02-28', user: 'System', event: 'Compliance scan detected 23 assets without serial numbers' },
    { date: '2026-02-25', user: 'John Smith', event: 'Started manual serial number audit for HQ Floor 3' },
    { date: '2026-02-20', user: 'System', event: 'Gap flagged as high severity — exceeds 20-asset threshold' },
    { date: '2026-02-15', user: 'Admin', event: 'Compliance gap auto-created from weekly scan' },
  ],
  'CG-002': [
    { date: '2026-02-27', user: 'Mike Chen', event: 'Ordered 15 RFID tags from vendor — ETA 3 business days' },
    { date: '2026-02-22', user: 'System', event: 'Compliance scan found 12 newly procured assets without RFID tags' },
    { date: '2026-02-18', user: 'Admin', event: 'Gap created — tagging policy requires tags within 5 business days of receipt' },
  ],
  'CG-003': [
    { date: '2026-02-28', user: 'System', event: 'Auto-escalated — 45 assets overdue for inspection by 30+ days' },
    { date: '2026-02-20', user: 'Sarah Johnson', event: 'Requested scheduling of inspection teams for Data Center assets' },
    { date: '2026-02-15', user: 'System', event: 'Quarterly inspection window closed — 45 assets not inspected' },
    { date: '2026-01-15', user: 'Admin', event: 'Q1 inspection cycle initiated' },
  ],
  'CG-004': [
    { date: '2026-02-26', user: 'Lisa Wong', event: 'Identified 3 assets where custodians have transferred or departed' },
    { date: '2026-02-22', user: 'System', event: 'Custodian gap detected — 8 assets with no assigned owner' },
    { date: '2026-02-20', user: 'HR System', event: 'Employee departure triggered custodian review' },
  ],
  'CG-005': [
    { date: '2026-02-27', user: 'David Park', event: 'Contacted vendors for replacement warranty certificates' },
    { date: '2026-02-24', user: 'David Park', event: 'Completed documentation audit — 34 assets flagged' },
    { date: '2026-02-20', user: 'System', event: 'Compliance scan identified missing documents for 34 assets' },
  ],
}

export const PENDING_ACTION_NOTES: Record<string, DetailNote[]> = {
  'PA-001': [
    { date: '2026-02-20', user: 'John Smith', note: 'Some assets in Server Room A require downtime window for inspection. Coordinating with IT Ops.' },
    { date: '2026-02-16', user: 'Admin', note: 'Priority raised to high due to compliance requirements. Must complete before Q1 audit.' },
  ],
  'PA-002': [
    { date: '2026-02-25', user: 'Sarah Johnson', note: 'All 7 assets have been assessed. 3 eligible for recycling, 4 for write-off. Awaiting finance sign-off.' },
  ],
  'PA-003': [
    { date: '2026-02-26', user: 'Mike Chen', note: 'Vendor delivered batch of 20 tags. Will begin tagging warehouse assets on Monday.' },
  ],
  'PA-004': [
    { date: '2026-02-26', user: 'Lisa Wong', note: "Branch B team says they haven't received the shipment yet. Checking with logistics." },
  ],
  'PA-005': [
    { date: '2026-02-25', user: 'David Park', note: 'Two of three devices verified and working. Last device (Jabra Speak) has audio issue — may need replacement.' },
  ],
}

export const COMPLIANCE_GAP_NOTES: Record<string, DetailNote[]> = {
  'CG-001': [
    { date: '2026-02-25', user: 'John Smith', note: 'Floor 3 audit in progress. Some older assets have worn labels — may need physical inspection to retrieve serial numbers from hardware.' },
    { date: '2026-02-20', user: 'Admin', note: 'This gap blocks ISO 55001 re-certification. Must resolve before Q1 audit deadline.' },
  ],
  'CG-002': [
    { date: '2026-02-27', user: 'Mike Chen', note: 'RFID tags ordered. Will schedule tagging session for warehouse assets once tags arrive. Need access badge for Warehouse Zone B.' },
  ],
  'CG-003': [
    { date: '2026-02-20', user: 'Sarah Johnson', note: 'Data Center inspections require scheduled downtime windows. Coordinating with IT Ops for weekend availability.' },
  ],
  'CG-004': [
    { date: '2026-02-26', user: 'Lisa Wong', note: 'Working with HR to identify replacement custodians for 3 departed employees. Remaining 5 assets need management assignment.' },
  ],
  'CG-005': [
    { date: '2026-02-27', user: 'David Park', note: 'Vendors contacted for 12 missing warranties. Internal PO lookup in progress for remaining 22 assets. Finance team assisting.' },
  ],
}

export function resolvePendingActionDetail(actionId: string, actions: PendingAction[]) {
  const action = actions.find((item) => item.id === actionId)
  if (!action) return null
  return {
    action,
    assets: PENDING_ACTION_ASSETS[actionId] ?? [],
    timeline: PENDING_ACTION_TIMELINES[actionId] ?? [],
    notes: PENDING_ACTION_NOTES[actionId] ?? [],
  }
}

export function resolveComplianceGapDetail(gapType: string) {
  const gap = COMPLIANCE_GAP_DETAILS.find((item) => item.type === gapType)
  if (!gap) return null
  return {
    gap,
    assets: COMPLIANCE_GAP_ASSETS[gap.id] ?? [],
    timeline: COMPLIANCE_GAP_TIMELINES[gap.id] ?? [],
    notes: COMPLIANCE_GAP_NOTES[gap.id] ?? [],
  }
}
