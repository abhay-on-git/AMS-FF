import React, { useState } from 'react';
import { formatDate } from '../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  ArrowBack,
  Search,
  CheckCircle,
  Person,
  OpenInNew,
  Inventory2 as Package,
  AccessTime,
  Warning as AlertCircle,
  ChevronLeft,
  Edit,
  Description as FileText,
  LocationOn as MapPin,
  BugReport,
  Build,
  PlaylistAddCheck,
} from '@mui/icons-material';
import { toast } from 'sonner';

interface ComplianceGapData {
  id: string;
  type: string;
  count: number;
  description: string;
  regulation: string;
  dueDate: string;
  assignedTo: string;
}

const COMPLIANCE_GAPS: ComplianceGapData[] = [
  { id: 'CG-001', type: 'Missing Serial Numbers', count: 23, description: 'Assets registered without serial number identification — non-compliant with asset tracking policy', regulation: 'ISO 55001 §8.2', dueDate: '2026-02-20', assignedTo: 'John Smith' },
  { id: 'CG-002', type: 'Untagged Assets', count: 12, description: 'Newly procured assets have not been assigned RFID tags for tracking', regulation: 'Internal Policy AMP-003', dueDate: '2026-03-05', assignedTo: 'Mike Chen' },
  { id: 'CG-003', type: 'Overdue Inspection', count: 45, description: 'Scheduled quarterly inspections have not been completed within the required window', regulation: 'ISO 55001 §9.1', dueDate: '2026-02-28', assignedTo: 'Sarah Johnson' },
  { id: 'CG-004', type: 'Missing Custodian', count: 8, description: 'Assets without an assigned custodian — accountability chain incomplete', regulation: 'Internal Policy AMP-001', dueDate: '2026-03-10', assignedTo: 'Lisa Wong' },
  { id: 'CG-005', type: 'Incomplete Documentation', count: 34, description: 'Asset records missing required supporting documents (purchase orders, warranties, manuals)', regulation: 'SOX Compliance §404', dueDate: '2026-03-20', assignedTo: 'David Park' },
];

const MOCK_AFFECTED_ASSETS: Record<string, { id: string; name: string; tag: string; location: string; status: string; category: string; issue: string }[]> = {
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
};

const MOCK_TIMELINE: Record<string, { date: string; user: string; event: string }[]> = {
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
};

const MOCK_NOTES: Record<string, { date: string; user: string; note: string }[]> = {
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
};

function getGapIcon(type: string) {
  if (type.includes('Serial')) return <BugReport className="w-4 h-4" />;
  if (type.includes('Untagged')) return <Package className="w-4 h-4" />;
  if (type.includes('Inspection')) return <PlaylistAddCheck className="w-4 h-4" />;
  if (type.includes('Custodian')) return <Person className="w-4 h-4" />;
  if (type.includes('Documentation')) return <FileText className="w-4 h-4" />;
  return <AlertCircle className="w-4 h-4" />;
}

function getGapTypeLabel(type: string) {
  if (type.includes('Serial')) return 'Requires data entry or physical verification';
  if (type.includes('Untagged')) return 'RFID tag assignment needed';
  if (type.includes('Inspection')) return 'Schedule and complete inspections';
  if (type.includes('Custodian')) return 'Assign responsible custodians';
  if (type.includes('Documentation')) return 'Upload or obtain missing documents';
  return 'Compliance remediation required';
}

interface ComplianceGapDetailProps {
  gapType: string;
  onBack: () => void;
}

