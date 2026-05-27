import React, { useState } from 'react';
import { formatDate } from '../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowBack,
  Search,
  CheckCircle,
  Person,
  OpenInNew,
  Inventory2 as Package,
  AccessTime,
  Warning as AlertCircle,
  Assignment,
  Gavel,
  ChevronLeft,
  Edit,
  Description as FileText,
  LocationOn as MapPin,
} from '@mui/icons-material';
import { toast } from 'sonner';

type ActionType = 'inspection' | 'disposal' | 'transfer' | 'tagging' | 'verification';

interface PendingActionData {
  id: string;
  type: ActionType;
  description: string;
  assetCount: number;
  dueDate: string;
  assignedTo: string;
}

const PENDING_ACTIONS: PendingActionData[] = [
  { id: 'PA-001', type: 'inspection', description: 'Quarterly inspection overdue for IT assets', assetCount: 18, dueDate: '2026-02-15', assignedTo: 'John Smith' },
  { id: 'PA-002', type: 'disposal', description: 'Pending disposal approval for retired equipment', assetCount: 7, dueDate: '2026-03-01', assignedTo: 'Sarah Johnson' },
  { id: 'PA-003', type: 'tagging', description: 'RFID tags not assigned to newly registered assets', assetCount: 12, dueDate: '2026-03-05', assignedTo: 'Mike Chen' },
  { id: 'PA-004', type: 'transfer', description: 'Pending transfer acknowledgments from Branch B', assetCount: 5, dueDate: '2026-03-10', assignedTo: 'Lisa Wong' },
  { id: 'PA-005', type: 'verification', description: 'Post-transfer verification incomplete', assetCount: 3, dueDate: '2026-03-15', assignedTo: 'David Park' },
];

const MOCK_AFFECTED_ASSETS: Record<string, { id: string; name: string; tag: string; location: string; status: string; category: string; lastScanned: string }[]> = {
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
};

const MOCK_TIMELINE: Record<string, { date: string; user: string; event: string }[]> = {
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
};

const MOCK_NOTES: Record<string, { date: string; user: string; note: string }[]> = {
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
    { date: '2026-02-26', user: 'Lisa Wong', note: 'Branch B team says they haven\'t received the shipment yet. Checking with logistics.' },
  ],
  'PA-005': [
    { date: '2026-02-25', user: 'David Park', note: 'Two of three devices verified and working. Last device (Jabra Speak) has audio issue — may need replacement.' },
  ],
};

function getActionIcon(type: ActionType) {
  switch (type) {
    case 'inspection': return <Search className="w-5 h-5" />;
    case 'disposal': return <Gavel className="w-5 h-5" />;
    case 'transfer': return <Package className="w-5 h-5" />;
    case 'tagging': return <Assignment className="w-5 h-5" />;
    case 'verification': return <CheckCircle className="w-5 h-5" />;
  }
}

function getActionIconSmall(type: ActionType) {
  switch (type) {
    case 'inspection': return <Search className="w-4 h-4" />;
    case 'disposal': return <Gavel className="w-4 h-4" />;
    case 'transfer': return <Package className="w-4 h-4" />;
    case 'tagging': return <Assignment className="w-4 h-4" />;
    case 'verification': return <CheckCircle className="w-4 h-4" />;
  }
}

function getTypeLabel(type: ActionType) {
  switch (type) {
    case 'inspection': return 'Requires physical check';
    case 'disposal': return 'Needs approval workflow';
    case 'transfer': return 'Awaiting acknowledgment';
    case 'tagging': return 'RFID assignment needed';
    case 'verification': return 'Post-action verification';
  }
}

interface PendingActionDetailProps {
  actionId: string;
  onBack: () => void;
}

export default function PendingActionDetail({ actionId, onBack }: PendingActionDetailProps) {
  const [assetSearch, setAssetSearch] = useState('');
  const [newNote, setNewNote] = useState('');

  const action = PENDING_ACTIONS.find(a => a.id === actionId);

  if (!action) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">Action not found</p>
        <Button variant="outline" onClick={onBack}>
          <ArrowBack className="w-4 h-4 mr-2" />
          Back to Reporting
        </Button>
      </div>
    );
  }

  const isOverdue = formatDate(action.dueDate) < formatDate();
  const daysUntilDue = Math.ceil((formatDate(action.dueDate).getTime() - formatDate().getTime()) / (1000 * 60 * 60 * 24));
  const allAssets = MOCK_AFFECTED_ASSETS[action.id] || [];
  const timeline = MOCK_TIMELINE[action.id] || [];
  const notes = MOCK_NOTES[action.id] || [];

  const filteredAssets = assetSearch
    ? allAssets.filter(a =>
        a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.id.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.tag.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.location.toLowerCase().includes(assetSearch.toLowerCase())
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
            <span className="text-foreground font-medium">{action.id}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl">{action.id}</h2>
            
            {isOverdue && (
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs">
                Overdue
              </Badge>
            )}
            <Badge className="bg-[#121321]/10 text-[#121321] dark:text-white text-[10px] gap-1">
              {getActionIconSmall(action.type)}
              <span className="capitalize">{action.type}</span>
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {action.description} · Assigned to: {action.assignedTo} · {action.assetCount} asset{action.assetCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            className="bg-[#121321][#121321]/90 text-white"
            onClick={() => toast.success(`Action ${action.id} marked as resolved`)}
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
            <p className="text-2xl">{action.assetCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{allAssets.length} listed below</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Due Date</p>
            <p className={`text-2xl ${isOverdue ? 'text-red-600' : ''}`}>
              {formatDate(action.dueDate)}
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
                {action.assignedTo.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <span className="text-sm">{action.assignedTo}</span>
                <p className="text-xs text-muted-foreground">Primary owner</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Action Type</p>
            <div className="flex items-center gap-2 mt-2">
              {getActionIconSmall(action.type)}
              <span className="capitalize text-sm">{action.type}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{getTypeLabel(action.type)}</p>
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
                      <TableHead>Last Scanned</TableHead>
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
                          <TableCell className="text-muted-foreground">{asset.lastScanned}</TableCell>
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

          {/* Action Details Card */}
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
                    {formatDate(timeline[timeline.length - 1]?.date || action.dueDate)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Due Date</span>
                  <span className={`text-sm ${isOverdue ? 'text-red-600' : ''}`}>
                    {formatDate(action.dueDate)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Type</span>
                  <span className="capitalize text-sm">{action.type}</span>
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
                  <span className="text-sm">{action.assetCount}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Assigned To</span>
                  <span className="text-sm">{action.assignedTo}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">Last Updated</span>
                  <span className="text-sm">
                    {formatDate(timeline[0]?.date || action.dueDate)}
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
