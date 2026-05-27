import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDate } from '../../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Add as Plus,
  Search,
  Visibility as Eye,
  Description as FileText,
  ArrowForward as ArrowRight,
  Person as User,
  LocationOn as MapPin,
  Event as Calendar,
  Warning as AlertCircle,
  CheckCircle,
  Cancel as XCircle,
  Download,
  Refresh as RotateCcw,
  ChevronLeft,
} from '@mui/icons-material';
import { toast } from 'sonner';

interface Transfer {
  id: string;
  transferCode: string;
  fromCustodian: string;
  toCustodian: string;
  fromLocation: string;
  toLocation: string;
  assetCount: number;
  status: 'draft' | 'pending-approval' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

type ViewMode = 'list' | 'detail' | 'create';

export default function Transfers() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subView, setSubView] = useState<'all' | 'my-transfers' | 'pending-approvals'>('all');

  const [transfers] = useState<Transfer[]>([
    {
      id: '1',
      transferCode: 'TRF-2024-001',
      fromCustodian: 'John Doe',
      toCustodian: 'Jane Smith',
      fromLocation: 'Office A1-01',
      toLocation: 'Office B2-03',
      assetCount: 5,
      status: 'pending-approval',
      requestedBy: 'John Doe',
      requestedDate: '2024-12-28',
      notes: 'Transfer for new project assignment'
    },
    {
      id: '2',
      transferCode: 'TRF-2024-002',
      fromCustodian: 'Bob Wilson',
      toCustodian: 'Sarah Chen',
      fromLocation: 'Warehouse B1',
      toLocation: 'Office A1-05',
      assetCount: 3,
      status: 'approved',
      requestedBy: 'Bob Wilson',
      requestedDate: '2024-12-27',
      approvedBy: 'Admin',
      approvedDate: '2024-12-28',
      notes: 'Equipment deployment to new office'
    },
    {
      id: '3',
      transferCode: 'TRF-2024-003',
      fromCustodian: 'Alice Brown',
      toCustodian: 'David Lee',
      fromLocation: 'Office A1-02',
      toLocation: 'Office A1-04',
      assetCount: 2,
      status: 'completed',
      requestedBy: 'Alice Brown',
      requestedDate: '2024-12-26',
      approvedBy: 'Manager',
      approvedDate: '2024-12-27'
    },
  ]);

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch = 
      transfer.transferCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.fromCustodian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.toCustodian.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    
    // Filter by sub-view
    if (subView === 'my-transfers') {
      return matchesSearch && matchesStatus && transfer.requestedBy === 'John Doe'; // Mock current user
    } else if (subView === 'pending-approvals') {
      return matchesSearch && transfer.status === 'pending-approval';
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'approved':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'pending-approval':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 dark:text-red-300';
      case 'draft':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
    }
  };

  const handleViewDetail = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setViewMode('detail');
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedTransfer(null);
  };

  const handlePullback = (transferId: string) => {
    toast.success('Transfer request pulled back');
    handleBack();
  };

  const handleApprove = (transferId: string) => {
    toast.success('Transfer approved successfully');
    handleBack();
  };

  const handleReject = (transferId: string) => {
    toast.error('Transfer rejected');
    handleBack();
  };

  if (viewMode === 'detail' && selectedTransfer) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <button
                onClick={handleBack}
                className="text-muted-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleBack}
                className="text-muted-foreground transition-colors"
              >
                Transfer Requests
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{selectedTransfer.transferCode}</span>
            </div>
            <h2 className="text-2xl font-bold">{selectedTransfer.transferCode}</h2>
            <p className="text-sm text-muted-foreground">Transfer Request Details</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(selectedTransfer.status)}>
              {selectedTransfer.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transfer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Transfer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">From Custodian</Label>
                    <p className="font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedTransfer.fromCustodian}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">To Custodian</Label>
                    <p className="font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedTransfer.toCustodian}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">From Location</Label>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedTransfer.fromLocation}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">To Location</Label>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedTransfer.toLocation}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Asset Count</Label>
                    <p className="font-medium">{selectedTransfer.assetCount} items</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Requested Date</Label>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedTransfer.requestedDate)}
                    </p>
                  </div>
                </div>
                {selectedTransfer.notes && (
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="text-sm mt-1">{selectedTransfer.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Linked Assets */}
            <Card>
              <CardHeader>
                <CardTitle>Assets in Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[15px]">Asset ID</TableHead>
                        <TableHead className="text-[15px]">Name</TableHead>
                        <TableHead className="text-[15px]">Type</TableHead>
                        <TableHead className="text-[15px]">Current Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-['Manrope']">LAP-001234</TableCell>
                        <TableCell>Dell Latitude 5520</TableCell>
                        <TableCell>Laptop</TableCell>
                        <TableCell>{selectedTransfer.fromLocation}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-['Manrope']">MON-001237</TableCell>
                        <TableCell>Dell U2720Q 27"</TableCell>
                        <TableCell>Monitor</TableCell>
                        <TableCell>{selectedTransfer.fromLocation}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Status */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedTransfer.status === 'pending-approval' && (
                  <>
                    <Button className="w-full text-[15px]" onClick={() => handleApprove(selectedTransfer.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Transfer
                    </Button>
                    <Button variant="destructive" className="w-full text-[15px]" onClick={() => handleReject(selectedTransfer.id)}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Transfer
                    </Button>
                  </>
                )}
                {selectedTransfer.status === 'draft' && (
                  <Button className="w-full text-[15px]">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit for Approval
                  </Button>
                )}
                {(selectedTransfer.status === 'draft' || selectedTransfer.status === 'pending-approval') && (
                  <Button variant="outline" className="w-full text-[15px]" onClick={() => handlePullback(selectedTransfer.id)}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Pull Back Request
                  </Button>
                )}
                <Button variant="outline" className="w-full text-[15px]">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div className="w-0.5 h-12 bg-gray-200"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selectedTransfer.requestedDate).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">by {selectedTransfer.requestedBy}</p>
                    </div>
                  </div>
                  {selectedTransfer.approvedDate && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Approved</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(selectedTransfer.approvedDate).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">by {selectedTransfer.approvedBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'create') {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm mb-2">
            <button
              onClick={handleBack}
              className="text-muted-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleBack}
              className="text-muted-foreground transition-colors"
            >
              Transfer Requests
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Create Request</span>
          </div>
          <h2 className="text-2xl font-bold">Create Transfer Request</h2>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Custodian</Label>
                  <Select>
                    <SelectTrigger className="text-[15px]">
                      <SelectValue placeholder="Select custodian" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="john" className="text-[15px]">John Doe</SelectItem>
                      <SelectItem value="bob" className="text-[15px]">Bob Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Custodian</Label>
                  <Select>
                    <SelectTrigger className="text-[15px]">
                      <SelectValue placeholder="Select custodian" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="jane" className="text-[15px]">Jane Smith</SelectItem>
                      <SelectItem value="sarah" className="text-[15px]">Sarah Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>From Location</Label>
                  <Select>
                    <SelectTrigger className="text-[15px]">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="a1-01" className="text-[15px]">Office A1-01</SelectItem>
                      <SelectItem value="a1-02" className="text-[15px]">Office A1-02</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Location</Label>
                  <Select>
                    <SelectTrigger className="text-[15px]">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                      <SelectItem value="b2-03" className="text-[15px]">Office B2-03</SelectItem>
                      <SelectItem value="b2-04" className="text-[15px]">Office B2-04</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Add notes about this transfer..." rows={3} />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  After creating the transfer, you'll be able to add assets to it.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" className="text-[15px]" onClick={handleBack}>Cancel</Button>
                <Button className="text-[15px]" onClick={() => {
                  toast.success('Transfer created successfully');
                  handleBack();
                }}>Create Transfer</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <Tabs value={subView} onValueChange={(v) => setSubView(v as typeof subView)}>
        <TabsList>
          <TabsTrigger value="all">All Transfers</TabsTrigger>
          <TabsTrigger value="my-transfers">My Transfers</TabsTrigger>
          <TabsTrigger value="pending-approvals">
            Pending Approvals
            <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
              {transfers.filter(t => t.status === 'pending-approval').length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button className="text-[15px]" onClick={() => setViewMode('create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Transfer
          </Button>
        </div>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transfer code, custodian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-[15px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 text-[15px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="z-50 w-[var(--radix-select-trigger-width)] bg-white dark:bg-[#1e2240]">
                <SelectItem value="all" className="text-[15px]">All Status</SelectItem>
                <SelectItem value="draft" className="text-[15px]">Draft</SelectItem>
                <SelectItem value="pending-approval" className="text-[15px]">Pending Approval</SelectItem>
                <SelectItem value="approved" className="text-[15px]">Approved</SelectItem>
                <SelectItem value="completed" className="text-[15px]">Completed</SelectItem>
                <SelectItem value="rejected" className="text-[15px]">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[15px]">Transfer Code</TableHead>
                  <TableHead className="text-[15px]">From</TableHead>
                  <TableHead className="text-[15px]">To</TableHead>
                  <TableHead className="text-[15px]">Assets</TableHead>
                  <TableHead className="text-[15px]">Status</TableHead>
                  <TableHead className="text-[15px]">Requested Date</TableHead>
                  <TableHead className="text-[15px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.id} className="cursor-pointer/50">
                    <TableCell className="font-medium font-['Manrope']">{transfer.transferCode}</TableCell>
                    <TableCell>
                      <div className="text-[15px]">
                        <p className="font-medium">{transfer.fromCustodian}</p>
                        <p className="text-muted-foreground text-xs">{transfer.fromLocation}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[15px]">
                        <p className="font-medium">{transfer.toCustodian}</p>
                        <p className="text-muted-foreground text-xs">{transfer.toLocation}</p>
                      </div>
                    </TableCell>
                    <TableCell>{transfer.assetCount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transfer.status)}>
                        {transfer.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(transfer.requestedDate)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => handleViewDetail(transfer)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransfers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No transfers found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