export default function ComplianceGapDetail({ gapType, onBack }: ComplianceGapDetailProps) {
  const [assetSearch, setAssetSearch] = useState('');
  const [newNote, setNewNote] = useState('');

  const gap = COMPLIANCE_GAPS.find(g => g.type === gapType);

  if (!gap) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">Compliance gap not found</p>
        <Button variant="outline" onClick={() => { window.location.hash = 'reporting'; onBack(); }}>
          <ArrowBack className="w-4 h-4 mr-2" />
          Back to Reporting & Analytics
        </Button>
      </div>
    );
  }

  const isOverdue = formatDate(gap.dueDate) < formatDate();
  const daysUntilDue = Math.ceil((formatDate(gap.dueDate).getTime() - formatDate().getTime()) / (1000 * 60 * 60 * 24));
  const allAssets = MOCK_AFFECTED_ASSETS[gap.id] || [];
  const timeline = MOCK_TIMELINE[gap.id] || [];
  const notes = MOCK_NOTES[gap.id] || [];

  const filteredAssets = assetSearch
    ? allAssets.filter(a =>
        a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.id.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.tag.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.location.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.issue.toLowerCase().includes(assetSearch.toLowerCase())
      )
    : allAssets;

  const handleAddNote = () => {
    if (newNote.trim()) {
      toast.success('Note added successfully');
      setNewNote('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm mb-2">
            <button
              onClick={() => { window.location.hash = 'reporting'; onBack(); }}
              className="text-muted-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => { window.location.hash = 'reporting'; onBack(); }}
              className="text-muted-foreground transition-colors"
            >
              Reporting & Analytics
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{gap.id}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl">{gap.id}</h2>
            {isOverdue && (
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs">
                Overdue
              </Badge>
            )}
            <Badge className="bg-[#121321]/10 text-[#121321] dark:text-white text-[10px] gap-1">
              {getGapIcon(gap.type)}
              <span>{gap.type}</span>
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {gap.description} · Regulation: {gap.regulation} · {gap.count} asset{gap.count !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            className="bg-[#121321][#121321]/90 text-white"
            onClick={() => toast.success(`Gap ${gap.id} marked as resolved`)}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Resolve
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.info('Reassignment dialog would open')}>
            <Person className="w-4 h-4 mr-1" />
            Reassign
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Affected Assets</p>
            <p className="text-2xl">{gap.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{allAssets.length} listed below</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Remediation Deadline</p>
            <p className={`text-2xl ${isOverdue ? 'text-red-600' : ''}`}>
              {formatDate(gap.dueDate)}
            </p>
            <p className={`text-xs mt-1 ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
              {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days remaining`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-full bg-[#121321] text-white flex items-center justify-center text-xs">
                {gap.assignedTo.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <span className="text-sm">{gap.assignedTo}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Regulation</p>
            <div className="flex items-center gap-2 mt-2">
              <Build className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{gap.regulation}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{getGapTypeLabel(gap.type)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Two-column layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Affected Assets + Notes */}
        <div className="col-span-2 space-y-6">
          {/* Affected Assets */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="w-5 h-5" />
                  Affected Assets
                  <Badge variant="outline" className="ml-1">{allAssets.length}</Badge>
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => toast.info('Would navigate to filtered Assets view')}>
                  <OpenInNew className="w-3 h-3 mr-1" />
                  View in Assets
                </Button>
              </div>
              <div className="mt-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assets by name, ID, tag, or location..."
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>RFID Tag</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No assets match your search
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell className="text-[#121321] dark:text-[#81CCD7]">{asset.id}</TableCell>
                          <TableCell className="">{asset.name}</TableCell>
                          <TableCell className="">{asset.category}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{asset.tag}</code>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              {asset.location}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-[200px]">{asset.issue}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{asset.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-5 h-5" />
                Notes
                <Badge variant="outline" className="ml-1">{notes.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notes.map((note, idx) => (
                  <div key={idx} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#121321] text-white flex items-center justify-center text-[10px]">
                          {note.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm">{note.user}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(note.date)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{note.note}</p>
                  </div>
                ))}

                {/* Add Note */}
                <div className="pt-2 border-t">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[80px] mb-2"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="bg-[#121321][#121321]/90 text-white"
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                    >
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activity Timeline + Details */}
        <div className="space-y-6">
          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AccessTime className="w-5 h-5" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {timeline.map((entry, idx) => (
                  <div key={idx} className="flex gap-3 pb-4 relative">
                    {idx < timeline.length - 1 && (
                      <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border" />
                    )}
                    <div className="w-[15px] shrink-0 pt-0.5">
                      <div
                        className={`w-[15px] h-[15px] rounded-full border-2 ${
                          idx === 0
                            ? 'bg-[#121321] border-[#121321]'
                            : 'bg-background border-muted-foreground/30'
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(entry.date)} · {entry.user}
                      </p>
                      <p className="text-sm mt-0.5">{entry.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gap Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Edit className="w-5 h-5" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {formatDate(timeline[timeline.length - 1]?.date || gap.dueDate)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Deadline</span>
                  <span className={`text-sm ${isOverdue ? 'text-red-600' : ''}`}>
                    {formatDate(gap.dueDate)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Gap Type</span>
                  <span className="text-sm text-right max-w-[160px]">{gap.type}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Regulation</span>
                  <span className="text-sm text-right max-w-[160px]">{gap.regulation}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Badge variant="outline" className={isOverdue ? 'border-red-300 text-red-600' : ''}>
                    {isOverdue ? 'Overdue' : 'In Progress'}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Asset Count</span>
                  <span className="text-sm">{gap.count}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Assigned To</span>
                  <span className="text-sm">{gap.assignedTo}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Last Updated</span>
                  <span className="text-sm">
                    {formatDate(timeline[0]?.date || gap.dueDate)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
